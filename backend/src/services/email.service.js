const crypto = require('crypto');

const EMAIL_DELIVERY_ERROR =
  'Không thể gửi email lúc này. Vui lòng thử lại sau.';
const APPS_SCRIPT_TIMEOUT_MS = 30000;

const signEmailRequest = payload => {
  const secret = process.env.EMAIL_APPS_SCRIPT_SECRET;

  if (!secret) {
    throw new Error('EMAIL_APPS_SCRIPT_SECRET is not configured.');
  }

  const canonicalPayload = [
    payload.timestamp,
    payload.type,
    payload.to,
    payload.name,
    payload.actionUrl,
    payload.nonce
  ].join('\n');

  return crypto
    .createHmac('sha256', Buffer.from(secret, 'utf8'))
    .update(canonicalPayload, 'utf8')
    .digest('hex');
};

const sendEmail = async ({ type, email, name, actionUrl }) => {
  const endpoint = process.env.EMAIL_APPS_SCRIPT_URL;

  if (!endpoint || !process.env.EMAIL_APPS_SCRIPT_SECRET) {
    const error = new Error(EMAIL_DELIVERY_ERROR);
    error.code = 'EMAIL_DELIVERY_FAILED';
    throw error;
  }

  if (process.env.EMAIL_APPS_SCRIPT_SECRET.length < 32) {
    const error = new Error(EMAIL_DELIVERY_ERROR);
    error.code = 'EMAIL_DELIVERY_FAILED';
    throw error;
  }

  let endpointUrl;
  try {
    endpointUrl = new URL(endpoint);
  } catch {
    const error = new Error(EMAIL_DELIVERY_ERROR);
    error.code = 'EMAIL_DELIVERY_FAILED';
    throw error;
  }

  if (endpointUrl.protocol !== 'https:') {
    const error = new Error(EMAIL_DELIVERY_ERROR);
    error.code = 'EMAIL_DELIVERY_FAILED';
    throw error;
  }

  const payload = {
    timestamp: Date.now(),
    type,
    to: email,
    name: name || '',
    actionUrl,
    nonce: crypto.randomBytes(16).toString('hex')
  };
  const signature = signEmailRequest(payload);

  let response;
  let stage = 'POST';

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...payload,
        signature
      }),
      signal: AbortSignal.timeout(APPS_SCRIPT_TIMEOUT_MS)
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const redirectUrl = response.headers.get('location');

      if (!redirectUrl) {
        throw new Error('Email endpoint returned a redirect without a location.');
      }

      response = await fetch(redirectUrl, {
        signal: AbortSignal.timeout(APPS_SCRIPT_TIMEOUT_MS)
      });
      stage = 'redirect response';
    }

    if (!response.ok) {
      const error = new Error(`HTTP_${response.status}`);
      error.code = `HTTP_${response.status}`;
      throw error;
    }

    const result = await response.json();

    if (result.success !== true) {
      const error = new Error(
        typeof result.code === 'string'
          ? result.code
          : 'DELIVERY_NOT_CONFIRMED'
      );
      error.code = error.message;
      throw error;
    }

    return result;
  } catch (cause) {
    if (cause.code === 'INVALID_SIGNATURE') {
      const canonicalPayload = [
        payload.timestamp,
        payload.type,
        payload.to,
        payload.name,
        payload.actionUrl,
        payload.nonce
      ].join('\n');

      console.error('[EMAIL] Signature diagnostic:', {
        secretFingerprint: crypto
          .createHash('sha256')
          .update(process.env.EMAIL_APPS_SCRIPT_SECRET, 'utf8')
          .digest('hex')
          .slice(0, 12),
        payloadFingerprint: crypto
          .createHash('sha256')
          .update(canonicalPayload, 'utf8')
          .digest('hex')
          .slice(0, 12),
        signaturePrefix: signature.slice(0, 12)
      });
    }

    console.error('[EMAIL] Delivery failed:', {
      type,
      stage,
      error: cause.name,
      code: cause.code || 'UNKNOWN'
    });

    const error = new Error(EMAIL_DELIVERY_ERROR);
    error.code = 'EMAIL_DELIVERY_FAILED';
    throw error;
  }
};

const sendPasswordResetEmail = (email, resetLink, name = '') =>
  sendEmail({
    type: 'password_reset',
    email,
    name,
    actionUrl: resetLink
  });

const sendEmailVerificationEmail = (email, verifyLink, name = '') =>
  sendEmail({
    type: 'email_verification',
    email,
    name,
    actionUrl: verifyLink
  });

module.exports = {
  sendPasswordResetEmail,
  sendEmailVerificationEmail
};

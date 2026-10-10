const MAX_REQUEST_AGE_MS = 5 * 60 * 1000;

function authorizeMailSending() {
  MailApp.getRemainingDailyQuota();
}

function doPost(event) {
  try {
    const request = JSON.parse(event.postData.contents);
    validateRequest_(request);
    sendMessage_(request);

    return jsonResponse_({ success: true });
  } catch (error) {
    console.error('Email request rejected:', error.message);
    return jsonResponse_({
      success: false,
      code: safeErrorCode_(error.message)
    });
  }
}

function safeErrorCode_(message) {
  const knownErrors = {
    'Required script properties are missing.': 'CONFIG_MISSING',
    'Request timestamp is invalid or expired.': 'INVALID_TIMESTAMP',
    'Request fields are invalid.': 'INVALID_FIELDS',
    'Action URL is not allowed.': 'ORIGIN_MISMATCH',
    'Request signature is invalid.': 'INVALID_SIGNATURE',
    'Request nonce is invalid.': 'INVALID_NONCE',
    'Request has already been processed.': 'REPLAYED_REQUEST',
    'Daily email quota has been reached.': 'QUOTA_EXCEEDED',
    'Gmail rejected the message.': 'MAIL_SEND_FAILED'
  };

  return knownErrors[message] || 'SCRIPT_ERROR';
}

function validateRequest_(request) {
  const secret = PropertiesService.getScriptProperties()
    .getProperty('EMAIL_APPS_SCRIPT_SECRET');
  const frontendOrigin = PropertiesService.getScriptProperties()
    .getProperty('FRONTEND_ORIGIN');

  if (!secret || secret.length < 32 || !frontendOrigin) {
    throw new Error('Required script properties are missing.');
  }

  if (
    !request ||
    !Number.isSafeInteger(request.timestamp) ||
    Math.abs(Date.now() - request.timestamp) > MAX_REQUEST_AGE_MS
  ) {
    throw new Error('Request timestamp is invalid or expired.');
  }

  if (
    !['email_verification', 'password_reset'].includes(request.type) ||
    typeof request.to !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.to) ||
    typeof request.name !== 'string' ||
    typeof request.actionUrl !== 'string'
  ) {
    throw new Error('Request fields are invalid.');
  }

  const actionPath = request.type === 'email_verification'
    ? '/verify-email?token='
    : '/reset-password?token=';
  const allowedActionPrefix = frontendOrigin.replace(/\/$/, '') + actionPath;

  if (
    !request.actionUrl.startsWith(allowedActionPrefix) ||
    !/^[a-f0-9]{64}$/.test(request.actionUrl.slice(allowedActionPrefix.length))
  ) {
    throw new Error('Action URL is not allowed.');
  }

  const canonicalPayload = [
    request.timestamp,
    request.type,
    request.to,
    request.name,
    request.actionUrl,
    request.nonce
  ].join('\n');
  const expectedSignature = Utilities.computeHmacSha256Signature(
    canonicalPayload,
    secret,
    Utilities.Charset.UTF_8
  ).map(byte => (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, '0')).join('');

  if (
    typeof request.signature !== 'string' ||
    request.signature.length !== expectedSignature.length ||
    !constantTimeEquals_(request.signature, expectedSignature)
  ) {
    console.error('Signature diagnostic:', JSON.stringify({
      secretFingerprint: sha256Hex_(secret).slice(0, 12),
      payloadFingerprint: sha256Hex_(canonicalPayload).slice(0, 12),
      expectedSignaturePrefix: expectedSignature.slice(0, 12),
      receivedSignaturePrefix:
        typeof request.signature === 'string'
          ? request.signature.slice(0, 12)
          : 'missing'
    }));
    throw new Error('Request signature is invalid.');
  }

  if (
    typeof request.nonce !== 'string' ||
    !/^[a-f0-9]{32}$/.test(request.nonce)
  ) {
    throw new Error('Request nonce is invalid.');
  }

  const cache = CacheService.getScriptCache();
  const nonceKey = `email-request:${request.nonce}`;

  if (cache.get(nonceKey)) {
    throw new Error('Request has already been processed.');
  }

  cache.put(nonceKey, '1', 600);
}

function sendMessage_(request) {
  const recipientName = request.name || 'bạn';
  const escapedRecipientName = escapeHtml_(recipientName);
  const escapedActionUrl = escapeHtml_(request.actionUrl);
  const isVerification = request.type === 'email_verification';
  const subject = isVerification
    ? 'Xác thực địa chỉ email | FashionHub'
    : 'Đặt lại mật khẩu | FashionHub';
  const title = isVerification
    ? 'Xác thực địa chỉ email'
    : 'Yêu cầu đặt lại mật khẩu';
  const actionLabel = isVerification
    ? 'Xác thực tài khoản'
    : 'Đặt lại mật khẩu';
  const explanation = isVerification
    ? 'Cảm ơn bạn đã đăng ký FashionHub. Vui lòng xác thực địa chỉ email để hoàn tất quá trình đăng ký và sử dụng tài khoản.'
    : 'Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản FashionHub. Sử dụng nút bên dưới để tạo mật khẩu mới. Mật khẩu hiện tại sẽ được giữ nguyên nếu bạn không hoàn tất thao tác này.';
  const expiry = '15 phút';
  const safetyNote = isVerification
    ? 'Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email. Tài khoản sẽ không được xác thực nếu bạn không nhấn vào liên kết.'
    : 'Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không bị thay đổi.';
  const htmlBody = [
    '<!doctype html>',
    '<html lang="vi">',
    '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>',
    '<body style="margin:0;padding:0;background-color:#f5f5f6;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Arial,Helvetica,sans-serif;color:#333">',
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${title} - FashionHub</div>`,
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f6;padding:40px 16px">',
    '<tr><td align="center">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#fff;border:1px solid #e9e7e8;border-radius:12px">',
    '<tr><td style="padding:40px 40px 36px">',
    `<h1 style="margin:0 0 24px;font-size:24px;line-height:1.35;font-weight:600;letter-spacing:-.3px;color:#292929">${title}</h1>`,
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#383838">Xin chào ${escapedRecipientName},</p>`,
    `<p style="margin:0 0 28px;font-size:15px;line-height:1.8;color:#555">${explanation}</p>`,
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px">',
    `<tr><td align="center" bgcolor="#b95769" style="background-color:#b95769;border-radius:7px">`,
    `<a href="${escapedActionUrl}" style="display:inline-block;padding:14px 28px;border:1px solid #b95769;border-radius:7px;color:#fff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;font-weight:bold;letter-spacing:.2px">${actionLabel}</a>`,
    '</td></tr>',
    '</table>',
    `<p style="margin:0 0 20px;font-size:13px;line-height:1.7;color:#777">Liên kết bảo mật này sẽ hết hạn sau <strong style="color:#444">${expiry}</strong>.</p>`,
    '<p style="margin:0 0 8px;font-size:13px;line-height:1.7;color:#777">Nếu nút phía trên không hoạt động, bạn có thể mở liên kết này:</p>',
    `<p style="margin:0 0 28px;font-size:13px;line-height:1.7;word-break:break-all"><a href="${escapedActionUrl}" style="color:#a64e5e;text-decoration:underline">${escapedActionUrl}</a></p>`,
    `<p style="margin:0;padding:16px 18px;background-color:#faf7f8;border:1px solid #f0e7e9;border-radius:7px;font-size:13px;line-height:1.7;color:#666">${safetyNote}</p>`,
    '<p style="margin:28px 0 0;font-size:14px;line-height:1.8;color:#555">Trân trọng,<br><strong style="font-weight:600;color:#333">Đội ngũ FashionHub</strong></p>',
    '</td></tr>',
    '<tr><td style="padding:20px 32px;border-top:1px solid #eee;text-align:center;font-size:12px;line-height:1.7;color:#999">',
    'Email này được gửi tự động. Vui lòng không trả lời trực tiếp.',
    '</td></tr>',
    '</table>',
    '</td></tr>',
    '</table>',
    '</body>',
    '</html>'
  ].join('');
  const textBody = [
    `FashionHub | ${title}`,
    `Xin chào ${recipientName},`,
    explanation,
    `${actionLabel}:`,
    request.actionUrl,
    `Liên kết này sẽ hết hạn sau ${expiry}.`,
    safetyNote,
    'Trân trọng,',
    'Đội ngũ FashionHub',
    '',
    'Đây là email tự động, vui lòng không trả lời email này.'
  ].join('\n\n');

  if (MailApp.getRemainingDailyQuota() < 1) {
    throw new Error('Daily email quota has been reached.');
  }

  try {
    MailApp.sendEmail({
      to: request.to,
      subject,
      body: textBody,
      htmlBody,
      name: 'FashionHub'
    });
  } catch (error) {
    console.error('MailApp send failed:', error.message);
    throw new Error('Gmail rejected the message.');
  }
}

function constantTimeEquals_(left, right) {
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);

  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return difference === 0;
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sha256Hex_(value) {
  return Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    value,
    Utilities.Charset.UTF_8
  ).map(byte => (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, '0')).join('');
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

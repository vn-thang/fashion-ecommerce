const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const from = process.env.MAIL_FROM || 'onboarding@resend.dev';

const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `"FashionHub" <${from}>`,
      to: [email],
      subject: 'Đặt lại mật khẩu - FashionHub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Đặt lại mật khẩu</h2>

          <p>Xin chào,</p>

          <p>
            Chúng tôi nhận được yêu cầu đặt lại mật khẩu
            cho tài khoản của bạn.
          </p>

          <p>
            Nhấn vào nút bên dưới để tạo mật khẩu mới:
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${resetLink}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background: #ee4d2d;
                color: white;
                text-decoration: none;
                border-radius: 4px;
              "
            >
              Đặt lại mật khẩu
            </a>
          </div>

          <p>
            Liên kết này chỉ có hiệu lực trong 15 phút.
          </p>

          <p>
            Nếu bạn không yêu cầu đặt lại mật khẩu,
            hãy bỏ qua email này.
          </p>

          <p>
            Trân trọng,<br/>
            FashionHub
          </p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw new Error(error.message);
    }

    console.log('✅ Password reset email sent:', data);

    return data;
  } catch (error) {
    console.error('❌ Gửi email đặt lại mật khẩu thất bại:', {
      message: error.message
    });

    throw error;
  }
};

const sendEmailVerificationEmail = async (
  email,
  verifyLink
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `"FashionHub" <${from}>`,
      to: [email],
      subject: 'Xác thực tài khoản - FashionHub',
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
          color: #333;
        ">

          <h2 style="color: #c36374;">
            Chào mừng bạn đến với FashionHub!
          </h2>

          <p>Xin chào,</p>

          <p>
            Cảm ơn bạn đã đăng ký tài khoản tại
            <strong>FashionHub</strong>.
          </p>

          <p>
            Để hoàn tất đăng ký và bảo vệ tài khoản,
            vui lòng xác thực địa chỉ email của bạn
            bằng cách nhấn vào nút bên dưới:
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${verifyLink}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background: #c36374;
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
              "
            >
              Xác thực tài khoản
            </a>
          </div>

          <p>
            Liên kết xác thực này chỉ có hiệu lực trong
            <strong>15 phút</strong>.
          </p>

          <p>
            Nếu bạn không thực hiện đăng ký tài khoản,
            vui lòng bỏ qua email này.
          </p>

          <p style="margin-top: 30px;">
            Trân trọng,<br/>
            <strong>FashionHub</strong>
          </p>

        </div>
      `
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw new Error(error.message);
    }

    console.log('✅ Verification email sent:', data);

    return data;
  } catch (error) {
    console.error(
      '❌ Gửi email xác thực thất bại:',
      {
        message: error.message
      }
    );

    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendEmailVerificationEmail
};
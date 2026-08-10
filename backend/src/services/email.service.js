const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const info = await transporter.sendMail({
      from: `"Fashion Ecommerce" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Đặt lại mật khẩu - Fashion Ecommerce',
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
            Fashion Ecommerce
          </p>
        </div>
      `
    });

    return info;
  } catch (error) {
    console.error('❌ Nodemailer error:', {
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command
    });

    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail
};
import axiosInstance from '../../../shared/api/axios';

export const authApi = {

  login: async (username, password) => {
    try {
      const data = await axiosInstance.post('/auth/login', {
        username,
        password,
      });

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Đăng nhập thất bại!'
      );
    }
  },

  register: async ({ fullName, email, password }) => {
    try {
      const data = await axiosInstance.post('/auth/register', {
        fullName,
        email,
        password,
      });

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Đăng ký thất bại!'
      );
    }
  },

   verifyEmail: async token => {
    try {
      const data = await axiosInstance.get(
        '/auth/verify-email',
        {
          params: { token }
        }
      );

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          'Xác thực email thất bại!'
      );
    }
  },

  resendVerificationEmail: async email => {
    try {
      const data = await axiosInstance.post(
        '/auth/resend-verification',
        {
          email
        }
      );

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          'Không thể gửi lại email xác thực!'
      );
    }
  },

  forgotPassword: async (email) => {
    try {
      const data = await axiosInstance.post('/auth/forgot-password', {
        email,
      });

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Gửi yêu cầu thất bại!'
      );
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const data = await axiosInstance.post('/auth/reset-password', {
        token,
        newPassword,
      });

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Đặt lại mật khẩu thất bại!'
      );
    }
  },

  changePassword: async (currentPassword, newPassword) => {
  try {
    const data = await axiosInstance.put(
      '/auth/change-password',
      {
        currentPassword,
        newPassword,
      }
    );

    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      'Đổi mật khẩu thất bại!'
    );
  }
},

  logout: async () => {
    try {
      const data = await axiosInstance.post('/auth/logout');

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Đăng xuất thất bại!'
      );
    }
  },
};
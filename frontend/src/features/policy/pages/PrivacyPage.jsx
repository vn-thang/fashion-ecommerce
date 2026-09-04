import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const PrivacyPage = () => {
  return (
    <PolicyLayout
      title="Chính sách bảo mật"
      description="FashionHub tôn trọng quyền riêng tư và cam kết bảo vệ thông tin cá nhân của khách hàng."
    >
      <div className="space-y-10 text-sm leading-7 text-gray-600">

        <section>
          <h2 className="policy-title">
            1. Thông tin chúng tôi thu thập
          </h2>

          <p>
            Khi sử dụng FashionHub, khách hàng có thể cung cấp một số
            thông tin cần thiết để tạo tài khoản, đặt hàng và sử dụng
            các dịch vụ trên website.
          </p>

          <ul className="policy-list">
            <li>Họ và tên.</li>
            <li>Số điện thoại.</li>
            <li>Địa chỉ giao hàng.</li>
            <li>Địa chỉ email.</li>
            <li>Thông tin liên quan đến đơn hàng và giao dịch.</li>
            <li>
              Một số thông tin kỹ thuật cần thiết để vận hành website.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="policy-title">
            2. Mục đích sử dụng thông tin
          </h2>

          <p>
            FashionHub sử dụng thông tin khách hàng nhằm phục vụ các mục
            đích hợp lý liên quan đến hoạt động của website, bao gồm:
          </p>

          <ul className="policy-list">
            <li>Xử lý và giao đơn hàng.</li>
            <li>Xác nhận thông tin đặt hàng.</li>
            <li>Hỗ trợ khách hàng.</li>
            <li>Quản lý tài khoản người dùng.</li>
            <li>Xử lý yêu cầu đổi trả và hoàn tiền.</li>
            <li>Cải thiện chất lượng website và dịch vụ.</li>
            <li>
              Gửi thông báo liên quan đến đơn hàng hoặc tài khoản.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="policy-title">
            3. Bảo vệ thông tin tài khoản
          </h2>

          <p>
            FashionHub áp dụng các biện pháp kỹ thuật và tổ chức phù hợp
            nhằm hạn chế việc truy cập, sử dụng hoặc tiết lộ thông tin
            khách hàng trái phép.
          </p>

          <p className="mt-3">
            Khách hàng có trách nhiệm bảo vệ thông tin đăng nhập của mình
            và không chia sẻ mật khẩu hoặc mã xác thực cho người khác.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            4. Thông tin thanh toán
          </h2>

          <p>
            Đối với các giao dịch thanh toán trực tuyến, FashionHub sử
            dụng cổng thanh toán phù hợp để xử lý giao dịch. FashionHub
            không yêu cầu khách hàng cung cấp mật khẩu ngân hàng hoặc
            thông tin bảo mật của tài khoản ngân hàng thông qua các kênh
            không chính thức.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            5. Chia sẻ thông tin
          </h2>

          <p>
            FashionHub chỉ chia sẻ những thông tin cần thiết với các bên
            liên quan khi cần thiết để thực hiện dịch vụ, chẳng hạn như
            đơn vị vận chuyển hoặc đơn vị cung cấp dịch vụ thanh toán.
          </p>

          <p className="mt-3">
            FashionHub không bán hoặc trao đổi thông tin cá nhân của khách
            hàng cho bên thứ ba nhằm mục đích thương mại trái phép.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            6. Cookie và dữ liệu trình duyệt
          </h2>

          <p>
            Website có thể sử dụng cookie hoặc các cơ chế lưu trữ trên
            trình duyệt để duy trì phiên đăng nhập, ghi nhớ một số tùy
            chọn và cải thiện trải nghiệm sử dụng website.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            7. Thông báo và liên lạc
          </h2>

          <p>
            FashionHub có thể gửi thông báo liên quan đến đơn hàng, thanh
            toán, tài khoản hoặc các hoạt động quan trọng của dịch vụ.
          </p>

          <p className="mt-3">
            Các thông báo khuyến mãi sẽ được thực hiện theo tùy chọn và
            chính sách áp dụng tại từng thời điểm.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            8. Quyền của khách hàng
          </h2>

          <p>
            Khách hàng có thể yêu cầu kiểm tra, cập nhật hoặc điều chỉnh
            thông tin cá nhân của mình thông qua các chức năng được cung
            cấp trên website hoặc liên hệ FashionHub để được hỗ trợ.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            9. Thay đổi chính sách
          </h2>

          <p>
            FashionHub có thể cập nhật chính sách bảo mật khi cần thiết
            để phù hợp với thay đổi của hệ thống, dịch vụ hoặc quy định
            áp dụng. Nội dung cập nhật sẽ được công bố trên website.
          </p>
        </section>

      </div>
    </PolicyLayout>
  );
};

export default PrivacyPage;

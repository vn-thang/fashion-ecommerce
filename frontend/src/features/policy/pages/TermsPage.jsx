import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const TermsPage = () => {
  return (
    <PolicyLayout
      title="Điều khoản sử dụng"
      description="Các điều khoản quy định việc sử dụng website và mua sắm sản phẩm tại FashionHub."
    >
      <div className="space-y-10 text-sm leading-7 text-gray-600">

        <section>
          <h2 className="policy-title">
            1. Chấp nhận điều khoản
          </h2>

          <p>
            Khi truy cập và sử dụng FashionHub, khách hàng được xem là đã
            đọc, hiểu và đồng ý với các điều khoản sử dụng được công bố
            trên website.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            2. Tài khoản người dùng
          </h2>

          <p>
            Một số chức năng của FashionHub yêu cầu khách hàng đăng ký
            tài khoản. Khách hàng có trách nhiệm cung cấp thông tin chính
            xác và duy trì tính bảo mật của tài khoản.
          </p>

          <ul className="policy-list">
            <li>
              Không sử dụng tài khoản của người khác khi chưa được cho phép.
            </li>
            <li>
              Không cung cấp thông tin sai lệch hoặc giả mạo.
            </li>
            <li>
              Chủ động bảo vệ mật khẩu và thông tin xác thực.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="policy-title">
            3. Thông tin sản phẩm
          </h2>

          <p>
            FashionHub cố gắng đảm bảo thông tin về sản phẩm, hình ảnh,
            kích thước, màu sắc và giá bán được hiển thị chính xác.
          </p>

          <p className="mt-3">
            Tuy nhiên, màu sắc sản phẩm thực tế có thể có sự khác biệt
            nhỏ do thiết bị hiển thị hoặc điều kiện ánh sáng.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            4. Giá sản phẩm và khuyến mãi
          </h2>

          <p>
            Giá sản phẩm và các chương trình khuyến mãi được áp dụng theo
            thông tin hiển thị tại thời điểm khách hàng đặt hàng.
          </p>

          <p className="mt-3">
            FashionHub có quyền cập nhật giá, chương trình Flash Sale,
            voucher và các ưu đãi mà không cần thông báo trước. Tuy nhiên,
            các điều kiện đã được xác nhận trên đơn hàng sẽ được xử lý
            theo thông tin của đơn hàng đó.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            5. Đặt hàng
          </h2>

          <p>
            Khách hàng có trách nhiệm kiểm tra sản phẩm, số lượng, biến
            thể, địa chỉ nhận hàng và phương thức thanh toán trước khi
            xác nhận đặt hàng.
          </p>

          <p className="mt-3">
            Một đơn hàng được xem là tiếp nhận thành công khi hệ thống ghi
            nhận đầy đủ thông tin đơn hàng.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            6. Thanh toán
          </h2>

          <p>
            FashionHub hỗ trợ các phương thức thanh toán được hiển thị
            tại bước thanh toán, bao gồm thanh toán khi nhận hàng và
            thanh toán trực tuyến nếu được hỗ trợ.
          </p>

          <p className="mt-3">
            Đối với giao dịch thanh toán trực tuyến chưa hoàn tất, đơn
            hàng có thể được giữ trong một khoảng thời gian nhất định
            trước khi hệ thống tự động hủy theo quy định của hệ thống.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            7. Hủy đơn hàng
          </h2>

          <p>
            Khách hàng có thể yêu cầu hủy đơn hàng khi đơn hàng vẫn đang
            ở trạng thái cho phép hủy.
          </p>

          <p className="mt-3">
            Sau khi đơn hàng đã được xử lý hoặc bàn giao cho đơn vị vận
            chuyển, khả năng hủy đơn có thể bị giới hạn.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            8. Giao hàng và nhận hàng
          </h2>

          <p>
            FashionHub thực hiện giao hàng theo chính sách vận chuyển được
            công bố. Khách hàng có trách nhiệm cung cấp thông tin nhận
            hàng chính xác và phối hợp với đơn vị vận chuyển.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            9. Đổi trả và hoàn tiền
          </h2>

          <p>
            Các yêu cầu đổi trả và hoàn tiền được xử lý theo{' '}
            <span className="font-medium text-gray-800">
              Chính sách trả hàng & hoàn tiền
            </span>{' '}
            của FashionHub.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            10. Hành vi bị nghiêm cấm
          </h2>

          <ul className="policy-list">
            <li>
              Sử dụng website cho mục đích gian lận hoặc bất hợp pháp.
            </li>
            <li>
              Cố tình khai thác lỗi của hệ thống để gây thiệt hại.
            </li>
            <li>
              Sử dụng công cụ tự động gây ảnh hưởng đến hoạt động của
              website.
            </li>
            <li>
              Cố tình tạo nhiều giao dịch nhằm lạm dụng chương trình
              khuyến mãi.
            </li>
            <li>
              Cung cấp thông tin giả mạo nhằm thực hiện hành vi gian lận.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="policy-title">
            11. Quyền sở hữu nội dung
          </h2>

          <p>
            Nội dung trên FashionHub bao gồm hình ảnh, thiết kế giao diện,
            logo, văn bản và các thành phần liên quan thuộc quyền quản lý
            của FashionHub hoặc bên sở hữu tương ứng.
          </p>

          <p className="mt-3">
            Người dùng không được sao chép hoặc sử dụng nội dung cho mục
            đích thương mại khi chưa được cho phép.
          </p>
        </section>

        <section>
          <h2 className="policy-title">
            12. Thay đổi điều khoản
          </h2>

          <p>
            FashionHub có thể cập nhật các điều khoản sử dụng để phù hợp
            với sự thay đổi của hệ thống và dịch vụ. Phiên bản mới sẽ có
            hiệu lực kể từ thời điểm được công bố trên website.
          </p>
        </section>

      </div>
    </PolicyLayout>
  );
};

export default TermsPage;

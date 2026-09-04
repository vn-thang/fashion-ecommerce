import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const RefundPolicyPage = () => {
  return (
    <PolicyLayout
      title="Trả hàng & hoàn tiền"
      description="Quy định và hướng dẫn về điều kiện trả hàng, đổi sản phẩm và hoàn tiền tại FashionHub."
    >
      <div className="space-y-10 text-sm leading-7 text-gray-600">

        {/* 1 */}
        <section>
          <h2 className="policy-title">
            1. Điều kiện trả hàng
          </h2>

          <p>
            FashionHub hỗ trợ khách hàng yêu cầu trả hàng khi sản phẩm
            đáp ứng các điều kiện theo chính sách dưới đây.
          </p>

          <ul className="policy-list">
            <li>
              Sản phẩm còn nguyên tình trạng ban đầu và chưa qua sử dụng.
            </li>
            <li>
              Sản phẩm không bị hư hỏng do lỗi từ phía khách hàng.
            </li>
            <li>
              Sản phẩm còn đầy đủ tem, nhãn và các phụ kiện đi kèm nếu có.
            </li>
            <li>
              Yêu cầu trả hàng được gửi trong thời hạn quy định.
            </li>
            <li>
              Sản phẩm trả về phải đúng với sản phẩm được mua trên
              FashionHub.
            </li>
          </ul>
        </section>

        {/* 2 */}
        <section>
          <h2 className="policy-title">
            2. Các trường hợp được hỗ trợ
          </h2>

          <p>
            Khách hàng có thể yêu cầu hỗ trợ trong các trường hợp:
          </p>

          <ul className="policy-list">
            <li>Nhận sai sản phẩm hoặc sai biến thể.</li>
            <li>Sản phẩm bị lỗi do nhà sản xuất.</li>
            <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển.</li>
            <li>
              Sản phẩm không đúng với thông tin được mô tả trên website.
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="policy-title">
            3. Thời hạn yêu cầu trả hàng
          </h2>

          <p>
            Khách hàng cần gửi yêu cầu trả hàng trong vòng{' '}
            <strong className="font-semibold text-gray-800">
              7 ngày
            </strong>{' '}
            kể từ ngày đơn hàng được xác nhận giao thành công.
          </p>

          <p className="mt-3">
            Sau thời hạn trên, FashionHub có thể từ chối yêu cầu nếu
            không có trường hợp đặc biệt được xác nhận bởi bộ phận hỗ trợ.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="policy-title">
            4. Sản phẩm không được hỗ trợ trả hàng
          </h2>

          <ul className="policy-list">
            <li>
              Sản phẩm đã qua sử dụng hoặc có dấu hiệu đã giặt, tẩy.
            </li>
            <li>
              Sản phẩm bị thay đổi, sửa chữa hoặc làm hư hỏng bởi khách hàng.
            </li>
            <li>
              Sản phẩm bị mất tem, nhãn hoặc phụ kiện đi kèm.
            </li>
            <li>
              Sản phẩm bị bẩn, có mùi hoặc hư hỏng do bảo quản không đúng
              cách.
            </li>
            <li>
              Sản phẩm không thuộc đơn hàng được mua tại FashionHub.
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="policy-title">
            5. Quy trình trả hàng
          </h2>

          <div className="grid gap-4 sm:grid-cols-4">
            {[
              ['01', 'Gửi yêu cầu', 'Liên hệ FashionHub và cung cấp thông tin đơn hàng.'],
              ['02', 'Xác nhận', 'FashionHub kiểm tra và xác nhận yêu cầu.'],
              ['03', 'Gửi sản phẩm', 'Đóng gói và gửi sản phẩm theo hướng dẫn.'],
              ['04', 'Hoàn tiền', 'FashionHub kiểm tra sản phẩm và tiến hành hoàn tiền nếu đủ điều kiện.']
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-lg border border-gray-200 p-4"
              >
                <span className="text-lg font-bold text-[#ee4d2d]">
                  {number}
                </span>

                <h3 className="mt-2 font-semibold text-gray-800">
                  {title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6 */}
        <section>
          <h2 className="policy-title">
            6. Chi phí trả hàng
          </h2>

          <p>
            Nếu sản phẩm bị lỗi, giao sai hoặc không đúng với thông tin
            đặt hàng do FashionHub, FashionHub sẽ hỗ trợ chi phí trả hàng
            theo từng trường hợp.
          </p>

          <p className="mt-3">
            Đối với các trường hợp trả hàng theo nhu cầu cá nhân của
            khách hàng, chi phí vận chuyển có thể do khách hàng chi trả.
        </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="policy-title">
            7. Quy định đối với Flash Sale và sản phẩm khuyến mãi
          </h2>

          <p>
            Sản phẩm thuộc chương trình Flash Sale hoặc các chương trình
            khuyến mãi vẫn áp dụng chính sách trả hàng nếu đáp ứng đầy đủ
            điều kiện trả hàng của FashionHub.
          </p>

          <p className="mt-3">
            Một số chương trình đặc biệt có thể có điều kiện riêng. Điều
            kiện áp dụng sẽ được hiển thị cùng thông tin của chương trình
            tại thời điểm mua hàng.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="policy-title">
            8. Hoàn tiền
          </h2>

          <p>
            Sau khi FashionHub nhận và kiểm tra sản phẩm trả về, yêu cầu
            hoàn tiền sẽ được xử lý nếu sản phẩm đáp ứng các điều kiện
            theo chính sách.
          </p>

          <ul className="policy-list">
            <li>
              Đơn hàng thanh toán online sẽ được hoàn tiền theo phương thức
              hoặc quy trình hỗ trợ tương ứng.
            </li>
            <li>
              Đơn hàng COD chỉ phát sinh hoàn tiền khi khách hàng đã thanh
              toán và đơn hàng đáp ứng điều kiện hoàn tiền.
            </li>
            <li>
              Thời gian tiền về tài khoản có thể phụ thuộc vào ngân hàng
              hoặc đơn vị thanh toán.
            </li>
          </ul>
        </section>

        {/* 9 */}
        <section>
          <h2 className="policy-title">
            9. Trường hợp cần hỗ trợ
          </h2>

          <p>
            Nếu sản phẩm nhận được có vấn đề, khách hàng nên liên hệ
            FashionHub sớm nhất có thể và cung cấp mã đơn hàng cùng hình
            ảnh hoặc video thể hiện tình trạng sản phẩm để quá trình xử
            lý được nhanh chóng hơn.
          </p>
        </section>

      </div>
    </PolicyLayout>
  );
};

export default RefundPolicyPage;

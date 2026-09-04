import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const ShippingPolicyPage = () => {
  return (
    <PolicyLayout
      title="Chính sách vận chuyển"
      description="Thông tin về phạm vi, thời gian, chi phí và quy trình giao nhận đơn hàng tại FashionHub."
    >
      <div className="space-y-10 text-sm leading-7 text-gray-600">

        {/* 1 */}
        <section>
          <h2 className="policy-title">
            1. Phạm vi giao hàng
          </h2>

          <p>
            FashionHub hỗ trợ giao hàng đến hầu hết các tỉnh, thành phố
            trên toàn quốc thông qua các đơn vị vận chuyển phù hợp.
          </p>

          <p className="mt-3">
            Địa chỉ giao hàng được xác định dựa trên thông tin khách hàng
            cung cấp tại thời điểm đặt hàng. Khách hàng vui lòng kiểm tra
            chính xác họ tên, số điện thoại và địa chỉ trước khi xác nhận
            đơn hàng.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="policy-title">
            2. Thời gian xử lý đơn hàng
          </h2>

          <p>
            Sau khi đơn hàng được đặt thành công, FashionHub sẽ tiến hành
            kiểm tra thông tin và chuẩn bị sản phẩm trước khi bàn giao cho
            đơn vị vận chuyển.
          </p>

          <ul className="policy-list">
            <li>Đơn hàng thông thường được xử lý trong vòng 24 giờ.</li>
            <li>
              Đơn hàng đặt vào ngày nghỉ hoặc ngày lễ có thể được xử lý
              vào ngày làm việc tiếp theo.
            </li>
            <li>
              Thời gian xử lý có thể kéo dài hơn trong các chương trình
              Flash Sale hoặc thời điểm có lượng đơn hàng tăng cao.
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="policy-title">
            3. Thời gian giao hàng dự kiến
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 font-semibold text-gray-800">
                    Khu vực
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-800">
                    Thời gian dự kiến
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    Nội thành / khu vực trung tâm
                  </td>
                  <td className="px-4 py-3">
                    1 - 2 ngày làm việc
                  </td>
                </tr>

                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    Các tỉnh, thành phố khác
                  </td>
                  <td className="px-4 py-3">
                    2 - 5 ngày làm việc
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-3">
                    Khu vực xa / huyện đảo
                  </td>
                  <td className="px-4 py-3">
                    4 - 7 ngày làm việc
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Thời gian trên chỉ mang tính dự kiến và có thể thay đổi do
            điều kiện thời tiết, giao thông, tình trạng đơn hàng hoặc
            các yếu tố ngoài khả năng kiểm soát của FashionHub.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="policy-title">
            4. Phí vận chuyển
          </h2>

          <p>
            Phí vận chuyển được hiển thị tại bước thanh toán trước khi
            khách hàng xác nhận đặt hàng. Chi phí có thể thay đổi tùy
            theo địa chỉ nhận hàng, trọng lượng và giá trị đơn hàng.
          </p>

          <p className="mt-3">
            Trong trường hợp FashionHub triển khai chương trình miễn phí
            vận chuyển hoặc hỗ trợ phí vận chuyển, ưu đãi sẽ được áp dụng
            theo điều kiện của từng chương trình.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="policy-title">
            5. Kiểm tra và nhận hàng
          </h2>

          <p>
            Khi nhận hàng, khách hàng nên kiểm tra tình trạng bên ngoài
            của kiện hàng trước khi nhận.
          </p>

          <ul className="policy-list">
            <li>
              Kiểm tra bao bì có dấu hiệu rách, móp méo hoặc bất thường.
            </li>
            <li>
              Đối chiếu số lượng kiện hàng với thông tin đơn hàng.
            </li>
            <li>
              Nếu phát hiện dấu hiệu bất thường nghiêm trọng, khách hàng
              nên ghi nhận tình trạng và liên hệ FashionHub để được hỗ trợ.
            </li>
          </ul>
        </section>

        {/* 6 */}
        <section>
          <h2 className="policy-title">
            6. Giao hàng không thành công
          </h2>

          <p>
            Đơn hàng có thể được giao lại theo chính sách của đơn vị vận
            chuyển khi khách hàng không thể nhận hàng trong lần giao đầu.
          </p>

          <p className="mt-3">
            Trường hợp khách hàng cung cấp sai địa chỉ, sai số điện thoại
            hoặc không thể nhận hàng sau nhiều lần liên hệ, đơn hàng có
            thể được hoàn về FashionHub.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="policy-title">
            7. Thay đổi địa chỉ giao hàng
          </h2>

          <p>
            Khách hàng nên kiểm tra kỹ địa chỉ trước khi đặt hàng. Sau khi
            đơn hàng đã được bàn giao cho đơn vị vận chuyển, FashionHub
            có thể không thể thay đổi địa chỉ giao hàng.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="policy-title">
            8. Liên hệ hỗ trợ
          </h2>

          <p>
            Nếu đơn hàng giao chậm hơn thời gian dự kiến hoặc phát sinh
            vấn đề trong quá trình vận chuyển, khách hàng có thể liên hệ
            FashionHub thông qua các kênh liên hệ được cung cấp trên
            website.
          </p>
        </section>

      </div>
    </PolicyLayout>
  );
};

export default ShippingPolicyPage;

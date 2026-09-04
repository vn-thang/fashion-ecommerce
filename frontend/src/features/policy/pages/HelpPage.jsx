import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaChevronDown,
  FaShoppingBag,
  FaCreditCard,
  FaTruck,
  FaUndo,
  FaUser,
  FaTags,
  FaHeadset,
  FaTimes
} from 'react-icons/fa';
import PolicyLayout from '../components/PolicyLayout';
import { useCustomerChatContext } from '../../chat/context/CustomerChatContext';

const FAQ_DATA = [
  {
    category: 'Đặt hàng',
    icon: FaShoppingBag,
    questions: [
      {
        question: 'Làm thế nào để đặt hàng?',
        answer:
          'Anh/chị chọn sản phẩm, lựa chọn biến thể phù hợp như màu sắc hoặc kích thước, thêm sản phẩm vào giỏ hàng và tiến hành thanh toán. Sau khi kiểm tra thông tin nhận hàng và phương thức thanh toán, hãy xác nhận đặt hàng.'
      },
      {
        question: 'Tôi có thể mua sản phẩm mà không cần đăng nhập không?',
        answer:
          'FashionHub khuyến khích khách hàng đăng nhập để quản lý đơn hàng, theo dõi lịch sử mua sắm và sử dụng đầy đủ các tính năng của tài khoản.'
      },
      {
        question: 'Tôi có thể thay đổi sản phẩm sau khi đặt hàng không?',
        answer:
          'Nếu đơn hàng chưa được xử lý, anh/chị có thể liên hệ FashionHub để được hỗ trợ. Khi đơn hàng đã được đóng gói hoặc bàn giao cho đơn vị vận chuyển, việc thay đổi sản phẩm có thể không thực hiện được.'
      },
      {
        question: 'Tôi có thể hủy đơn hàng không?',
        answer:
          'Anh/chị có thể yêu cầu hủy đơn hàng khi đơn hàng vẫn đang ở trạng thái cho phép hủy. Khi đơn hàng đã được xử lý hoặc bàn giao cho đơn vị vận chuyển, khả năng hủy có thể bị giới hạn.'
      }
    ]
  },

  {
    category: 'Thanh toán',
    icon: FaCreditCard,
    questions: [
      {
        question: 'FashionHub hỗ trợ những phương thức thanh toán nào?',
        answer:
          'Các phương thức thanh toán được hỗ trợ sẽ được hiển thị tại bước thanh toán, bao gồm thanh toán khi nhận hàng và thanh toán trực tuyến nếu phương thức này đang được cung cấp.'
      },
      {
        question: 'Thanh toán trực tuyến không thành công thì phải làm gì?',
        answer:
          'Anh/chị có thể kiểm tra lại giao dịch hoặc thực hiện thanh toán lại nếu đơn hàng vẫn còn trong thời gian chờ thanh toán. Nếu giao dịch đã bị trừ tiền nhưng đơn hàng chưa được cập nhật, vui lòng liên hệ FashionHub để được kiểm tra.'
      },
      {
        question: 'Tại sao đơn hàng thanh toán online bị tự động hủy?',
        answer:
          'Đơn hàng thanh toán trực tuyến chưa hoàn tất có thể được giữ trong một khoảng thời gian nhất định. Nếu thanh toán không được hoàn tất trong thời gian này, hệ thống có thể tự động hủy đơn hàng.'
      }
    ]
  },

  {
    category: 'Vận chuyển',
    icon: FaTruck,
    questions: [
      {
        question: 'Bao lâu tôi sẽ nhận được hàng?',
        answer:
          'Thời gian giao hàng dự kiến thường từ 1 - 2 ngày đối với khu vực nội thành và 2 - 5 ngày đối với các tỉnh, thành phố khác. Một số khu vực xa có thể cần thêm thời gian.'
      },
      {
        question: 'Tôi có thể theo dõi đơn hàng ở đâu?',
        answer:
          'Anh/chị có thể vào mục Đơn mua trong tài khoản để xem trạng thái và thông tin liên quan đến đơn hàng.'
      },
      {
        question: 'Phí vận chuyển được tính như thế nào?',
        answer:
          'Phí vận chuyển được hiển thị tại bước thanh toán và phụ thuộc vào địa chỉ nhận hàng cùng các chương trình hỗ trợ phí vận chuyển đang được áp dụng.'
      }
    ]
  },

  {
    category: 'Đổi trả & hoàn tiền',
    icon: FaUndo,
    questions: [
      {
        question: 'Tôi có thể trả hàng trong bao lâu?',
        answer:
          'FashionHub hỗ trợ yêu cầu trả hàng trong vòng 7 ngày kể từ ngày đơn hàng được xác nhận giao thành công, với điều kiện sản phẩm đáp ứng các yêu cầu trong chính sách trả hàng.'
      },
      {
        question: 'Sản phẩm bị lỗi thì phải làm gì?',
        answer:
          'Anh/chị nên liên hệ FashionHub sớm nhất có thể và cung cấp mã đơn hàng cùng hình ảnh hoặc video thể hiện tình trạng sản phẩm để được kiểm tra và hướng dẫn xử lý.'
      },
      {
        question: 'Bao lâu tôi nhận được tiền hoàn?',
        answer:
          'Sau khi FashionHub nhận và kiểm tra sản phẩm trả về, yêu cầu hoàn tiền sẽ được xử lý nếu đáp ứng điều kiện. Thời gian tiền về tài khoản có thể phụ thuộc vào phương thức thanh toán và ngân hàng.'
      }
    ]
  },

  {
    category: 'Tài khoản',
    icon: FaUser,
    questions: [
      {
        question: 'Tôi quên mật khẩu thì phải làm gì?',
        answer:
          'Anh/chị có thể sử dụng chức năng Quên mật khẩu tại trang đăng nhập và thực hiện các bước xác thực được yêu cầu để đặt lại mật khẩu.'
      },
      {
        question: 'Tôi có thể thay đổi thông tin cá nhân không?',
        answer:
          'Anh/chị có thể cập nhật các thông tin tài khoản được hệ thống cho phép chỉnh sửa trong khu vực quản lý tài khoản.'
      },
      {
        question: 'Tôi có thể quản lý địa chỉ giao hàng ở đâu?',
        answer:
          'Anh/chị có thể truy cập khu vực quản lý tài khoản để thêm, chỉnh sửa hoặc quản lý các địa chỉ giao hàng đã lưu.'
      }
    ]
  },

  {
    category: 'Voucher & khuyến mãi',
    icon: FaTags,
    questions: [
      {
        question: 'Làm thế nào để sử dụng voucher?',
        answer:
          'Tại bước thanh toán, anh/chị nhập hoặc chọn voucher phù hợp với điều kiện của chương trình. Hệ thống sẽ kiểm tra điều kiện và áp dụng mức giảm giá nếu voucher hợp lệ.'
      },
      {
        question: 'Tại sao tôi không sử dụng được voucher?',
        answer:
          'Voucher có thể không được áp dụng khi đã hết hạn, hết lượt sử dụng, không đạt giá trị đơn hàng tối thiểu hoặc không đáp ứng các điều kiện khác của chương trình.'
      },
      {
        question: 'Flash Sale hoạt động như thế nào?',
        answer:
          'Sản phẩm Flash Sale được áp dụng mức giá và số lượng giới hạn trong khoảng thời gian của chương trình. Khi chương trình kết thúc hoặc số lượng ưu đãi đã hết, sản phẩm sẽ trở về điều kiện bán hàng thông thường.'
      },
      {
        question: 'Sản phẩm Flash Sale có được trả hàng không?',
        answer:
          'Sản phẩm Flash Sale vẫn được áp dụng chính sách trả hàng của FashionHub nếu đáp ứng đầy đủ các điều kiện được quy định trong Chính sách trả hàng & hoàn tiền.'
      }
    ]
  }
];

const QUICK_LINKS = [
  {
    title: 'Đơn mua',
    description: 'Theo dõi đơn hàng',
    icon: FaShoppingBag,
    to: '/account/orders'
  },
  {
    title: 'Vận chuyển',
    description: 'Thời gian giao hàng',
    icon: FaTruck,
    to: '/shipping-policy'
  },
  {
    title: 'Đổi trả',
    description: 'Chính sách đổi trả',
    icon: FaUndo,
    to: '/refund-policy'
  },
];

const HelpPage = () => {
  const [search, setSearch] = useState('');
  const [openItem, setOpenItem] = useState(null);

  const { openChat } = useCustomerChatContext();

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return FAQ_DATA;
    }

    return FAQ_DATA
      .map(category => ({
        ...category,
        questions: category.questions.filter(item =>
          `${item.question} ${item.answer}`
            .toLowerCase()
            .includes(keyword)
        )
      }))
      .filter(category => category.questions.length > 0);
  }, [search]);

  const resultCount = filteredCategories.reduce(
    (total, category) => total + category.questions.length,
    0
  );

  const toggleQuestion = key => {
    setOpenItem(prev => (prev === key ? null : key));
  };

  const handleClearSearch = () => {
    setSearch('');
    setOpenItem(null);
  };

  return (
    <PolicyLayout
      title="Trung tâm trợ giúp"
      description="Tìm câu trả lời cho những câu hỏi thường gặp khi mua sắm tại FashionHub."
    >
      <div className="space-y-10">
        <section>
          <div className="relative">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />

            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setOpenItem(null);
              }}
              placeholder="Bạn cần tìm thông tin gì?"
              aria-label="Tìm kiếm câu hỏi"
              className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#ee4d2d] focus:bg-white focus:ring-1 focus:ring-[#ee4d2d]"
            />

            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Xóa tìm kiếm"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
              >
                <FaTimes size={13} />
              </button>
            )}
          </div>

          {search && (
            <p className="mt-3 text-sm text-gray-500">
              {resultCount > 0 ? (
                <>
                  Tìm thấy{' '}
                  <span className="font-semibold text-gray-700">
                    {resultCount}
                  </span>{' '}
                  kết quả cho "
                  <span className="font-medium text-gray-800">
                    {search}
                  </span>
                  "
                </>
              ) : (
                <>
                  Không tìm thấy kết quả cho "
                  <span className="font-medium text-gray-800">
                    {search}
                  </span>
                  "
                </>
              )}
            </p>
          )}
        </section>

        {!search && (
          <section>
            <h2 className="mb-4 text-base font-bold text-gray-900">
              Bạn cần hỗ trợ về?
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {QUICK_LINKS.map(item => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    className="group rounded-lg border border-gray-200 p-4 transition hover:border-[#ee4d2d] hover:shadow-sm"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-[#ee4d2d] transition group-hover:bg-[#ee4d2d] group-hover:text-white">
                      <Icon size={15} />
                    </div>

                    <p className="font-semibold text-gray-800">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section>
          {!search && (
            <h2 className="mb-5 text-base font-bold text-gray-900">
              Câu hỏi thường gặp
            </h2>
          )}

          <div className="space-y-8">
            {filteredCategories.length > 0 ? (
              filteredCategories.map(category => {
                const Icon = category.icon;

                return (
                  <div key={category.category}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#ee4d2d]">
                        <Icon size={15} />
                      </div>

                      <h2 className="text-base font-bold text-gray-900">
                        {category.category}
                      </h2>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      {category.questions.map(item => {
                        const key = `${category.category}-${item.question}`;
                        const isOpen = openItem === key;

                        return (
                          <div
                            key={item.question}
                            className="border-b border-gray-200 last:border-b-0"
                          >
                            <button
                              type="button"
                              onClick={() => toggleQuestion(key)}
                              aria-expanded={isOpen}
                              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-gray-50 sm:px-5"
                            >
                              <span
                                className={`text-sm ${
                                  isOpen
                                    ? 'font-semibold text-[#ee4d2d]'
                                    : 'font-medium text-gray-800'
                                }`}
                              >
                                {item.question}
                              </span>

                              <FaChevronDown
                                size={12}
                                className={`shrink-0 text-gray-400 transition-transform ${
                                  isOpen ? 'rotate-180 text-[#ee4d2d]' : ''
                                }`}
                              />
                            </button>

                            {isOpen && (
                              <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 text-sm leading-6 text-gray-600 sm:px-5">
                                {item.answer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-gray-200 py-12 text-center">
                <FaSearch className="mx-auto mb-4 text-2xl text-gray-300" />

                <p className="font-medium text-gray-700">
                  Không tìm thấy câu hỏi phù hợp
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Hãy thử tìm kiếm với từ khóa khác.
                </p>

                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-4 text-sm font-medium text-[#ee4d2d] hover:underline"
                >
                  Xóa tìm kiếm
                </button>
              </div>
            )}
          </div>
        </section>
        <section className="rounded-lg bg-orange-50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#ee4d2d]">
                <FaHeadset />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Vẫn cần hỗ trợ?
                </h3>

                <p className="mt-1 text-sm leading-5 text-gray-600">
                  Đội ngũ FashionHub luôn sẵn sàng hỗ trợ bạn.
                </p>
              </div>
            </div>

           <button
            type="button"
            onClick={openChat}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#ee4d2d] px-5 text-sm font-medium text-white transition hover:bg-[#d93f24]"
          >
            Chat với chúng tôi
          </button>
          </div>
        </section>

      </div>
    </PolicyLayout>
  );
};

export default HelpPage;


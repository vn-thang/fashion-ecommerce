import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../../payment/api/paymentApi';
import { addressApi } from '../../profile/api/addressApi';
import { couponApi } from '../../coupon/api/couponApi';
import { useCart } from '../../cart/hooks/CartContext';

export const useCheckout = (
  cartItemIds,
  itemsToCheckout = [],
  isBuyNow = false
) => {
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const [shippingAddress, setShippingAddress] = useState({});
  const [allAddresses, setAllAddresses] = useState([]);

  const [note, setNote] = useState('');

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [previewData, setPreviewData] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const [availableCoupons, setAvailableCoupons] = useState([]);

  const cartItemIdsString = cartItemIds?.join(',');

  const buyNowItemsString = useMemo(() => {
    return itemsToCheckout
      .map(item => `${item.variantId || item.id}-${item.quantity}`)
      .join(',');
  }, [itemsToCheckout]);

  const getCheckoutPayload = useCallback(() => {
    if (isBuyNow) {
      return {
        buyNowItems: itemsToCheckout.map(item => ({
          variantId: item.variantId || item.id,
          quantity: item.quantity
        }))
      };
    }

    return {
      cartItemIds
    };
  }, [isBuyNow, cartItemIds, itemsToCheckout]);

  const subTotalAmount = useMemo(() => {
    return itemsToCheckout.reduce((total, item) => {
      return (
        total +
        Number(item.price || 0) * Number(item.quantity || 0)
      );
    }, 0);
  }, [itemsToCheckout]);

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await couponApi.getAll({
        isActive: true,
        limit: 50
      });

      if (res?.success && res?.data) {
        setAvailableCoupons(res.data.coupons || res.data);
      } else if (Array.isArray(res)) {
        setAvailableCoupons(res);
      }
    } catch (err) {
      console.error(
        'Không thể lấy danh sách mã giảm giá:',
        err
      );
    }
  }, []);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await addressApi.getAddresses();

      if (
        res.success &&
        res.data &&
        res.data.length > 0
      ) {
        setAllAddresses(res.data);

        const defaultAddress =
          res.data.find(item => item.isDefault) ||
          res.data[0];

        setShippingAddress(defaultAddress);
      } else {
        setAllAddresses([]);
        setShippingAddress({});
      }
    } catch (err) {
      console.error(
        'Không thể lấy địa chỉ:',
        err
      );
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
    fetchCoupons();
  }, [fetchAddresses, fetchCoupons]);

  useEffect(() => {
    if (
      !isBuyNow &&
      (!cartItemIds || cartItemIds.length === 0)
    ) {
      return;
    }

    if (
      isBuyNow &&
      (!itemsToCheckout ||
        itemsToCheckout.length === 0)
    ) {
      return;
    }

    if (!shippingAddress.province) {
      return;
    }

    const triggerPreview = async () => {
      try {
        setApiError('');

        const res =
          await orderApi.previewCheckout({
            ...getCheckoutPayload(),
            province:
              shippingAddress.province,
            ward: shippingAddress.ward,
            couponCode:
              appliedCoupon || undefined
          });

        if (res.success) {
          setPreviewData(res.data);
          setIsCalculated(true);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          'Lỗi tính toán chi phí.';

        setApiError(errorMessage);

        if (appliedCoupon) {
          setAppliedCoupon('');
          setCouponInput('');

          try {
            const reset =
              await orderApi.previewCheckout({
                ...getCheckoutPayload(),
                province:
                  shippingAddress.province,
                ward: shippingAddress.ward,
                couponCode: undefined
              });

            if (reset.success) {
              setPreviewData(reset.data);
              setIsCalculated(true);
            }
          } catch {
            setIsCalculated(false);
          }
        } else {
          setIsCalculated(false);
        }
      }
    };

    const debounce = setTimeout(
      triggerPreview,
      500
    );

    return () => clearTimeout(debounce);
  }, [
    shippingAddress.province,
    shippingAddress.ward,
    appliedCoupon,
    cartItemIdsString,
    buyNowItemsString,
    isBuyNow,
    getCheckoutPayload
  ]);

  const handleSelectAddress = address => {
    setShippingAddress(address);
  };
  const handlePlaceOrder = async e => {
    if (e) e.preventDefault();

    if (!shippingAddress.province) {
      setApiError('Vui lòng chọn địa chỉ giao hàng hợp lệ.');
      return;
    }

    if (!isCalculated) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError('');

      const orderResponse =
        await orderApi.createOrder({
          ...getCheckoutPayload(),
          receiverName: shippingAddress.receiverName,
          phoneNumber: shippingAddress.phoneNumber,
          province: shippingAddress.province,
          ward: shippingAddress.ward,
          addressLine: shippingAddress.addressLine,
          note,
          paymentMethod,
          couponCode:
            appliedCoupon || undefined
        });

      if (!orderResponse.success) {
        throw new Error(
          orderResponse.message ||
            'Không thể tạo đơn hàng.'
        );
      }

      const order = orderResponse.data;
      if (paymentMethod === 'COD') {
        if (!isBuyNow) {
          await fetchCart();
        }

        navigate('/checkout/success', {
          state: {
            orderDetails: order
          }
        });

        return;
      }

      const paymentResponse =
        await paymentApi.createPaymentUrl({
          orderId: order.orderId
        });

     if (
    paymentResponse.success &&
    paymentResponse.data?.paymentUrl
    ) {
        window.location.href =
            paymentResponse.data.paymentUrl;

        return;
    }

      throw new Error(
        paymentResponse.message ||
          'Không thể khởi tạo thanh toán VNPAY.'
      );
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          err.message ||
          'Đặt hàng thất bại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    shippingAddress,
    allAddresses,
    fetchAddresses,

    note,
    setNote,

    couponInput,
    setCouponInput,

    appliedCoupon,
    setAppliedCoupon,

    paymentMethod,
    setPaymentMethod,

    previewData,
    isCalculated,
    isSubmitting,
    apiError,

    handleSelectAddress,
    handlePlaceOrder,

    availableCoupons,
    subTotalAmount
  };
};
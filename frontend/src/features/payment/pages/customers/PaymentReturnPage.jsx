import React, { useEffect, useRef  } from 'react';
import { useLocation } from 'react-router-dom';

import { usePayment } from '../../hooks/customers/usePayment';

import PaymentLoading from '../../components/customers/PaymentLoading';
import PaymentSuccess from '../../components/customers/PaymentSuccess';
import PaymentFailed from '../../components/customers/PaymentFailed';
import PaymentCancelled from '../../components/customers/PaymentCancelled';

import { PAYMENT_STATUS } from '../../../../shared/constants/paymentStatus';

const PaymentReturnPage = () => {
  const location = useLocation();
  const verified = useRef(false);

  const {
    loading,
    error,
    paymentResult,
    verifyPayment
  } = usePayment();

 useEffect(() => {
  if (verified.current) return;
  verified.current = true;
  verifyPayment(location.search);
}, [location.search, verifyPayment]);

  if (loading) {
    return <PaymentLoading />;
  }

  if (error) {
    return (
      <PaymentFailed
        payment={{
          orderId: null,
          paymentStatus: PAYMENT_STATUS.FAILED,
          message: error
        }}
      />
    );
  }

  if (!paymentResult) {
    return <PaymentLoading />;
  }

  switch (paymentResult.paymentStatus) {
    case PAYMENT_STATUS.SUCCESS:
      return (
        <PaymentSuccess
          payment={paymentResult}
        />
      );

    case PAYMENT_STATUS.CANCELLED:
      return (
        <PaymentCancelled
          payment={paymentResult}
        />
      );

    default:
      return (
        <PaymentFailed
          payment={paymentResult}
        />
      );
  }
};

export default PaymentReturnPage;
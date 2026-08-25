import { useCallback, useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../../../config/firebase';
import { notificationApi } from '../api/notificationApi';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const useFCM = userId  => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const registerToken = useCallback(async () => {
   if (!userId || !messaging) {
  return null;
}

    if (!VAPID_KEY) {
      console.error(
        '[FCM] VITE_FIREBASE_VAPID_KEY chưa được cấu hình.'
      );
      return null;
    }

    if (!('Notification' in window)) {
      console.error(
        '[FCM] Browser không hỗ trợ Notification.'
      );
      return null;
    }

    if (!('serviceWorker' in navigator)) {
      console.error(
        '[FCM] Browser không hỗ trợ Service Worker.'
      );
      return null;
    }

    try {
      setLoading(true);

      const permission =
        await Notification.requestPermission();

      if (permission !== 'granted') {
        console.warn(
          `[FCM] Notification permission = ${permission}`
        );

        return null;
      }

      const registration =
        await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js'
        );

      let activeRegistration = registration;

      if (!registration.active) {
        activeRegistration =
          await navigator.serviceWorker.ready;
      }

      if (!activeRegistration.active) {
        console.error(
          '[FCM] Service Worker chưa active.'
        );
        return null;
      }

      const currentToken = await getToken(
        messaging,
        {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration:
            activeRegistration
        }
      );

      if (!currentToken) {
        console.warn(
          '[FCM] getToken() không trả về token.'
        );

        return null;
      }

      const response =
        await notificationApi.registerDeviceToken({
          token: currentToken,
          deviceType: 'WEB'
        });

      if (!response?.success) {
        console.error(
          '[FCM] Backend không đăng ký được device token:',
          response
        );
        return null;
      }

      setToken(currentToken);
      return currentToken;
    } catch (error) {
      console.error(
        '[FCM] Registration failed.'
      );

      if (error?.response) {
        console.error(
          '[FCM] Backend response:',
          error.response.data
        );
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setToken(null);
      return;
    }

    registerToken();
  }, [userId, registerToken]);

  useEffect(() => {
    console.log('[FCM] Foreground effect:', {
      userId,
      messaging: !!messaging
    });

    if (!userId || !messaging) {
      return;
    }

    const unsubscribe = onMessage(
      messaging,
      payload => {
        console.log(
          '[FCM] Foreground payload:',
          payload
        );

        const data = payload.data || {};

        const title =
          data.title || 'FashionHub';

        const body =
          data.body || '';

        if (Notification.permission !== 'granted') {
          console.warn(
            '[FCM] Notification permission chưa được granted'
          );
          return;
        }

        const notification =
          new Notification(title, {
            body,
            icon: '/favicon.ico',
            data
          });

        notification.onclick = () => {
          const conversationId =
            data.conversationId;

          if (!conversationId) {
            return;
          }

          window.focus();

          window.location.href =
            `/chat?conversationId=${conversationId}`;
        };
      }
    );

    return unsubscribe;
  }, [userId]);

  return {
    token,
    loading,
    registerToken
  };
};
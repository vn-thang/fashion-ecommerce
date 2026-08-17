importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCmkmgeXvgBWWY2W2MG9I-e9-BPNxwDnzI',
  authDomain: 'fashionhub-9eeaa.firebaseapp.com',
  projectId: 'fashionhub-9eeaa',
  storageBucket: 'fashionhub-9eeaa.firebasestorage.app',
  messagingSenderId: '494523286786',
  appId: '1:494523286786:web:817de1276d92535983ae1b'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log('[FCM SW] Background payload:', payload);

  const data = payload.data || {};

  const title = data.title || 'FashionHub';
  const body = data.body || '';

  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    data
  });
});
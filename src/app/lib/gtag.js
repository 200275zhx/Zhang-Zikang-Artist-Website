export const GA_MEASUREMENT_ID = 'G-5SNF3ZGDLN';

export const pageview = (url) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

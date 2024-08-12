export const tg = {
  token: '6238483226:AAGqfmihU3eWu478Q2uNPqqP0QfD3kOCAM8',
  chat_id: '@quduqlar_uz',
  lineBreak: '%0D%0A'
};

export const BASE_URL_TG = `https://api.telegram.org/bot${tg.token}/sendMessage?chat_id=${tg.chat_id}&text=`;
export const BASE_URL = 'https://waterwell-monitor-production-cf83.up.railway.app/api/';
export const privatRoutes = ['/super-user-profile'];

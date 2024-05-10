import locale from 'localization/locale.json';
// import { useSelector } from 'react-redux';

export const T = (id) => {
  const s = {};
  //  || useSelector((s) => s);
  const lang = s.lang || 'uz';
  const textTranslate = locale[lang][id] || id;
  return textTranslate;
};

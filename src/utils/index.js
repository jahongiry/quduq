import { BASE_URL_TG, privatRoutes } from './constants';

export const sendBotMessage = ({ phone, name, site, comment }) => {
  const textMessage =
    encodeURI(
      `Yangi ariza !\n\n<a href="${site}">Quduq nazorati saytidan </a>\nMijoz telefon raqami:<span class="tg-spoiler"> ${phone}</span>\nMijoz ismi: ${name}\nMijoz murojaati: ${comment}`
    ) + '&parse_mode=html';
  return BASE_URL_TG + textMessage;
};

export const sendEditedWells = ({ phone, wellName, adminName, adminId, site = location.origin || window.location.origin, wellId = '' }) => {
  const textMessage = encodeURI(
    `<strong>Quduq malu'motlarida o'zgarish !</strong>\n\n<a href="${site}">Quduq nazorati</a> saytidan\nAdmin ID'si:<span class="tg-spoiler">${adminId}</span>\nAdmin Ismi:<span class="tg-spoiler"> ${adminName}</span>\nQuduq nomi:<u><a href="${site}/wells/${wellId}">${wellName}</a></u>\nQuduqga biriktirilgan telefon raqami: <span class="tg-spoiler">${phone}</span>&parse_mode=html`
  );
  return BASE_URL_TG + textMessage;
};

export const sendDeletedWells = ({
  phone,
  wellName,
  adminName,
  adminId,
  site = location.origin || window.location.origin,
  wellId = ''
}) => {
  const textMessage = encodeURI(
    `<strong>Quduq o'chirib tashlandi !</strong>\n\n<a href="${site}">Quduq nazorati</a> saytidan\nAdmin ID'si:<span class="tg-spoiler">${adminId}</span>\nAdmin Ismi:<span class="tg-spoiler"> ${adminName}</span>\nQuduq nomi:<u><a href="${site}/wells/${wellId}">${wellName}</a></u>\nQuduqga biriktirilgan telefon raqami: <span class="tg-spoiler">${phone}</span>&parse_mode=html`
  );
  return BASE_URL_TG + textMessage;
};

export const userUpdateMessage = ({ adminName, adminUsername, site = location.origin || window.location.origin, thisUser, user = {} }) => {
  const textMessage = encodeURI(
    `<strong>Nazoratchi - </strong><a href="${site}/super-user-profile?username=${user?.username}">${user?.name} ${
      user?.surname
    } </a><strong>${
      thisUser ? 'shaxsiy' : `<a href="${site}/super-user-profile?username=${adminUsername}">${adminName}</a>`
    } profilini yangiladi !</strong>&parse_mode=html`
  );
  return BASE_URL_TG + textMessage;
};

export const userStatusMessage = ({
  superAdminUsername,
  adminName,
  status,
  adminUsername = '',
  site = location.origin || window.location.origin
}) => {
  const textMessage = encodeURI(
    `<strong>Nazoratchi statusi yangilandi</strong>\n\nEndilikda nazoratchi <a href="${site}/super-user-profile?username=${adminUsername}">${adminName}</a> statusi: ${status}\n\n<strong>Ushbu amal <a href="${site}/super-user-profile?username=${superAdminUsername}"> <span class="tg-spoiler">${superAdminUsername}</span></a> tomonidan bajarildi</strong>&parse_mode=html`
  );
  return BASE_URL_TG + textMessage;
};

export const userDeletedMessage = ({ admin, user, site = location.origin || window.location.origin }) => {
  const textMessage = encodeURI(
    user
      ? `<strong>SuperAdmin <a href="${site}/super-user-profile?username=${admin?.username}">${admin?.name} ${admin?.surname}</a> Nazoratchi <span class="tg-spoiler">${user?.name} ${user?.surname}</span> ni ishdan bo'shatdi !</strong>&parse_mode=html`
      : `<strong>SuperAdmin ${admin?.name} ${admin?.surname} ishni tark etdi!</strong>&parse_mode=html`
  );
  return BASE_URL_TG + textMessage;
};

export function getFormData(object) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
}

export const isPrivatRoute = (path) => privatRoutes.find((route) => route === path);

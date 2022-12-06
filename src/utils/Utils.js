export const getCurrentDate = () => {
  let date = new Date();
  // const offset = date.getTimezoneOffset();
  // date = new Date(date.getTime() - offset * 60 * 1000);
  //   return date.toLocaleDateString();
  return getDateWithFormat(date);
};

const getDateWithFormat = (date) => {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (day < 10) {
    day = `0${day}`;
  }

  if (month < 10) {
    month = `0${month}`;
  }
  return `${year}/${month}/${day}`;
};

export const getExpiredDate = (expiredDate) => {
  const date = new Date();
  date.setDate(date.getDate() + expiredDate);
  return getDateWithFormat(date);
};

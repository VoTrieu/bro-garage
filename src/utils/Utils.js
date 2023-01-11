import { isDate } from "lodash";

export const getCurrentDate = () => {
  let date = new Date();
  // const offset = date.getTimezoneOffset();
  // date = new Date(date.getTime() - offset * 60 * 1000);
  //   return date.toLocaleDateString();
  return getDateWithFormat(date);
};

export const getDateWithFormat = (date) => {
  if(!isDate(date)){
    return;
  }
  
  let day = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (day < 10) {
    day = `0${day}`;
  }

  if (month < 10) {
    month = `0${month}`;
  }
  return `${day}/${month}/${year}`;
};

export const getExpiredDate = (expiredDate) => {
  const date = new Date();
  date.setDate(date.getDate() + expiredDate);
  return date;
};

export const getTimestampInSeconds = () => {
  return Math.floor(Date.now() / 1000);
}

export const convertDDMMYYY_To_MMDDYYYY = (stringDate) => {
  return new Date(stringDate.replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
}

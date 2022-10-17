const getTodayDate = () => {
  let today = new Date();
  const dd = String(today.getDate() + 1).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  today = mm + "-" + dd + "-" + yyyy;
  return new Date(today);
};

const getSecondDate = (numOfWeeks, todayDate) => {
  let secondDate = new Date();
  secondDate.setDate(todayDate.getDate() - numOfWeeks * 7);
  return secondDate;
};

const getStringDate = (today) => {
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  today = mm + "-" + dd + "-" + yyyy;
  return today;
};

const getNumOfWeeks = (period) => {
  if (period === "weekly") {
    return 1;
  } else if (period === "monthly") {
    return 4;
  } else {
    return 12; 
  }
};


const validCurrency = (currency) => {
  const validCurrency = ["usd", "eur","bitcoin"];
  return validCurrency.includes(currency);
};


const getFee = (appointments, requiredCurrency) => {
  const currencyConversion = {
    usd: 1.02, 
    eur: 0.98,
    
  };

  const fee = {};

  fee.unpaid = appointments.reduce((acc, appointment) => {
    if (!appointment.isPaid) {
      if (appointment.currency !== requiredCurrency) {
        acc = acc + appointment.fee * currencyConversion[appointment.currency];
      } else {
        acc = acc + appointment.fee;
      }
    }
    return acc;
  }, 0);

  fee.paid = appointments.reduce((acc, appointment) => {
    if (appointment.isPaid) {
      if (appointment.currency !== requiredCurrency) {
        acc = acc + appointment.fee * currencyConversion[appointment.currency];
      } else {
        acc = acc + appointment.fee;
      }
    }
    return acc;
  }, 0);

  return fee;
};


module.exports.getTodayDate = getTodayDate;
module.exports.getSecondDate = getSecondDate;
module.exports.getStringDate = getStringDate;
module.exports.getNumOfWeeks = getNumOfWeeks;
module.exports.validCurrency = validCurrency;
module.exports.getFee = getFee;

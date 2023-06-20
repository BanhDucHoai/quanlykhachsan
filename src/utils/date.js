const formatDate = (_date) =>{
   return _date.toString();
}
const formatDateTime = (checkoutdate) =>{
   return checkoutdate.toString() + " 23:59:59";
}

module.exports = {formatDate, formatDateTime};
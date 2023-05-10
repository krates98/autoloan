var mongoose = require("mongoose");

var dataSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  city: String,
  state: String,
  address: String,
  zip: String,
  phone: String,
  propertytype: String,
  currentvalue: String,
  firstmortgagevalue: String,
  firstmortgagerate: String,
  ratetype: String,
  credit: String,
  loanamount: String,
  loantype: String,
  email: String,
  ltv: String,
});

module.exports = mongoose.model("Data", dataSchema);

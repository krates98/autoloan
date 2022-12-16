var mongoose = require("mongoose");

var fixedSchema = new mongoose.Schema({
   rent: Number,
   officeboy: Number,
   guard: Number,
   generator: Number,
   maid: Number,
   elecfix: Number,
   elecran: Number,
   diesel: Number,
   tead: Number,
   tean: Number,
   dsl: Number,
   emails: Number,
   fkref: Number,
   traffic: Number,
   hosting: Number,
   domains: Number,
   misl: Number,
   salary: Number,
   earning: Number
});

module.exports = mongoose.model("Fixed", fixedSchema);
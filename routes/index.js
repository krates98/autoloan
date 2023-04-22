const express = require("express"),
  router = express.Router(),
  ipAdd = require("../models/ipaddress");

//Landing page

router.get("/", async function (req, res) {
  var ipis = await ipAdd.findOne({ ipaddress: req.clientIp }, function (work) {
    return work;
  });

  if (ipis) {
    res.render("ipcheck", {
      error: "Please Logout, Change IP, Clear History!",
    });
  } else {
    res.render("index");
  }
});

module.exports = router;

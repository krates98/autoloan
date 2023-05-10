const express = require("express"),
  router = express.Router(),
  ipAdd = require("../models/ipaddress");
const axios = require("axios");

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

router.get("/getip", async function (req, res) {
  try {
    const response = await axios.get(
      "http://info.proxy.abcproxy.com/extractProxyIp?regions=us&num=1&protocol=http&return_type=json&lh=1"
    );
    const ip = response.data.data[0].ip;
    const port = response.data.data[0].port;
    const ipPort = ip + ":" + port;
    res.render("getip", { ipPort });
  } catch (error) {
    res.render("error", { message: "Failed to fetch IP address data" });
  }
});

module.exports = router;

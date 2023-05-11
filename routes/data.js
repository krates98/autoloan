const express = require("express"),
  router = express.Router(),
  Data = require("../models/data"),
  ipAdd = require("../models/ipaddress"),
  Counter = require("../models/counter"),
  request = require("request-promise"),
  moment = require("moment");

// Data Pages

router.get("/data", function (req, res) {
  res.render("data/notfound");
});

router.post("/data", function (req, res) {
  // var ip = "38.170.33.77";

  var ip = req.clientIp;
  // console.log(ip);
  // request("http://api.ipstack.com/"+ ip +"?access_key=2b9734f1e27d53cbe77f447111dba11c").then((body) => {
  request("http://ip-api.com/json/" + ip)
    .then((body) => {
      const ipData = JSON.parse(body);
      var xar = ipData.countryCode;
      var xac = ipData.regionName;
      var xa = ipData.region;

      Data.findOne({ state: xa }, function (err, alldata) {
        if (err) {
          req.flash("error", "Database Offline");
          res.redirect("back");
        } else {
          if (alldata) {
            // var currentIp = "38.170.33.77";
            var currentIp = req.clientIp;
            var datime = moment()
              .utc()
              .add(5, "hours")
              .add(30, "m")
              .format("DD/MM/YYYY");
            var tatime = moment()
              .utc()
              .add(5, "hours")
              .add(30, "m")
              .format("LTS");

            var ipcreate = {
              ipaddress: currentIp,
              date: datime,
              time: tatime,
            };
            ipAdd.create(ipcreate, function (err) {
              if (err) {
                console.log("error");
              } else {
                console.log("iP Added");
              }
            });
            res.render("data", { alldata: alldata, xar, xac, xa });
          } else {
            res.render("data/notfound");
          }
        }
      });
    })
    .catch(function (err) {
      res.render("data/notfound");
      console.log("Api call failed!!");
    });
});

// Data Show Page

router.get("/data/:id", async function (req, res) {
  res.render("data/notfound");
});

router.post("/data/:id", async function (req, res) {
  var counte = await Counter.find(function (err, result) {
    return result;
  });

  var oneData = await Data.findById(req.params.id, function (err, alldata) {
    return alldata;
  });

  await Data.findByIdAndRemove(req.params.id, function (err) {
    console.log("delete data");
  });

  res.render("data/show", {
    usadata: oneData,
    counte,
  });
});

//Delete Fetched Data
router.delete("/data/:id", function (req, res) {
  res.redirect("/logout");
});

module.exports = router;

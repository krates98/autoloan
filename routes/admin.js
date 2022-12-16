const express = require("express"),
  router = express.Router(),
  Data = require("../models/data"),
  Email = require("../models/emails"),
  ipAdd = require("../models/ipaddress"),
  User = require("../models/user"),
  Offer = require("../models/offers"),
  Att = require("../models/attendance"),
  Hitlist = require("../models/hitlist"),
  delIp = require("../models/deletedips"),
  moment = require("moment"),
  multer = require("multer"),
  csv = require("fast-csv"),
  fs = require("fs"),
  middleware = require("../middleware/");

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".csv");
  },
});

var upload = multer({ storage: storage });

// Admin Landing Page
router.get("/admin", middleware.isLoggedIn, async function (req, res) {
  var datime = moment().utc().add(5, "hours").add(30, "m").format("DD/MM/YYYY");
  var datime1 = moment()
    .utc()
    .subtract(18, "hours")
    .subtract(30, "m")
    .format("DD/MM/YYYY");
  var datime2 = moment()
    .utc()
    .subtract(43, "hours")
    .subtract(30, "m")
    .format("DD/MM/YYYY");
  var datime3 = moment()
    .utc()
    .subtract(67, "hours")
    .subtract(30, "m")
    .format("DD/MM/YYYY");
  var datime4 = moment()
    .utc()
    .subtract(91, "hours")
    .subtract(30, "m")
    .format("DD/MM/YYYY");
  var datcount1 = await ipAdd.countDocuments(
    { date: datime },
    function (err, result) {
      return result;
    }
  );
  var datcount2 = await ipAdd.countDocuments(
    { date: datime1 },
    function (err, result) {
      return result;
    }
  );
  var datcount3 = await ipAdd.countDocuments(
    { date: datime2 },
    function (err, result) {
      return result;
    }
  );
  var datcount4 = await ipAdd.countDocuments(
    { date: datime3 },
    function (err, result) {
      return result;
    }
  );
  var datcount5 = await ipAdd.countDocuments(
    { date: datime4 },
    function (err, result) {
      return result;
    }
  );
  var dat = [datime, datime1, datime2, datime3, datime4];
  var dac = [datcount1, datcount2, datcount3, datcount4, datcount5];
  res.render("admin/index", { dat, dac });
});

// Admin Today's Work

router.get(
  "/admin/todaywork",
  middleware.isLoggedIn,
  async function (req, res) {
    var datime = moment()
      .utc()
      .add(5, "hours")
      .add(30, "m")
      .format("DD/MM/YYYY");
    var today = await ipAdd.find({ date: datime }, function (err, todee) {
      return todee;
    });
    var worker = await User.find(function (err, uss) {
      return uss;
    });
    res.render("admin/todaywork", { today, worker });
  }
);

// Admin Yesterday's Work

router.get(
  "/admin/yesterdaywork",
  middleware.isLoggedIn,
  async function (req, res) {
    var datime = moment()
      .utc()
      .subtract(18, "hours")
      .subtract(30, "m")
      .format("DD/MM/YYYY");
    var today = await ipAdd.find({ date: datime }, function (err, todee) {
      return todee;
    });
    var worker = await User.find(function (err, uss) {
      return uss;
    });
    res.render("admin/yesterdaywork", { today, worker });
  }
);

// Admin Register User

router.get("/admin/register", middleware.isLoggedIn, function (req, res) {
  res.render("admin/register");
});

// Admin UserWork
router.get("/admin/userwork", middleware.isLoggedIn, async function (req, res) {
  var ussr = await User.find(function (err, work) {
    return work;
  });

  res.render("admin/userwork", { ussr });
});

router.post(
  "/admin/userwork",
  middleware.isLoggedIn,
  async function (req, res) {
    const users = req.body.users;
    const day = req.body.day;
    const month = req.body.month;
    const year = req.body.year;
    const date = day + "/" + month + "/" + year;
    var ipdata = await ipAdd.find(
      { username: users, date: date },
      function (err, work) {
        return work;
      }
    );

    var startTime, endTime, duration, minutes;
    var min = [];

    for (var j = 0; j < ipdata.length - 1; j++) {
      startTime = moment(ipdata[j].time, "HH:mm:ss a");
      endTime = moment(ipdata[j + 1].time, "HH:mm:ss a");
      duration = moment.duration(endTime.diff(startTime));
      minutes = parseInt(duration.asMinutes());
      min.push(minutes);
    }

    if (ipdata && ipdata.length) {
      res.render("admin/userwork2", { ipdata, min });
    } else {
      req.flash("error", "Data Not Found");
      res.redirect("back");
    }
  }
);

// Admin Data Left
router.get("/admin/dataleft", middleware.isLoggedIn, async function (req, res) {
  var EMAIL = await Email.countDocuments(function (err, result) {
    return result;
  });

  let arr = [];
  let states = [
    {
      name: "Alabama",
      abbreviation: "AL",
    },
    {
      name: "Alaska",
      abbreviation: "AK",
    },
    {
      name: "American Samoa",
      abbreviation: "AS",
    },
    {
      name: "Arizona",
      abbreviation: "AZ",
    },
    {
      name: "Arkansas",
      abbreviation: "AR",
    },
    {
      name: "California",
      abbreviation: "CA",
    },
    {
      name: "Colorado",
      abbreviation: "CO",
    },
    {
      name: "Connecticut",
      abbreviation: "CT",
    },
    {
      name: "Delaware",
      abbreviation: "DE",
    },
    {
      name: "District Of Columbia",
      abbreviation: "DC",
    },
    {
      name: "Federated States Of Micronesia",
      abbreviation: "FM",
    },
    {
      name: "Florida",
      abbreviation: "FL",
    },
    {
      name: "Georgia",
      abbreviation: "GA",
    },
    {
      name: "Guam",
      abbreviation: "GU",
    },
    {
      name: "Hawaii",
      abbreviation: "HI",
    },
    {
      name: "Idaho",
      abbreviation: "ID",
    },
    {
      name: "Illinois",
      abbreviation: "IL",
    },
    {
      name: "Indiana",
      abbreviation: "IN",
    },
    {
      name: "Iowa",
      abbreviation: "IA",
    },
    {
      name: "Kansas",
      abbreviation: "KS",
    },
    {
      name: "Kentucky",
      abbreviation: "KY",
    },
    {
      name: "Louisiana",
      abbreviation: "LA",
    },
    {
      name: "Maine",
      abbreviation: "ME",
    },
    {
      name: "Marshall Islands",
      abbreviation: "MH",
    },
    {
      name: "Maryland",
      abbreviation: "MD",
    },
    {
      name: "Massachusetts",
      abbreviation: "MA",
    },
    {
      name: "Michigan",
      abbreviation: "MI",
    },
    {
      name: "Minnesota",
      abbreviation: "MN",
    },
    {
      name: "Mississippi",
      abbreviation: "MS",
    },
    {
      name: "Missouri",
      abbreviation: "MO",
    },
    {
      name: "Montana",
      abbreviation: "MT",
    },
    {
      name: "Nebraska",
      abbreviation: "NE",
    },
    {
      name: "Nevada",
      abbreviation: "NV",
    },
    {
      name: "New Hampshire",
      abbreviation: "NH",
    },
    {
      name: "New Jersey",
      abbreviation: "NJ",
    },
    {
      name: "New Mexico",
      abbreviation: "NM",
    },
    {
      name: "New York",
      abbreviation: "NY",
    },
    {
      name: "North Carolina",
      abbreviation: "NC",
    },
    {
      name: "North Dakota",
      abbreviation: "ND",
    },
    {
      name: "Northern Mariana Islands",
      abbreviation: "MP",
    },
    {
      name: "Ohio",
      abbreviation: "OH",
    },
    {
      name: "Oklahoma",
      abbreviation: "OK",
    },
    {
      name: "Oregon",
      abbreviation: "OR",
    },
    {
      name: "Palau",
      abbreviation: "PW",
    },
    {
      name: "Pennsylvania",
      abbreviation: "PA",
    },
    {
      name: "Puerto Rico",
      abbreviation: "PR",
    },
    {
      name: "Rhode Island",
      abbreviation: "RI",
    },
    {
      name: "South Carolina",
      abbreviation: "SC",
    },
    {
      name: "South Dakota",
      abbreviation: "SD",
    },
    {
      name: "Tennessee",
      abbreviation: "TN",
    },
    {
      name: "Texas",
      abbreviation: "TX",
    },
    {
      name: "Utah",
      abbreviation: "UT",
    },
    {
      name: "Vermont",
      abbreviation: "VT",
    },
    {
      name: "Virgin Islands",
      abbreviation: "VI",
    },
    {
      name: "Virginia",
      abbreviation: "VA",
    },
    {
      name: "Washington",
      abbreviation: "WA",
    },
    {
      name: "West Virginia",
      abbreviation: "WV",
    },
    {
      name: "Wisconsin",
      abbreviation: "WI",
    },
    {
      name: "Wyoming",
      abbreviation: "WY",
    },
  ];
  let countDocs;
  for (let state of states) {
    countDocs = await Data.countDocuments(
      { state: state.abbreviation },
      function (err, result) {
        return result;
      }
    );
    arr.push(countDocs);
  }
  res.render("admin/dataleft", { states, arr, EMAIL });
});

// Admin HitList Page
router.get("/admin/hitlist", middleware.isLoggedIn, function (req, res) {
  res.render("admin/hitlist");
});

router.post(
  "/admin/hitlistsuccess",
  middleware.isLoggedIn,
  upload.single("myFile"),
  (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    const hitRows = [];
    var hitcreate;
    var datime = moment()
      .utc()
      .add(5, "hours")
      .add(30, "m")
      .format("DD/MM/YYYY");

    // open uploaded file

    csv
      .parseFile(req.file.path, { headers: true })
      .on("data", function (data) {
        hitRows.push(data); // push each row
      })
      .on("end", async function () {
        fs.unlinkSync(req.file.path);
        hitRows.forEach(function (bean) {
          hitcreate = {
            offer1: bean.offer1,
            offer2: bean.offer2,
            offer3: bean.offer3,
            offer4: bean.offer4,
            offer5: bean.offer5,
            date: datime,
          };
          Hitlist.create(hitcreate, function (err, userdata) {
            if (err) {
              console.log(err);
            } else {
              console.log("added hitlist");
            }
          });
        });
        res.render("admin/hitlistsuccess");
      });
  }
);

// Admin HitList Page
router.get(
  "/admin/checkhitlist",
  middleware.isLoggedIn,
  async function (req, res) {
    var workers = await User.find(function (err, work) {
      return work;
    });

    var datime = moment()
      .utc()
      .add(5, "hours")
      .add(30, "m")
      .format("DD/MM/YYYY");

    var join = await Hitlist.aggregate([
      {
        $lookup: {
          from: "ipaddresses",
          localField: "offer1",
          foreignField: "ipaddress",
          as: "newhitlist",
        },
      },
      {
        $unwind: "$newhitlist",
      },
      {
        $project: {
          username: "$newhitlist.username",
          ipaddress: "$newhitlist.ipaddress",
          date: "$newhitlist.date",
        },
      },
    ]).exec();

    var join2 = await Hitlist.aggregate([
      {
        $lookup: {
          from: "ipaddresses",
          localField: "offer2",
          foreignField: "ipaddress",
          as: "newhitlist",
        },
      },
      {
        $unwind: "$newhitlist",
      },
      {
        $project: {
          username: "$newhitlist.username",
          ipaddress: "$newhitlist.ipaddress",
          date: "$newhitlist.date",
        },
      },
    ]).exec();

    var join3 = await Hitlist.aggregate([
      {
        $lookup: {
          from: "ipaddresses",
          localField: "offer3",
          foreignField: "ipaddress",
          as: "newhitlist",
        },
      },
      {
        $unwind: "$newhitlist",
      },
      {
        $project: {
          username: "$newhitlist.username",
          ipaddress: "$newhitlist.ipaddress",
          date: "$newhitlist.date",
        },
      },
    ]).exec();
    var join4 = await Hitlist.aggregate([
      {
        $lookup: {
          from: "ipaddresses",
          localField: "offer4",
          foreignField: "ipaddress",
          as: "newhitlist",
        },
      },
      {
        $unwind: "$newhitlist",
      },
      {
        $project: {
          username: "$newhitlist.username",
          ipaddress: "$newhitlist.ipaddress",
          date: "$newhitlist.date",
        },
      },
    ]).exec();

    var join5 = await Hitlist.aggregate([
      {
        $lookup: {
          from: "ipaddresses",
          localField: "offer5",
          foreignField: "ipaddress",
          as: "newhitlist",
        },
      },
      {
        $unwind: "$newhitlist",
      },
      {
        $project: {
          username: "$newhitlist.username",
          ipaddress: "$newhitlist.ipaddress",
          date: "$newhitlist.date",
        },
      },
    ]).exec();

    var off1arr = [];
    var wooo = 0;

    for (var i = 1; i < workers.length; i++) {
      for (var j = 0; j < join.length; j++) {
        if (workers[i].username === join[j].username) {
          wooo++;
        }
      }
      off1arr.push(wooo);
      wooo = 0;
    }

    var off2arr = [];

    for (var i = 1; i < workers.length; i++) {
      for (var j = 0; j < join2.length; j++) {
        if (workers[i].username === join2[j].username) {
          wooo++;
        }
      }
      off2arr.push(wooo);
      wooo = 0;
    }
    var off3arr = [];
    for (var i = 1; i < workers.length; i++) {
      for (var j = 0; j < join3.length; j++) {
        if (workers[i].username === join3[j].username) {
          wooo++;
        }
      }
      off3arr.push(wooo);
      wooo = 0;
    }
    var off4arr = [];
    for (var i = 1; i < workers.length; i++) {
      for (var j = 0; j < join4.length; j++) {
        if (workers[i].username === join4[j].username) {
          wooo++;
        }
      }
      off4arr.push(wooo);
      wooo = 0;
    }
    var off5arr = [];
    for (var i = 1; i < workers.length; i++) {
      for (var j = 0; j < join5.length; j++) {
        if (workers[i].username === join5[j].username) {
          wooo++;
        }
      }
      off5arr.push(wooo);
      wooo = 0;
    }
    await Hitlist.deleteMany();
    res.render("admin/checkhitlist", {
      workers,
      off1arr,
      off2arr,
      off3arr,
      off4arr,
      off5arr,
    });
  }
);

// Admin Upload Email
router.get("/admin/uploademail", middleware.isLoggedIn, function (req, res) {
  res.render("admin/uploademail");
});

router.post(
  "/admin/uploademail",
  middleware.isLoggedIn,
  upload.single("myFile"),
  (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }

    const emailRows = [];
    // open uploaded file

    csv
      .parseFile(req.file.path, { headers: true })
      .on("data", function (data) {
        emailRows.push(data); // push each row
      })
      .on("end", function () {
        fs.unlinkSync(req.file.path);
        emailRows.forEach(function (bean) {
          Email.create(bean, function (err, email) {
            if (err) {
              console.log(err);
            } else {
              console.log("added email");
            }
          });
        });
        res.render("admin/uploademail2");
      });
  }
);

// Admin Attendance Current Month
router.get(
  "/admin/attendance",
  middleware.isLoggedIn,
  async function (req, res) {
    var worker = await User.find(function (err, work) {
      return work;
    });

    var dates = await ipAdd.find(
      {
        date: {
          $regex:
            "/" + moment().utc().add(5, "hours").add(30, "m").format("MM/YYYY"),
        },
        time: { $regex: "PM" },
      },
      function (err, work) {
        return work;
      }
    );

    var daysd = moment().utc().add(5, "hours").add(30, "m").format("D");
    var curm = moment().utc().add(5, "hours").add(30, "m").format("MM");
    var durm = moment().utc().add(5, "hours").add(30, "m").format("YYYY");
    var xax;
    var arr = [];
    var cx = 0;

    res.render("admin/attendance", {
      worker,
      dates,
      xax,
      arr,
      cx,
      daysd,
      curm,
      durm,
    });
  }
);

// Admin Attendance Last Month
router.get(
  "/admin/lastmonth",
  middleware.isLoggedIn,
  async function (req, res) {
    var worker = await User.find(function (err, work) {
      return work;
    });

    var dates = await ipAdd.find(
      {
        date: {
          $regex:
            "/" +
            moment()
              .utc()
              .add(5, "hours")
              .add(30, "m")
              .subtract(1, "months")
              .format("MM/YYYY"),
        },
        time: { $regex: "PM" },
      },
      function (err, work) {
        return work;
      }
    );
    var daysd = moment()
      .utc()
      .add(5, "hours")
      .add(30, "m")
      .subtract(1, "months")
      .daysInMonth();
    var lasm = moment().utc().subtract(1, "months").format("MM");
    var durm = moment()
      .utc()
      .add(5, "hours")
      .add(30, "m")
      .subtract(1, "months")
      .format("YYYY");
    var xax;
    var arr = [];
    var cx = 0;
    res.render("admin/attendance2", {
      worker,
      dates,
      xax,
      arr,
      cx,
      daysd,
      lasm,
      durm,
    });
  }
);

// Admin Upload Data
router.get("/admin/uploaddata", middleware.isLoggedIn, function (req, res) {
  res.render("admin/uploaddata");
});

router.post(
  "/admin/uploaddata",
  middleware.isLoggedIn,
  upload.single("myFile"),
  (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }

    const dataRows = [];
    // open uploaded file

    csv
      .parseFile(req.file.path, { headers: true })
      .on("data", function (data) {
        dataRows.push(data); // push each row
      })
      .on("end", function () {
        fs.unlinkSync(req.file.path);
        dataRows.forEach(function (bean) {
          Data.create(bean, function (err, userdata) {
            if (err) {
              console.log(err);
            } else {
              console.log("added data");
            }
          });
        });
        res.render("admin/uploaddata2");
      });
  }
);

// Admin Update Offers
router.get("/admin/offers", middleware.isLoggedIn, async function (req, res) {
  var userdata = await User.find(function (err, userd) {
    return userd;
  });
  var offurl = await Offer.find(function (err, offig) {
    return offig;
  });
  res.render("admin/offers", { offurl, userdata });
});

// Admin Post Update Offers
router.post("/admin/offers", middleware.isLoggedIn, async function (req, res) {
  var insput = req.body.offerurl;
  var off = req.body.offername;

  var addoff = {
    offerurl: insput,
    offername: off,
    toggle: false,
    priority: 1,
    page: 1,
  };

  Offer.create(addoff, function (err, email) {
    if (err) {
      console.log(err);
    } else {
      console.log("added offer");
    }
  });
  req.flash("success", "Offer Added");
  res.redirect("back");
});

router.post("/admin/offers/:id", function (req, res) {
  var togg;
  if (req.body.on === "on") {
    togg = { toggle: false };
  } else {
    togg = { toggle: true };
  }
  Offer.findByIdAndUpdate(req.params.id, togg, function (err, blog) {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Turned Off Offer");
      res.redirect("back");
    }
  });
});

router.put("/admin/offers/:id", middleware.isLoggedIn, function (req, res) {
  var addoff = { priority: req.body.pri, page: req.body.page };
  Offer.findByIdAndUpdate(req.params.id, addoff, function (err, random) {
    if (err) {
      console.log("Error");
    } else {
      req.flash("success", "Priority & Page Set");
      res.redirect("back");
    }
  });
});

router.delete("/admin/offers/:id", function (req, res) {
  Offer.findById(req.params.id, function (err, offrm) {
    if (err) {
      console.log(err);
    } else {
      offrm.remove();
      req.flash("success", "Deleted Offer");
      res.redirect("back");
    }
  });
});

router.post("/admin/pageupdate", middleware.isLoggedIn, function (req, res) {
  var sal = { page: req.body.page };
  var seu = { username: req.body.users };
  User.findOneAndUpdate(seu, sal, async function (err) {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Page Updated");
      res.redirect("back");
    }
  });
});

// Admin Salary User

router.get("/admin/salary", middleware.isLoggedIn, async function (req, res) {
  var userdata = await User.find(function (err, userd) {
    return userd;
  });
  res.render("admin/salary", { userdata });
});

// Admin Salary Post

router.post("/admin/salary", middleware.isLoggedIn, function (req, res) {
  var sal = { salary: req.body.salary };
  var seu = { username: req.body.users };
  User.findOneAndUpdate(seu, sal, async function (err, blog) {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Salary Updated");
      res.redirect("back");
    }
  });
});

// Admin Generate Salary

router.get(
  "/admin/gensalary",
  middleware.isLoggedIn,
  async function (req, res) {
    var worker = await User.find(function (err, work) {
      return work;
    });

    var dates = await ipAdd.find(
      {
        date: {
          $regex:
            "/" + moment().utc().add(5, "hours").add(30, "m").format("MM/YYYY"),
        },
        time: { $regex: "PM" },
      },
      function (err, work) {
        return work;
      }
    );

    var attrea = await Att.find(
      {
        date: {
          $regex:
            "/" + moment().utc().add(5, "hours").add(30, "m").format("MM/YYYY"),
        },
      },
      function (err, work) {
        return work;
      }
    );
    var daysm = moment().utc().add(5, "hours").add(30, "m").daysInMonth();
    var daysd = moment().utc().add(5, "hours").add(30, "m").format("D");
    var curm = moment().utc().add(5, "hours").add(30, "m").format("MM");
    var durm = moment().utc().add(5, "hours").add(30, "m").format("YYYY");
    var xax;
    var arr = [];
    var cx = 0;
    var dsal = 0;

    res.render("admin/gensalary", {
      worker,
      dates,
      xax,
      arr,
      cx,
      daysd,
      curm,
      dsal,
      daysm,
      attrea,
      durm,
    });
  }
);

// Admin Generate Last Month Salary

router.get(
  "/admin/gensalarylm",
  middleware.isLoggedIn,
  async function (req, res) {
    var worker = await User.find(function (err, work) {
      return work;
    });

    var dates = await ipAdd.find(
      {
        date: {
          $regex:
            "/" +
            moment()
              .utc()
              .add(5, "hours")
              .add(30, "m")
              .subtract(1, "months")
              .format("MM/YYYY"),
        },
        time: { $regex: "PM" },
      },
      function (err, work) {
        return work;
      }
    );

    var attrea = await Att.find(
      {
        date: {
          $regex:
            "/" +
            moment()
              .utc()
              .add(5, "hours")
              .add(30, "m")
              .subtract(1, "months")
              .format("MM/YYYY"),
        },
      },
      function (err, work) {
        return work;
      }
    );
    var daysm = moment()
      .utc()
      .add(5, "hours")
      .add(30, "m")
      .subtract(1, "months")
      .daysInMonth();
    var curm = moment()
      .utc()
      .add(5, "hours")
      .add(30, "m")
      .subtract(1, "months")
      .format("MM");
    var durm = moment()
      .utc()
      .add(5, "hours")
      .add(30, "m")
      .subtract(1, "months")
      .format("YYYY");
    var xax;
    var arr = [];
    var cx = 0;
    var dsal = 0;
    res.render("admin/gensalarylm", {
      worker,
      dates,
      xax,
      arr,
      cx,
      curm,
      dsal,
      daysm,
      attrea,
      durm,
    });
  }
);

// User Performance

router.get(
  "/admin/performance",
  middleware.isLoggedIn,
  async function (req, res) {
    var ipdata = await ipAdd.find(
      {
        date: {
          $regex:
            "/" + moment().utc().add(5, "hours").add(30, "m").format("MM/YYYY"),
        },
        time: { $regex: "PM" },
      },
      function (err, work) {
        return work;
      }
    );

    var worker = await User.find(function (err, work) {
      return work;
    });

    // for(var i=0;i<ipdata.length;i++){
    //     if(worker[1].username === ipData[i].username){

    //     }
    // }
    var startTime;
    var endTime;
    var duration;
    var minutes;
    var min = [],
      dut = [];
    var user = worker[8].username;
    var attcount = ipdata.filter((x) => x.username == worker[8].username);
    for (var j = 0; j < attcount.length - 1; j++) {
      startTime = moment(attcount[j].time, "HH:mm:ss a");
      endTime = moment(attcount[j + 1].time, "HH:mm:ss a");
      duration = moment.duration(endTime.diff(startTime));
      minutes = parseInt(duration.asMinutes());
      min.push(minutes);
      dut.push(attcount[j].date);
    }

    res.render("admin/performance", { worker, ipdata, min, dut, user });
  }
);

// Admin IP Delete & Store

router.get(
  "/admin/deleteips",
  middleware.isLoggedIn,
  async function (req, res) {
    res.render("admin/deleteips");
  }
);

// Admin IP Delete & Store Post Route

router.post(
  "/admin/deleteips",
  middleware.isLoggedIn,
  async function (req, res) {
    const day = req.body.day;
    const month = req.body.month;
    const year = req.body.year;
    const date = day + "/" + month + "/" + year;
    var found = await ipAdd.find({ date: date }, function (err, ipad) {
      return ipad;
    });
    res.render("admin/deleteips2", { found, date });
  }
);

// Admin IP Delete & Store Delete Route

router.delete(
  "/admin/deleteips",
  middleware.isLoggedIn,
  async function (req, res) {
    var datime = moment()
      .utc()
      .add(5, "hours")
      .add(30, "m")
      .format("DD/MM/YYYY");
    var found = await ipAdd.find({ date: req.body.date }, function (err, ipad) {
      return ipad;
    });
    var delips;
    found.forEach(function (ipad) {
      delips = {
        ipaddress: ipad.ipaddress,
        date: ipad.date,
        time: ipad.time,
        username: ipad.username,
        deleteday: datime,
      };
      delIp.create(delips, function (err) {
        if (err) {
          console.log("Problem Adding Deleted ips");
        } else {
          console.log("Added Deleted ips");
        }
      });
      ipAdd.findOneAndDelete(
        { ipaddress: ipad.ipaddress },
        function (err, offrm) {
          if (err) {
            console.log(err);
          } else {
            offrm.remove();
            console.log("Removed Ip");
          }
        }
      );
    });
    req.flash("success", "iPs Deleted For " + req.body.date);
    res.redirect("back");
  }
);

module.exports = router;

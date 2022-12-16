const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  Email = require("../models/emails"),
  User = require("../models/user"),
  ipAdd = require("../models/ipaddress"),
  crypto = require("crypto"),
  async = require("async"),
  nodemailer = require("nodemailer"),
  request = require("request-promise"),
  middleware = require("../middleware/");

var transporter = nodemailer.createTransport(
  {
    service: "gmail",
    auth: {
      user: "kratesrockstar@gmail.com",
      pass: "mnm123xx",
    },
  }
  //   {
  //     host: 'smtp.gmail.com',
  //     port: 465,
  //     secure: true,
  //     auth: {
  //         type: 'OAuth2',
  //         user: 'kratesrockstar@gmail.com',
  //         clientId: '660034104687-7cjclvriplqi2k9h5if7u9i7hhj3klts.apps.googleusercontent.com',
  //         clientSecret: 'VF529KVc5QJuTmMg61d_Lw_9',
  //         refreshToken: '1//04PnhrnssQFfBCgYIARAAGAQSNwF-L9IrI1FQH6zospQHj75WwyWlGEl-xvYgZJ0r7HBBG5QFSlUODL9g1oIutdvNZF1l3IxZzvo',
  //         accessToken: 'ya29.a0AfH6SMB-7qIXDe6P69J04yKvjPoMu-PRhKHdPMK7U7nE0eMLRrx3-_G5HqNi0UzMOH8bah5hM0_WjxVu406FjInqmQkpimDO6lyEaR6lvQU00RMsQHirFPNUGoKGHyr_wSckXXQ9PZjDIWh_oIgAu-md4Aet3v5iED0'
  //     }
  // }
);

var mailOptions = {
  from: "Kushagra Srivastava <kratesrockstar@gmail.com>",
  to: "krates198@gmail.com",
  subject: "Email Count Low",
  text: "Please upload more emails its less than 100",
};

//Landing page

router.get("/", middleware.isLoggedInUser, async function (req, res) {
  //   var emax = await Email.countDocuments(function(err,emaxa){
  //       return emaxa;
  //   });

  //   var counte = await Counter.find(function( err,result){
  //     return result;
  // })

  //   // Send mail if less than 1000 emails
  //   if(emax < 1000 && counte[0].count % 100 == 0 ){
  //       transporter.sendMail(mailOptions, function (err, res) {
  //           if(err){
  //               console.log("not sent");
  //           } else {
  //               console.log('Email Sent');
  //           }
  //       })
  //   }
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

// Show Change IP Form
router.get("/changeip", middleware.isLoggedInUser, function (req, res) {
  var ip = req.clientIp;
  request("http://ip-api.com/json/" + ip).then((body) => {
    const ipData = JSON.parse(body);
    var xar = ipData.countryCode;
    var xac = ipData.regionName;
    var xa = ipData.region;
    var xax = req.clientIp;
    res.render("changeip/index", { xax, xar, xac, xa });
  });
});

//     // Show Change Location
//     router.get("/changeip/location", middleware.isLoggedInUser, function(req,res){
//         // request("https://proxypanel.io/proxy/locations/"+ req.user.dsl +"/355eb53c2d605431e543879bd452889b:46Vm_w5j_S98k6-Gy2h__LmGYxY1LDSq_nEqho4D60E").then((body) => {
//         request("https://proxypanel.io/proxy/locations/coolroxxx/custom1/355eb53c2d605431e543879bd452889b:46Vm_w5j_S98k6-Gy2h__LmGYxY1LDSq_nEqho4D60E").then((body) => {

//         const status = JSON.parse(body);
//         var xar = status.status;
//         res.render("changeip/location",{xar});
//     })
// });
//           // Show Change Location
//       router.get("/changeip/ip", middleware.isLoggedInUser, function(req,res){
//         // request("https://proxypanel.io/proxy/change-ip/"+ req.user.dsl +"/355eb53c2d605431e543879bd452889b:46Vm_w5j_S98k6-Gy2h__LmGYxY1LDSq_nEqho4D60E").then((body) => {
//         request("https://proxypanel.io/proxy/change-ip/coolroxxx/custom1/355eb53c2d605431e543879bd452889b:46Vm_w5j_S98k6-Gy2h__LmGYxY1LDSq_nEqho4D60E").then((body) => {
//         const status = JSON.parse(body);
//         var xar = status.status;
//         res.render("changeip/ip",{xar});
//     })
// });

// Show Register Form
router.get("/hiddenregister", function (req, res) {
  res.render("register");
});

// Sign Up Logic

router.post("/hiddenregister", function (req, res) {
  var newUser = new User({ username: req.body.username });

  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome To Techlab");
      res.redirect("/");
    });
  });
});

// Show Login Form
router.get("/login", function (req, res) {
  res.render("login", { message: req.flash("error") });
});

// Login Logic

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

// Logout Logic

router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Logged Out");
  res.redirect("/login");
});

router.get("/forgot", function (req, res) {
  res.render("forgot");
});

router.post("/forgot", function (req, res, next) {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            console.log("error", "No account with that email address exists.");
            return res.redirect("/forgot");
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var mailOptions = {
          to: user.email,
          from: "kratesrockstar@gmail.com",
          subject: "Techlab Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        transporter.sendMail(mailOptions, function (err) {
          console.log("mail sent");
          console.log(
            "success",
            "An e-mail has been sent to " +
              user.email +
              " with further instructions."
          );
          done(err, "done");
        });
      },
    ],
    function (err) {
      if (err) return next(err);
      res.redirect("/forgot");
    }
  );
});

router.get("/reset/:token", function (req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        console.log("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot");
      }
      res.render("reset", { token: req.params.token });
    }
  );
});

router.post("/reset/:token", function (req, res) {
  async.waterfall(
    [
      function (done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          function (err, user) {
            if (!user) {
              console.log(
                "error",
                "Password reset token is invalid or has expired."
              );
              return res.redirect("back");
            }
            if (req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function (err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function (err) {
                  req.logIn(user, function (err) {
                    done(err, user);
                  });
                });
              });
            } else {
              console.log("error", "Passwords do not match.");
              return res.redirect("back");
            }
          }
        );
      },
      function (user, done) {
        var mailOptions = {
          to: user.email,
          from: "kratesrockstar@gmail.com",
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.email +
            " has just been changed.\n",
        };
        transporter.sendMail(mailOptions, function (err) {
          console.log("success", "Success! Your password has been changed.");
          done(err);
        });
      },
    ],
    function (err) {
      res.redirect("/");
    }
  );
});

module.exports = router;

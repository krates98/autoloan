var express = require("express"),
  app = express(),
  methodOverride = require("method-override"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user");

var authRoutes = require("./routes/index"),
  dataRoutes = require("./routes/data"),
  offersRoutes = require("./routes/offers"),
  adminRoutes = require("./routes/admin"),
  userRoutes = require("./routes/users"),
  accountRoutes = require("./routes/accounts");

mongoose.connect(
  "mongodb+srv://krates:suyash98@yelpcamp-rda1o.mongodb.net/autoloan?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);
// mongoose.connect('mongodb://localhost:27017/techlab', { useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true});
mongoose.set("useFindAndModify", false);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

// passport configuration
app.use(
  require("express-session")({
    secret: "Whisky Cutest Dog",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// require request-ip and register it as middleware
var requestIp = require("request-ip");
app.use(requestIp.mw());

app.use("/", authRoutes);
app.use("/", dataRoutes);
app.use("/", offersRoutes);
app.use("/", adminRoutes);
app.use("/", userRoutes);
app.use("/", accountRoutes);

app.listen(3001, process.env.IP || "127.0.0.1", function () {
  // app.listen(process.env.PORT, process.env.IP, function () {
  console.log("Techlab Server Has Started!");
});

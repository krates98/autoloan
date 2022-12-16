var     express         = require("express"),
        app             = express(),
        methodOverride  = require('method-override'),
        bodyParser      = require("body-parser"),
        mongoose        = require("mongoose"),
        passport        = require("passport"),
        LocalStrategy   = require("passport-local"),
        Data            = require("./models/data"),
        Email           = require("./models/emails"),
        User            = require("./models/user"),
        ipAdd           = require("./models/ipaddress"),
        request         = require("request-promise"),
        seedDB          = require("./seeds");
        
var     authRoutes      = require("./routes/index"),
        dataRoutes      = require("./routes/data"),
        offersRoutes    = require("./routes/offers"),
        adminRoutes     = require("./routes/admin");

    mongoose.connect('mongodb://localhost:27017/techlab1', { useNewUrlParser: true , useUnifiedTopology: true });
    mongoose.set('useFindAndModify', false);
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(__dirname + "/public"));
    app.set("view engine", "ejs");
    app.use(methodOverride('_method'));
    
    // seedDB();

    // passport configuration
    app.use(require("express-session")({
        secret: "Whisky Cutest Dog",
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use(function(req, res, next){
        res.locals.currentUser = req.user;
        next();
    });

    // require request-ip and register it as middleware
    var requestIp = require('request-ip');
    app.use(requestIp.mw())

    app.use("/", authRoutes);
    app.use("/", dataRoutes);
    app.use("/", offersRoutes);
    app.use("/", adminRoutes);

    app.listen(3000, '127.0.0.1', function(){
    // app.listen(process.env.PORT, process.env.IP, function(){
        console.log("Techlab Server Has Started!");
     });
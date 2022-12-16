//All the middleware Goes Here

var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        var usher = req.user.username;
        if(usher === "krates"){
        return next();
        }
        else {
            res.send("Not Authorised");
        }
    }
    req.flash("error","Please Login First");
   res.redirect("/login");
    }

middlewareObj.isLoggedInUser = function isLoggedInUser(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
   req.flash("error","Please Login First");
   res.redirect("/login");
    }

module.exports = middlewareObj;
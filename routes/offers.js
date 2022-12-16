const   express         = require("express"),
        Offer           = require("../models/offers"),
        User            = require("../models/user"),
        Counter         = require("../models/counter"),
        middleware      = require("../middleware/"),
        router          = express.Router();
    
    // Fetch Offer Pages

    

    router.get("/pages", middleware.isLoggedInUser,async function(req,res){

        var worker  = await User.find({username: res.locals.currentUser.username},function(err,uss){
            return uss;
        })

        var counte = await Counter.find(function( err,result){
            return result;
        })
        var cx = {count: (counte[0].count+1)};
        Counter.findOneAndUpdate(counte,cx,function(err,upd){
            if(err){
                console.log("failed");
            } else {
                console.log("updated")
            }
        })  
        var offurl = await Offer.find({toggle: true,page: worker[0].page}, function(err,result){
            return result;
        });
        res.render("pages/pages",{offurl,counte});
    });


module.exports = router;
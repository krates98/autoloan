const   express         = require("express"),
        router          = express.Router(),
        User            = require("../models/user"),
        Att             = require("../models/attendance"),
        ipAdd           = require("../models/ipaddress"),
        middleware      = require("../middleware/"),
        moment          = require('moment');

    // User Attendance 
    router.get("/users/attendance", middleware.isLoggedInUser, function(req,res){
        var reas;
        Att.find({date: moment().utc().add(5, 'hours').add(30,'m').format("DD/MM/YYYY")}, function(err, attData){
            if(err){
                console.log(err);
            }
            else{
                for(var i=0;i<attData.length;i++){
                if(req.user.username === attData[i].username){
                reas = attData[i].reason;
                return res.render("users/submitted",{reas});
                }
              };
        res.render("users/attendance");
        }
    });
});

    // User Attendance 
    router.post("/users/attendance", middleware.isLoggedInUser, function(req,res){
        var userne  = req.user.username;
        var reason = req.body.reason;
        var quantity = req.body.quantity;
        var datime    = moment().utc().add(5, 'hours').add(30,'m').format("DD/MM/YYYY");
        var attcreate  = {username: userne, date: datime, overtime: quantity, reason: reason}; 
        Att.create(attcreate, function(err, email){
            if(err){
                console.log(err)
                } 
            });
                req.flash("success","Attendance Updated For Today")
                res.redirect("/users/attendance");
        });

    // Moderate Attendance

    router.get("/users/mod", middleware.isLoggedInUser,async function(req,res){
        
        
        var attrea = await Att.find({date: {$regex: "\/"+ moment().utc().add(5, 'hours').add(30,'m').format("MM/YYYY")}},function(err,work){
            return work;
        })
        var dates = await Att.find({date: {$regex: "\/"+ moment().utc().add(5, 'hours').add(30,'m').subtract(1, 'months').format("MM/YYYY")}},function(err,work){
            return work;
        })
            var datime    = moment().utc().subtract(18, 'hours').subtract(30,'m').format("DD/MM/YYYY");
            var today     = await ipAdd.find({date: datime}, function(err,todee){
                                return todee;
                            });
            var worker    = await User.find(function(err,uss){
                                return uss;
                            })


        res.render("users/mod", {attrea,dates,today,worker});
    });

    router.get("/users/salary", middleware.isLoggedInUser,async function(req,res){
        var userdata = await User.find(function (err,userd){
            return userd;
        })
        res.render("users/salary",{userdata});

    })

    
    router.post("/users/salary", middleware.isLoggedInUser,function(req,res){
        var sal = {salary: req.body.salary};
        var seu = {username: req.body.users};
        User.findOneAndUpdate(seu, sal,async function(err, blog){
           if(err){
               console.log(err);
           } else {
               req.flash("success","Salary Updated")
               res.redirect("back");
           }
       });
   });

    // router.post("/users/updated", middleware.isLoggedInUser,async function(req,res){

    //          var sal = {dsl: req.body.dsl};
    //          var seu = {username: req.body.users};
    //          User.findOneAndUpdate(seu, sal,async function(err, blog){
    //             if(err){
    //                 console.log(err);
    //             } else {
    //                 req.flash("success","DSL Updated");   
    //             }
    //         });

    //     res.render("users/updated");
    // });

    // User Profile 
    router.get("/users/:id", middleware.isLoggedInUser, function(req,res){
        res.render("users/userprofile");
    });

    // User Post Route 
    router.put("/users/:id", middleware.isLoggedInUser, function(req,res){
	User.findByIdAndUpdate(req.params.id, req.body, function(err,updateduser){
		if(err){
            req.flash("error","Error Updating Profile "+ err);
			res.redirect("/users/" + req.params.id);
		}
		else{
            req.flash("success","Profile Updated");
			res.redirect("/users/" + req.params.id);    
		}
	});
});

    module.exports = router;
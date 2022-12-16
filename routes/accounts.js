const   express         = require("express"),
        Fixed           = require("../models/fixedcost"),
        Trans           = require("../models/transactions"),
        { Convert }     = require("easy-currencies");
        moment          = require("moment"),
        middleware      = require("../middleware/"),
        router          = express.Router();

    // Fetch Account Page

    router.get("/accounts", middleware.isLoggedIn ,async function(req,res){
        const cost = await Fixed.find(function(ting){
            return ting;
        })

        var daysm = moment().utc().add(5, 'hours').add(30,'m').daysInMonth();

        let costing = (cost[0].rent + cost[0].officeboy + cost[0].guard + cost[0].generator + cost[0].maid + cost[0].elecfix + cost[0].elecran + cost[0].diesel + cost[0].tead + cost[0].tean + cost[0].dsl + cost[0].emails + cost[0].fkref + cost[0].traffic + cost[0].hosting + cost[0].domains + cost[0].misl + cost[0].salary)
        res.render("accounts/index", {cost,costing,daysm});
    });

    // Fetch Account Fixed Cost Page

    router.get("/accounts/fixedcost", middleware.isLoggedIn ,async function(req,res){
        const cost = await Fixed.find(function(ting){
            return ting;
        })
        
        res.render("accounts/fixedcost",{cost});
    });

    // Post Account Fixed Cost Page

    router.post("/accounts/fixedcost", middleware.isLoggedIn ,async function(req,res){
        const cost = await Fixed.find(function(ting){
            return ting;
        })
        var earn;
        if(req.body.currency === "USD"){
            earn = await Convert(req.body.earning).from("USD").to("INR");
            earn = Math.round(earn);
        } else {
            earn = req.body.earning;
        }
        var fix = {rent: req.body.rent, officeboy: req.body.officeboy, guard: req.body.guard, generator: req.body.generator, maid: req.body.maid, elecfix: req.body.elecfix, elecran: req.body.elecran, diesel:req.body.diesel, tead:req.body.tead, tean:req.body.tean, dsl:req.body.dsl, emails:req.body.emails, fkref:req.body.fkref, traffic:req.body.traffic, hosting:req.body.hosting, domains:req.body.domains, misl:req.body.misl, salary:req.body.salary, earning:earn }
        Fixed.findOneAndUpdate(cost, fix, function(){});
        req.flash("success","Edited FixedCost, Displaying New Analysis")
        res.redirect("/accounts");
    });

    // Account Transactions

    router.get("/accounts/transactions", middleware.isLoggedIn ,async function(req,res){
        var transa = await Trans.find({date: {$regex: "\/"+ moment().utc().add(5, 'hours').add(30,'m').format("MM") +"\/"+ moment().utc().add(5, 'hours').add(30,'m').format("YYYY")}},function(work){
            return work;
        })
    
        res.render("accounts/transactions",{transa});
    });

    // Transactions Post Routes

    router.post("/accounts/transactions", middleware.isLoggedIn, async function(req,res){
        var datime    = moment().utc().add(5, 'hours').add(30,'m').format("DD/MM/YYYY");
        var even,con,ama,solid;
        var tipu, acc;
        if(req.body.event === "Others"){
            even = req.body.other;
        } else {
            even = req.body.event;
        }
        if(req.body.currency === "USD"){
            con = await Convert(req.body.amount).from("USD").to("INR");
            con = con.toFixed(2);
        } else {
            con = req.body.amount;
        }
        ama = con;
        solid  = {event: even, amount: ama, transtype: req.body.type, account: req.body.account ,date: datime, notes:req.body.notes}; 
        
        Trans.create(solid, function(err){
            if(err) {
                console.log("Problem Adding Transaction")
                } else {
                console.log("Transaction Added")
                }
            });
            if(req.body.sent !== "Direct"){ 

            if(req.body.type === "Debit"){
                tipu = "Credit"
            } else {
                tipu = "Debit"
            }

            acc = req.body.sent;

            solid  = {event: even, amount: ama, transtype: tipu, account: req.body.sent ,date: datime, notes:req.body.notes}; 
            
            Trans.create(solid, function(err){
                if(err) {
                    console.log("Problem Adding Transaction")
                    } else {
                    console.log("Double Transaction Added")
                    }
                });

        }
        req.flash("success","Transaction Added");
        res.redirect("back");
    })

    // Query Transactions

    router.get("/accounts/pnl", middleware.isLoggedIn ,async function(req,res){
        var transa = await Trans.find({date: {$regex: "\/"+ moment().utc().add(5, 'hours').add(30,'m').format("MM") +"\/"+ moment().utc().add(5, 'hours').add(30,'m').format("YYYY")}},function(work){
            return work;
        })
    
        res.render("accounts/profitandloss",{transa});
    });

    router.post("/accounts/bymonth", middleware.isLoggedIn ,async function(req,res){
        let month = req.body.month;
        let year = req.body.year;
        var transa = await Trans.find({date: {$regex: "\/"+ month +"\/"+ year }},function(work){
            return work;
        })
    
        res.render("accounts/query",{transa});
    });

    router.post("/accounts/byyear", middleware.isLoggedIn ,async function(req,res){
        let year = req.body.year;
        var transa = await Trans.find({date: {$regex: year }},function(work){
            return work;
        })
    
        res.render("accounts/query",{transa});
    });

    router.post("/accounts/byaccount", middleware.isLoggedIn ,async function(req,res){
        let acc = req.body.account;
        var transa = await Trans.find({account: acc},function(work){
            return work;
        })
    
        res.render("accounts/query",{transa});
    });

    // Edit Transaction
    router.get("/accounts/edit/:id", middleware.isLoggedIn,async function(req,res){
        var transa = await Trans.findById(req.params.id,function(work){
            return work;
        })
        var id = req.params.id;
        res.render("accounts/edit", {transa,id});
    });

    // Post Route Transaction

    router.put("/accounts/edit/:id", middleware.isLoggedIn ,async function(req,res){
        var datime    = moment().utc().add(5, 'hours').add(30,'m').format("DD/MM/YYYY");
        var even,con,solid;
        if(req.body.event === "Others"){
            even = req.body.other;
        } else {
            even = req.body.event;
        }
        if(req.body.currency === "USD"){
            con = await Convert(req.body.amount).from("USD").to("INR");
        } else {
            con = req.body.amount;
        }
        solid  = {event: even, amount: con, transtype: req.body.type, account: req.body.account ,date: datime, notes:req.body.notes}; 
        
        Trans.findByIdAndUpdate(req.params.id,solid,function(err,work){
            if(err){
                console.log("Problem Editing Transaction");
            }
            else{
                console.log("Edited Transaction")
            }
        })
        req.flash("success","Transaction Edited")
        res.redirect("/accounts/transactions");
    });

    router.delete("/accounts/delete/:id", function(req, res){
        Trans.findById(req.params.id, function(err, offrm){
            if(err){
                console.log(err);
            } else {
                offrm.remove();
                req.flash("success","Transaction Deleted")
                res.redirect("back");
            }
        });
        
     });

module.exports = router;
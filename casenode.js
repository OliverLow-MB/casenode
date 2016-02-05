/*
Case Node node.js application file
(c)2016 O Low
VERSION 0.1
REVISION History
v0.1 12/2/2016 - incept (previously cnstart.ts)
*/

//use express 
var express=require("express");
var app=express();

//set some global header responses
app.use(function(req,res,next){
	res.setHeader("X-powered-by", "Farts"); //without this, or app.disable('x-powered'by'), we will get "Express"
	next();
});

/* GLOBAL MIDDLE WARE
*/

//user-agent test
app.use( function(req,res,next){
	//log the user-agent
	/*DEBUG*console.log("Request from: " + req.headers['user-agent']);/**/
	next();
});

/*** DEVELOPMENT setting **********
Static service for main directory
*/
app.use(express.static("."));


/* ROUTERS
/user/
/user/{username}/ 
	user interface for this user. 
	User must log on
/db
	database queries
*/
//user
var userRouter = require("./userRouter.js");
app.use("/user", userRouter);
//db
var dbRouter = require("./dbRouter.js");
app.use("/db", dbRouter)


//default behaviour
app.get("/", function(req,res){
	res.send("CaseNode");

});

//run service
app.listen(8080, function(){
	console.log(
" _____                _   _           _      \n"+
"/  __ \\              | \\ | |         | |     \n"+
"| /  \\/ __ _ ___  ___|  \\| | ___   __| | ___ \n"+
"| |    / _  / __|/ _ \\     |/ _ \\ / _  |/ _ \\\n"+
"| \\__/\\ (_| \\__ \\  __/ |\\  | (_) | (_| |  __/\n"+
" \\____/\\__,_|___/\\___\\_| \\_/\\___/ \\__,_|\\___|\n"+
"   CaseNode GANGSTA edition running... press ctrl-c to break.\n"+
"-------------------------------------------------------------");
});

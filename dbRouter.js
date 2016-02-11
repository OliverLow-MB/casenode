/*
dbRouter.js
CaseNode user node.js express router for route /db
This is the main handler for database interactions
VERSION: 0.1
Revision history:
v 0.1 - 12 Jan 2016 incept
*/
var express=require("express"); //Express app base
var bodyParser=require("body-parser"); //middleware for parsing POST requests
var router=express.Router(); //this router (/db)
var OrientDB=require("orientjs"); //Orient DB API

//middleware to log date
router.use(function(req, res, next){
	//log the request with the date (from contructor function)
	console.log("CaseNode dbRouter " + req.originalUrl + " " + new Date().toLocaleDateString());
	next();
});

//middleware to parse POST requests
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// default GET route = bad request
router.get("/", function(req, res) {
	res.status(400).send("This is the database service - you shouldn't be here!");
});

//
router.post("/", function(req, res) {
	//where is this coming from? 
	res.write(JSON.stringify(req.body));
	res.end();
});

//connection to database
function DBConn(){
	var dbO = OrientDB({host: "localhost",port: 2424,username: "root",password: "r00tbiskit"});
	var db = dbO.use( { name: 'cn1' , username: 'admin' , password: 'admin' } );
	return db;
}

//addPerson
router.post("/addPerson", function(req,res){
	//validate input
	
	//connect to the database
	var db=DBConn();
	//add the person
	db.insert().into('person').set(req.body.person).one()
		.then( function(result){ //ok
			res.status(201).end(JSON.stringify(result))
		}, function(err){ //err
			res.status(500).end("didn't work" + JSON.stringify(err));
		}
	);
	// CLOSE THE CONNECTION AT THE END
	db.close();
});

//updatePerson
router.post("/updatePerson", function(req,res){
	//validate input
	/* expects 
	body:{
		person: personObj
	}
	*/
	if (req.body.person){
		//connect to the database
		var db=DBConn();
		//update the person - NB need to strip the @rid from the object or OrientDB will throw an error
		var sRID=req.body.person['@rid'];// remember the record ID
		delete req.body.person['@rid']; //remove it fro the object or OrientDB will reject 
		db.update('person').set(req.body.person)
			.where({'@rid':sRID}).one()
			.then( function(result){ //ok
				res.status(200).end(JSON.stringify(result))
			}, function(err){ //err
				res.status(500).end("didn't work" + JSON.stringify(err));
			}
		);
		// CLOSE THE CONNECTION AT THE END
		db.close();
	} else {
		res.status(400).end("You must POST a person object");
	}
});

//storeMatter
router.post("/storeMatter", function(req,res){
	//validate input
	/* expects:
	body: {
		person:{@rid: person.@rid}
		caseDetails:{}
	}
	*/
	var db=DBConn();
	//add or update?
	//if we've got an ID, then update existing, else add new
	if (req.body.caseDetails['@rid']){
		//transfer @rid from input to where var
		var sRID=req.body.caseDetails['@rid'];
		delete req.body.caseDetails['@rid'];
		db.update('matter').set(req.body.caseDetails)
			.where({'@rid':sRID}).one()
			.then( function (result){ //ok
				//return the number of updates, i.e. '1'
				res.status(200).end(JSON.stringify(result))
			}, function(err){//err
				res.status(500).end("didn't work" + JSON.stringify(err));			
			}
		);
		db.close();
	} else { // no @rid so add a new record
		db.create('VERTEX', 'matter').set(req.body.caseDetails).one()
			.then( function(result){ //ok
				res.status(201).end(JSON.stringify(result))
			}, function(err){ //err
				res.status(500).end("didn't work" + JSON.stringify(err));
			}
		);
		db.close();
	}
}
);

//storeDocument
router.post("/storeDocument", function(req,res){
	//validate input
	/* expects:
	body: {
		docObj:{@rid: }
		caseObj: {@rid: }		
	}
	*/
	var db=DBConn();
	//add or update?
	//if we've got an ID, then update existing, else add new
	if (req.body.docObj['@rid']){
		//transfer @rid from input to where var
		var sRID=req.body.docObj['@rid'];
		delete req.body.docObj['@rid'];
		db.update('doc').set(req.body.docObj)
			.where({'@rid':sRID})
			.one()
			.then( function (result){ //ok
				//return the number of updates, i.e. '1'
				res.status(200).end(JSON.stringify(result))
			}, function(err){//err
				res.status(500).end("didn't work" + JSON.stringify(err));			
			}
		);
		db.close();
	} else { // no @rid so add a new record
		db.create('VERTEX', 'doc').set(req.body.docObj).one()
			.then( function(result){ //ok
				//If we've got a link to a case, add that now. 
				console.log("typeof caseObj is " + typeof casObj);
				if( (typeof req.body.caseObj != 'undefined') && req.body.caseObj['@rid']){
					db.create('EGDE','filedIn')
					.from(result['@rid'])/*the newly inserted doc*/
					.to(req.body.caseObj['@rid'])/*the specified case*/
					.one()
					.then( function(result){//ok
						res.end(JSON.stringify(result))
					}, function (err){//not ok
						
					})
				}
				res.status(201).end(JSON.stringify(result))
			}, function(err){ //err
				res.status(500).end("didn't work" + JSON.stringify(err));
			}
		);
		db.close();
	}

});//storeDocument


//storeInfo
//stores a single info, either new or updating, and optionally links to a matter
router.post("/storeInfo", function(req,res){
	//validate input
	/*Expects:
	body:{
		infoObj{}  - an info object
		caseRID - the record ID of the case to attach it to.
	}
	*/
	if (req.body.infoObj){
		//either add or update 
		/*
		either : add info, create edge, return info
		or: update info, create edge, return success
		
		*/
		var infoRID = req.body.infoObj['@rid']; //possible undefined, that's ok.
		//set the query according to whether we have
		
		
		
		
		//the RID of the info is either the one we were given, or a the result from the CREATE
	} else { //no req.body.infoObj
		res.status(400).end("Must provide infoObj to store");
	}

});//storeInfo

//storeEnquiry
router.post("/storeEnquiry", function(req,res){
	//validate input
	
});

//fetchMatters
router.post("/fetchMattersByResponsible", function(req,res){
	//validate input
	/* expects a userID of the responsible person
	responsible:
	*/
	var db=DBConn();
	
//select *, in_filedIn.out as docRIDs, in_client.out as clientRIDs, in_info.out as infoRIDs, in_party.out as partyRIDs from matter	

	db.select("*, in_filedIn.out as docRIDs, in_client.out as clientRIDs, in_informs.out as infoRIDs, in_party.out as partyRIDs").from('matter').all()
		.then( function(result){//ok
			res.status(200).end(JSON.stringify(result));
		}, function(err){//not ok
			res.status(500).end("error: " + JSON.stringify(err));
		});
	db.close();
	
});



//fetchRecordsByID
router.post("/fetchRecordsByID", function(req,res){
	//validate input
	/* expects an array (JSON) of recordIDs to fetch
		{RIDs:['#13:12','#13:14']}
	*/
	if (req.body.RIDs) {
		//format the list of IDs into a single array-like string for OrientDB, e.g. ['#13:1', '#13:2'] => "[#13:1,#13:2]"
		var sRIDs = "[" + req.body.RIDs.join(",") + "]";
		var db=DBConn();
		db.select().from(sRIDs).all()
			.then( function(result){//ok
				res.status(200).end(JSON.stringify(result));
			}, function(err){//not ok
				res.status(500).end("error: " + JSON.stringify(err));
			});
		db.close();
	} else { //invalid input, reject request
		res.status(400).end("Must supply a JSON array of record IDs to fetch.");
	}
});

//fetchRecordsByEdge
router.post("/fetchRecordsByEdge", function(req,res){
	//validate input
	/* expects an object
		sDirection: "in" or "out" - the record the edges go IN to, or the records the edges come OUT from
		RIDs: Array["#17:1", "#17:5", "#17:16", etc...] or Edge records IDs
	*/
	if (req.body.sDirection == "in" || req.body.sDirection == "out") {
		//format the list of IDs into a single array-like string for OrientDB, e.g. ['#13:1', '#13:2'] => "[#13:1,#13:2]"
		var sRIDs = "[" + req.body.RIDs.join(",") + "]";
		// what are we going to select form the database? 
		var db=DBConn();
		db.select("expand(" + req.body.sDirection + ")").from(sRIDs).all()
			.then( function(result){//ok
				res.status(200).end(JSON.stringify(result));
			}, function(err){//not ok
				res.status(500).end("error: " + JSON.stringify(err));
			});
		db.close();
	} else { //sDirection no correctly specified
		res.status(400).end("Must specify sDirection = \"in\" or \"out\"")
		
	}
});


//fetchAddressByPersonID - fetches all the addresses linked to that person
router.post("/fetchAddressByPersonID", function(req,res){
	//validate input
	/* expects an array (JSON) of person recordIDs 
		{RIDs:['#13:12','#13:14']}
	*/
	if (req.body.RIDs) {
		//format the list of IDs into a single array-like string for OrientDB, e.g. ['#13:1', '#13:2'] => "[#13:1,#13:2]"
		var sRIDs = "[" + req.body.RIDs.join(",") + "]";
		var db=DBConn();
		//... select *, in.* as person_, out.* as address_ from addressFor 
		db.query("SELECT out AS @rid," + 
			" out.line1 AS line1, out.line2 AS line2, out.line3 AS line3, out.line4 AS line4, out.line5 AS line5, out.postcode AS postcode, out.ISOcountrycode AS ISOcountrycode " +
			"FROM addressFor WHERE in IN " + sRIDs).all()
			.then( function(result){//ok
				res.status(200).end(JSON.stringify(result));
			}, function(err){//not ok
				res.status(500).end("error: " + JSON.stringify(err));
			});
		db.close();
	} else { //invalid input, reject request
		res.status(400).end("Must supply a JSON array of record IDs to fetch.");
	}
});

//fetchAllByUser
//fetches all the records needed for the UI for this user

router.post("/fetchAllByUser", function(req,res){
	//validate POST input
	/* expect a single parameter: {userID: userID}
	*/
	if (req.body.userID){

		var dbResults = {};
		var dbCollector = function(){
			this.data={};
			this.collateMatters = function(result){ //pass the query result
				/*expecting possibly non-existent arrays of recordID in_filedIn, in_party, in_client, in_informs */
				//attach the result datat to the matters property
				data['matters']=result;
				
				//flag matters as collated
			}//this.collateMatters
		}; 
		var db = DBConn(); //database connection

		//pull all the matter vertices for this user
		/*select from matter*/
		db.select()
		.from("matter")
		/*.where(... however we select by user)*/
		.one()
		.then( function(result){
			dbResults['matter'] = result;
			//collect all the filedIn edge record IDs
			/*DEBUG*/console.log(JSON.stringify(result['in_filedIn']));
			/*
			for some reason, result[0]['in_filedIn'] does not seem to be an array...
			*/
			console.log(result['in_filedIn']);
			
			//try another query on the same connection
			db.select()
			.from(result['in_filedIn'])//.from won't accept an array, it must be a string
			.all()
			.then( function(result){
				dbResults['filedIn'] = result;
				res.status(200).end(JSON.stringify(dbResults));
			}, function(err){
				res.status(500).end(JSON.stringify(err));
			}
			);
			
		}, function(err){
			//if error, just return the error
			res.status(500).end(JSON.stringify(err));
		}); //db
		
		//collate the edges: filedIn, client, party, informs
		
		//collect all the client edges
		
		//from the client edges, get the list of person vertices
		
		//get the person vertices
		
		//from the person vertices, get all the addressFor edges
		
		//from the party edges, get all the person vertices 
		// - NB we have already got some of these, and some of them are bound to be the same. We only want to give return unique ones
		
	} else {
		res.status(404).end("No userID POSTed.")
	}
});

////////////////////////////////////////
// utility functions
//

//colligate - 
function colligate(results, sKey){
	
}

//testing function
router.post("/test", function(req,res){
	//connect to the database
	var db=DBConn();
	//return what we were POSTed
	res.end(JSON.stringify(req.body));
	// CLOSE THE CONNECTION AT THE END
	db.close();
	//res.end(" ... closed.");
});

//export the module for the main app to use
module.exports=router;
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
	/*expects {enquiryObj:{timestamp, caseFields}}*/
	//validate input
	if (req.body.enquiryObj
		&& req.body.enquiryObj.caseFields
		&& req.body.enquiryObj.caseFields.caseDetails
		&& req.body.enquiryObj.caseFields.documents
		){
		var db=DBConn();
		//store the matter details caseFields.caseDetails
		db.create('VERTEX', 'matter').set(req.body.enquiryObj.caseFields.caseDetails).one()
			.then( function(result){ //ok
				
				//store the document
				/*DEBUG/console.log(result);/**/
				var matterRID= result['@rid'].toJSON(); //this will be the record ID as a string
				console.log("storeEnquiry: created matter " + matterRID);
				db.create('VERTEX', 'doc').set(req.body.enquiryObj.caseFields.documents[0]).one()
				.then( function(result){ //ok
					var docRID=result['@rid'].toJSON(); //store RID for linking edges
					console.log("storeEnquiry: created doc " + docRID);
					
					//link the document to the matter
					db.create('EDGE','filedIn').from(docRID).to(matterRID).one()
					.then( function(result){
						
						//store the person
						//separate the address, if any
						var addressObj;
						if (req.body.enquiryObj.caseFields.clients[0].person.addresses){
							addressObj = req.body.enquiryObj.caseFields.clients[0].person.addresses[0];
							delete req.body.enquiryObj.caseFields.clients[0].person.addresses;
						}
						db.create("VERTEX","person").set(req.body.enquiryObj.caseFields.clients[0].person).one()
						.then(function(result){
							var personRID=result['@rid'].toJSON();//a string of the recordIDs
							console.log("storeEnquiry: created person " + personRID);

							//link the person as client and as a contact
							db.create('EDGE','client').from(personRID).to(matterRID).one()
							.then( function(result){
								db.create('EDGE','party').from(personRID).to(matterRID).set({role:"Client"}).one()
								.then( function(result){

										res.status(200).end("{'result':'OK'}");

								}, function (err) {res.status(500).end(JSON.stringify(err))})
							}, function (err) {res.status(500).end(JSON.stringify(err))})
						}, function (err) {res.status(500).end(JSON.stringify(err))})
					}, function (err) {res.status(500).end(JSON.stringify(err))})
				}, function (err) {res.status(500).end(JSON.stringify(err))})
			}, function(err){ res.status(500).end(JSON.stringify(err))})
			;
		
		db.close();
	} else {
		res.status(400).end("Invalid enquiryObj supplied.")
	}
	
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
		
		//dbCollector used to collect the results as they come in and send the final result when we've got everything.
		var dbCollector = new function(res){
			
			this.data={}; //holds the data as we colelct it
			
			//track what we've got so far
			this.got={matter:false, filedIn:false, doc: false, person: false, addressFor: false, address: false, party: false, informs: false, info: false };
			
			//collate 
			this.collate = function(classname, result){ //pass the query result
				/*expecting possibly non-existent arrays of recordID in_filedIn, in_party, in_client, in_informs */
				//attach the result data to the matters property
				data['matter']=result;
				
				//flag matters as collated
				this.got.matter = true;
			}//this.collateMatters
			
			//getRIDsNeeded - returns an array of the record IDs of a certain type, e.g. filedIn, that are needed to complete the current data set
			this.getRIDsNeeded = function(classname){
				
			}
		}(res);//pass our current http response object to end with
		
		var db = DBConn(); //database connection

		//pull all the matter vertices for this user
		/*select from matter*/
		db.select()
		.from("matter")
		/*.where(... however we select by user)*/
		.all()
		.then( function(result){
			dbResults['matter'] = result;


			//query for all the filedIn edges
			/*DEBUG/console.log("query filedIn");/**/
			db.select()
			.from("[" + getRIDs(dbResults['matter'], "in_filedIn").join(",") + "]") //.from needs a string, not an array
			.all()
			.then( function(result){

			//next get all client edges
				dbResults['filedIn'] = result;
				/*DEBUG/console.log("query filedIn");/**/
				db.select().from("[" + getRIDs(dbResults['matter'], "in_client").join(",") + "]").all()
				.then (function(result){
					//collect the client edges
					dbResults["client"] = result;

					//next get all the party edges
					/*DEBUG/console.log("query client");/**/
					db.select().from("[" + getRIDs(dbResults['matter'], "in_party").join(",") + "]").all()
					.then (function(result){
						//collect the party edges
						dbResults["party"] = result;

						//next get the informs edges
						/*DEBUG/console.log("query informs");/**/
						db.select("*, out as out").from("[" + getRIDs(dbResults['matter'], "in_informs").join(",") + "]").all()
						.then (function(result){
							//collect the informs edges
							dbResults["informs"] = result;
							/*SEND/res.status(200).end(JSON.stringify(dbResults));/**/
							//that's it for the first run through, now we go on to the second level vertices

							//next, get the doc vertices
							/*DEBUG/console.log("query docs");/**/
							db.select().from("[" + getRIDs(dbResults['filedIn'], "out").join(",") + "]").all()
							.then (function(result){
								//collect the docs
								dbResults["doc"] = result;

								//next get the person records - they come from client OR party
								db.select().from("[" + 
									collate( [getRIDs(dbResults['client'], "out") , getRIDs(dbResults['party'], "out")] )
									.join(",") + "]").all()
								.then( function(result) {
									dbResults['person']=result;
									
									//next, get info vertices, from informs edges
									db.select().from("[" + getRIDs(dbResults['informs'], "out").join(",") + "]").all()
									.then( function(result){
										dbResults['info']=result;
										
										//next, get addressFor edges from person vertices
										db.select().from("[" + getRIDs(dbResults['person'], "in_addressFor").join(",") + "]").all()
										.then( function(result){
											dbResults['addressFor']=result;
											
											//finally, get the address records from the addressFor edges
											db.select().from("[" + getRIDs(dbResults['addressFor'], "out").join(",") + "]").all()
											.then(function(result){
												//send the results!!! yay
												res.status(200).end(JSON.stringify(dbResults));
											}, function(err){res.status(500).end(JSON.stringify(result))})
										}, function(err){res.status(500).end(JSON.stringify(result))})
									}, function(err){res.status(500).end(JSON.stringify(result))})
								}, function(err){res.status(500).end(JSON.stringify(result))})
							}, function(err){res.status(500).end(JSON.stringify(result))})
						}, function(err){res.status(500).end(JSON.stringify(result))})
					}, function(err){res.status(500).end(JSON.stringify(result))})
				}, function(err){res.status(500).end(JSON.stringify(result))})
			}, function(err){res.status(500).end(JSON.stringify(result))})
		}, function(err){
			//if error, just return the error
			res.status(500).end(JSON.stringify(err));
		})
		;//end of db query
		
	} else { //if valid input
		res.status(404).end("Invalid POST. Did you post a valid userID?")
	}
});


router.post("/logStuff", function(req, res){
	//connect the DB and log some stuff form it
	var db = DBConn();
	db.select().from('matter').one()
	.then(function(result){
		console.log("OK:\n");
		console.log(result.in_filedIn);
	}, function(err){
		console.log("ERROR:\n" + JSON.stringify(result));
	}
	);
	db.close();
});

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

//////////////////////////////////////////
// database functions
//


/* addMatter  - adds a new matter and returns its ID
expects: a matter object, the basic fields for a matter object, 
{title:  }
returns: {success:true|false, '@rid': recordID, err: error result}
*/
function addMatter(matterObj){
	//check input
	{
		var db=DBConn();
		db.create('VERTEX', 'matter').set(matterObj).one()
			.then( function(result){ //ok
				/*DEBUG*/console.log(result);/**/
				console.log("addMatter: created " + result['@rid'])
				return {success:true, '@rid': result['@rid']}
			}, function(err){ //err
				return {success:false, 'err': err}
			}
		);
		db.close();
	}
}

////////////////////////////////////////
// utility functions
//

//collating arrays
function collate(a){ // pass an array of arrays to collate into one array
    var h = { n: {}, s: {} };
    for (var i=0; i < a.length; i++) for (var j=0; j < a[i].length; j++) 
        (typeof a[i][j] === "number" ? h.n[a[i][j]] = true : h.s[a[i][j]] = true);
    var b = Object.keys(h.n);
    for (var i=0; i< b.length; i++) b[i]=Number(b[i]);
    return b.concat(Object.keys(h.s));
}

//getRIDs - makes the SQL query from the results of a previous one
function getRIDs(results, sKey) {
	/*exects results as query result an array or records, sKey name of a field in there, could be a RidBag type, could be a single*/
	var h = {};
	for (var i=0; i < results.length; i++) {
		//proceed if sKey is defined on this records
		if (results[i][sKey]){
			//identify results[i][sKey'] - is it a RidBag? 
			if (results[i][sKey].all) { // a RidBag will have the function all defined
				var a = results[i][sKey].all(); 
				//compile them
				for (var j=0; j < a.length; j++) h[a[j]] = true;
			} else {  // not a RidBag so assume it's the other kind that we get from an edge and we want toJSON which is defined in orientjs or its libs
				h[results[i][sKey].toJSON()]=true;
			}
		}
	}
	//return either our list, or undefined
	return Object.keys(h);
}


//export the module for the main app to use
module.exports=router;
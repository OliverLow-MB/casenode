/*
backend.js (OrientDB version)
default backend provider for CaseNode UI
communicates to RESTful web service - assumed to be the default node.js / OrientDB one
***MUST BE LOADED AFTER angular.js module called 'uiApp' has been defined. 
(c)2016 O Low
version: 0.1
revision:
v0.1 - 2016/01/28 - incept, code split off from ui1.js
*/


uiApp.provider("backend",function(){
	//set the service URL (can be changed from module config)
	this.serviceURL="http://localhost:8080";
	//methods exposed via $get for angular framework to pick up
	this.$get = function($http,$q){
		return {
			log: function(){
				console.log("backend. ");
			},
			
			//database test function
			test: function(data){
				$http.post("http://localhost:8080/db/test",data)
					.then( function(response){ //success callback
						console.log("DB request OK: " + JSON.stringify(response.data) );
					}, function(response){ //error callback
						console.log("broken" + JSON.stringify(response.data) );
					}
				);
			},
			storePerson: function(personObj, bForceInsertIdentical){
				var data={person: personObj};
				//if the person had a record ID, then update, else add
				if (personObj['@rid'] &&(!(bForceInsertIdentical===true))) {
					data['@rid']=personObj['@rid'];
					$http.post("http://localhost:8080/db/updatePerson",data)
						.then( function(response){ //success callback
							console.log("DB request OK: " + JSON.stringify(response.data) );
						}, function(response){ //error callback
							console.log("broken" + JSON.stringify(response.data) );
						}
					);
				} else { //no record ID, so add
					$http.post("http://localhost:8080/db/addPerson",data)
						.then( function(response){ //success callback
							//store the recordID
							personObj['@rid']=response.data["@rid"];
							console.log("DB request OK: " + JSON.stringify(response.data) );
						}, function(response){ //error callback
							console.log("broken" + JSON.stringify(response.data) );
						}
					);
				}
				console.log("storePerson: ");
			},
			
			//function to store a document
			//pass the document object to store, plus any objects you want it to be linked to
			// the objects it links to should already be stored
			storeDocument: function(docObj, linksObj){
				//set up the structure expected at the other end
				var data = {docObj: docObj, linksObj: linksObj};
				$http.post("http://localhost:8080/db/storeDocument",data)
				.then( function(response){ //success callback
					//store the recordID returned
					docObj['@rid']=response.data["@rid"];
					console.log("DB request OK: " + JSON.stringify(response.data) );
				}, function(response){
					//error callback
					console.log("broken: " + JSON.stringify(response.data));
				});
			},
			//storeMatter
			storeMatter: function(caseDetailsObj, personObj){
				var data = {
					'caseDetails': caseDetailsObj
				}
				//send the case to the database service
				$http.post("http://localhost:8080/db/storeMatter",data)
					.then( function(response){ //success callback
						//store the recordID returned
						caseDetailsObj['@rid']=response.data["@rid"];
						console.log("DB request OK: " + JSON.stringify(response.data) );
					}, function(response){
						//error callback
						console.log("broken: " + JSON.stringify(response.data));
					});
				console.log("storeMatter: ");
			},
			
			//function to store a new enquiry
			storeEnquiry: function(enqObj){
				//set up structure required at other end.
				var data={
					enqObj: enqObj
				}
				//send it
				$http.post("http://localhost:8080/db/storeMatter",data)
					.then( function(response){ //success callback
						//store the recordID returned
						enqObj['@rid']=response.data["@rid"];
						console.log("DB request OK: " + JSON.stringify(response.data) );
					}, function(response){
						//error callback
						console.log("DB request FAILED: " + JSON.stringify(response.data));
					});
				console.log("storeEnquiry: ");	
			},
			/* 
			populateCaseFieldsForUser
			populates the whole caseFields data set for the current user
			caseFieldsObj = the target object to receive the data
			userID 
			fOnComplete(err) = callback to call when complete
			*/
			populateCaseFieldsForUser: function(caseFieldsObj, userID, fOnComplete){
				
				
			},
			
			//fetchMatters - starting from the fee earner user, gets all cases.
			//params: obj - an object to which we'll attach a "recordSets" property - a set of maps of the database records
			fetchMatters: function(obj, fOnComplete){
				var data = {userID: "Nemo"};//the user ID we start the fetch from, i.e. all matters for that user
				var recordSets = {} ; //to be attached to the object passed
				$http.post("http://localhost:8080/db/fetchAllByUser", data)
				.then( function(res){//OK
					//build up recordSets (Maps) from the data
					for (var prop in res.data){
						if (res.data.hasOwnProperty(prop)){
							recordSets[prop] = mapByRID(res.data[prop])
						}
					}
		obr=res.data
					//assign recordSets to the object passed
					obj['recordSets']=recordSets;
					/*DEBUG*/console.log("recordSets:");
					
					//build up the data list 
					
					//for each matter
					for (var k of recordSets.matter.keys()) { 
						//get the current record for this case
						var cmr = recordSets.matter.get(k).record;
						//create the list entry, creating the list itself if required
						var n = (obj.list || (obj.list=[]) ).push(new TcaseFields) -1 ;//n is now the new index
						//create the caseDetails object
						console.log("compiling case: " + k + " - " + cmr.title + 
							" (" + (cmr.in_filedIn ? cmr.in_filedIn.length : "no") + " docs, " + 
							(cmr.in_informs ? cmr.in_informs.length : "no") + " infos)" 
							);
						obj.list[n]['type']='client';
						obj.list[n].caseDetails = cmr;
						//create the documents array - via docRIDs array (possibly missing). push each document record whose recordID in docRIDs onto the documents array
						//if (cmr.docRIDs) for (var i=0; i<cmr.docRIDs.length; i++) (this.list[n].documents || (this.list[n].documents=[])).push(this.recordSets.docMap.get(cmr.docRIDs[i]).record)
						if (cmr.in_filedIn) {
							//for each filedIn - push the doc record the filedIn points to
							for (var i = 0; i< cmr.in_filedIn.length; i++) 
								(obj.list[n].documents || (obj.list[n].documents=[])).push(
									recordSets.doc.get( recordSets.filedIn.get(cmr.in_filedIn[i]).record.out).record)
						}
						//create the info array
						if (cmr.in_informs) for (var i=0; i<cmr.in_informs.length; i++) {
							(obj.list[n].info || (obj.list[n].info=[])).push(
								obj.recordSets.info.get(recordSets.informs.get(cmr.in_informs[i]).record.out).record);
							//link the evidence source docs
						}	
						
						//create the clients array UNFINSHED
						if (cmr.in_client) for (var i=0; i<cmr.in_client.length; i++) {
							(obj.list[n].client || (obj.list[n].client=[])).push(
								obj.recordSets.person.get(recordSets.client.get(cmr.in_client[i]).record.out).record);
						}	
						
					} //for each case
					
					//call the callback
					fOnComplete();
				}, function (err){ // not OK
					console.log(err);
				})
				
			},
			OLDfetchMatters: function(obj, fOnComplete){
				//set up data structure
				// ** at the moment, it's ignored and we get everything
				var data = {name:"Bob"};
				var caseSet = []; // an intermediate array to hold the cases as we get them from the database
				//newData class keeps track of what records we have got so far and does something when we've got them all.
				var newData = new function(fDoneCallback){
					//recordSets collection of recordSets 
					this.recordSets = {};
					//got keeps track of what we've been given so far, even if empty
					this.got = {caseMap: false, docMap: false, personMap: false, infoMap: false, addressMap : false}
					//params: recordSet - a map of the records by ID, sSetName - the name of the set
					this.collate = function( sSetName, recordSet){
						//add the recordSet we've been given
						this.recordSets[sSetName] = recordSet;
						this.got[sSetName] = true;
						/*DEBUG*/console.log("Fetched " + this.recordSets[sSetName].size + " " + sSetName + " records." );
						//if we've got all the things we're looking for, then process them
						if (this.got.caseMap && this.got.personMap && this.got.docMap && this.got.infoMap && this.got.addressMap) {
							obj['recordSets']=newData.recordSets;
							fOnComplete();
						} //if not got them all do nothing
					}
				};
				//send it
				$http.post("http://localhost:8080/db/fetchMattersByResponsible", data)
					.then( function(response){ //success callback
						//response data should be a JSON array of case records
						caseSet=response.data; 
						newData.collate('caseMap', mapByRID(response.data));
						//now we can look at the cases we've got, and (async) fetch other records by looking at the edge links
						//find out what doc records we need. 
						data = {RIDs: identifyDocsNeeded(caseSet)}; // a new object of the required form	
						$http.post("http://localhost:8080/db/fetchRecordsByID", data)
							.then( function(response){ //ok
								newData.collate("docMap", mapByRID(response.data));
							}, function(response){ //not ok
								console.log("Doc request FAILED: " + JSON.stringify(response.data));								
							});
						//go on to find out what person records we need. 
						data = {RIDs: identifyPeopleNeeded(caseSet)}; // a new object of the required form
						$http.post("http://localhost:8080/db/fetchRecordsByID", data)
							.then( function(response){ //ok
								newData.collate('personMap', mapByRID(response.data));
							}, function(response){ //not ok
								console.log("Person request FAILED: " + JSON.stringify(response.data));								
							});
						//find the address records for the same people USING THE SAME data as above
						$http.post("http://localhost:8080/db/fetchAddressByPersonID", data) 
							.then( function(response){ //ok
								newData.collate('addressMap', mapByRID(response.data));
							}, function(response){ //not ok
								console.log("Address request FAILED: " + JSON.stringify(response.data));								
							});
						//go on to find out what info records we need. 
						data = {RIDs: identifyInfoNeeded(caseSet)}; // a new object of the required form
						$http.post("http://localhost:8080/db/fetchRecordsByID", data)
							.then( function(response){ //ok
								newData.collate('infoMap',mapByRID(response.data));
							}, function(response){ //not ok
								console.log("Info request FAILED: " + JSON.stringify(response.data));								
							});
					}, function(response){
						//error callback
						console.log("Case request FAILED: " + JSON.stringify(response.data));
					});
				console.log("fetchMatters: ");	
			}
		}
	}
});

//function mapByRID - creates and returns a Map keyed by '@rid' from an array where '@rid' is a property of each object in the array
function mapByRID (a){
	var m = new Map(); //to be returned
	for (var i=0; i<a.length; m.set(a[i]['@rid'],{fetched: new Date(), record: a[i++]}));
	return m;
}

//

//identifyDocsNeeded - looks at a caseSet.docRIDs and identifies all the doc records we need to retrieve for those cases
function identifyDocsNeeded(caseSet){
	//caseSet is an array, for each case record object, in_filedIn is an array of strings with the recordID of an Edge leading to a document
	var uniqueEdges = new Map(); //used to collect unique doc IDs in it's keys
	var docEdges = new Array(); //the array of unique edges we will return
	//for every doc listed in every case, store that record ID
	for (i=0; i<caseSet.length; i++) {
		//if this case has any docs...
		if (caseSet[i].hasOwnProperty("docRIDs")) {
			for (j=0; j<caseSet[i].docRIDs.length; j++) {
				uniqueEdges.set([caseSet[i].docRIDs[j]] , true);
			}
		}
	}
	//convert the keys of uniqueEdges into the values of a regular array
	for (s of uniqueEdges.keys()) docEdges.push(s);
	console.log("identified " + uniqueEdges.size + " unique doc edges. ");
	return docEdges;
}

//identifyPeopleNeeded - looks at a caseSet.personRIDs and identifies all the person records we need to retrieve for those cases
//people can be clients or parties or maybe something else
function identifyPeopleNeeded(caseSet){
	//caseSet is an array, for each case record object, in_filedIn is an array of strings with the recordID of an Edge leading to a document
	var uniqueEdges = new Map(); //used to collect unique doc IDs in it's keys
	var personEdges = new Array(); //the array of unique edges we will return
	//for every doc listed in every case, store that record ID
	for (i=0; i<caseSet.length; i++) {
		//if this case has any clients... (it should have!!!)
		if (caseSet[i].hasOwnProperty("clientRIDs")) {
			for (j=0; j<caseSet[i].clientRIDs.length; j++) {
				uniqueEdges.set([caseSet[i].clientRIDs[j]] , true);
			}
		}
		//if this case has any other parties... 
		if (caseSet[i].hasOwnProperty("partyRIDs")) {
			for (j=0; j<caseSet[i].partyRIDs.length; j++) {
				uniqueEdges.set([caseSet[i].partyRIDs[j]] , true);
			}
		}
	}
	//convert the keys of uniqueEdges into the values of a regular array
	for (s of uniqueEdges.keys()) personEdges.push(s);
	console.log("identified " + uniqueEdges.size + " unique person edges. ");
	return personEdges;
}

//identifyInfoNeeded - looks at a caseSet.infoRIDs and identifies all the info records we need to retrieve for those cases
function identifyInfoNeeded(caseSet){
	//caseSet is an array, for each case record object, in_filedIn is an array of strings with the recordID of an Edge leading to a document
	var uniqueEdges = new Map(); //used to collect unique doc IDs in it's keys
	var infoEdges = new Array(); //the array of unique edges we will return
	//for every doc listed in every case, store that record ID
	for (i=0; i<caseSet.length; i++) {
		//if this case has any clients... (it should have!!!)
		if (caseSet[i].hasOwnProperty("infoRIDs")) {
			for (j=0; j<caseSet[i].infoRIDs.length; j++) {
				uniqueEdges.set([caseSet[i].infoRIDs[j]] , true);
			}
		}
	}
	//convert the keys of uniqueEdges into the values of a regular array
	for (s of uniqueEdges.keys()) infoEdges.push(s);
	console.log("identified " + uniqueEdges.size + " unique info edges. ");
	return infoEdges;
}

/*
What do we want to do?

User interface:
*Save an enquiry, automatically or finally

Store person (get personID OR existing)
Store caseDetails
Store attendance note
link attendance note to case
link person to case as client


*take instructions on a case
update caseDetails to be a client matter
store instructions document
link document to case

*edit a person record

store updated details


*Edit and save the details of a case


*Drag a document onto a case
add the document
link it to the case


*Create an info linked to source document. 

*get a set of caseFields
select from case where this fee earner
select from document where isFiledIn  any of these cases
select from person where isClient in any of these cases
get addresses for person
get linked info

case.documents.push(each document)


*/








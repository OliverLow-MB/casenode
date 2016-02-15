var a = [ [1,2,3], [3,4,5], [1,5,6] ], h={};
for (var i=0; i < a.length; i++) for (var j=0; j < a[i].length; j++) h[a[i][j]] = true;
Object.keys(h);


a = [ [1,2,3], [3,4,5], [1,"5",6], ["spoon", "fork"] ], h = {};
for (i=0; i < a.length; i++) for (var j=0; j < a[i].length; j++) h[a[i][j]] = typeof a[i][j] === "number";
for (i=0, b=Object.keys(h); i< b.length; i++) if (h[b[i]]) b[i]=Number(b[i])
b;


a = [ [1,2,3], [3,4,5], [1,5,6], ["spoon", "fork", "5", {name: "bob", age:57}] ], h = { n:{}, s:{} } ;
collate = function(a){ //a an array of arrays to collate into one array
	var h = { n: {}, s: {} }; //a hash of all the array values, numbers separately
	//create properties of h using the array values as keys - repeated values just re-assign the same property
	for (var i=0; i < a.length; i++) for (var j=0; j < a[i].length; j++) (typeof a[i][j] === "number" ? h.n[a[i][j]] = true : h.s[a[i][j]] = true);
	//get the values that were numbers, and convert them back to numbers
	var b = Object.keys(h.n);
	for (var i=0; i< b.length; i++) b[i]=Number(b[i]);
	//tag on the values that weren't numbers and return
	return b.concat(Object.keys(h.s));
}


	for (var i=0; i < a.length; i++) for (var j=0; j < a[i].length; j++) h.n[a[i][j]] = true;

	
    h = new Map();
    for (i=0; i < a.length; i++) for (var j=0; j < a[i].length; j++) h.set(a[i][j]);

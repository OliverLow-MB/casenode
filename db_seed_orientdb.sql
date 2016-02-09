CREATE DATABASE

CREATE CLASS person EXTENDS V
CREATE PROPERTY person.firstname STRING
CREATE PROPERTY person.lastname STRING
CREATE PROPERTY person.title STRING
CREATE PROPERTY person.companyname STRING
CREATE PROPERTY person.legaltype STRING
CREATE PROPERTY person.name STRING
CREATE PROPERTY person.salutation STRING
CREATE PROPERTY person.contacts EMBEDDEDMAP STRING DEFAULT
CREATE INDEX ixContacts ON person (contacts BY VALUE) NOTUNIQUE

CREATE CLASS address EXTENDS V
CREATE PROPERTY address.line1 STRING
CREATE PROPERTY address.line2 STRING
CREATE PROPERTY address.line3 STRING
CREATE PROPERTY address.line4 STRING
CREATE PROPERTY address.line5 STRING
CREATE PROPERTY address.ISOcountrycode STRING
CREATE PROPERTY address.postcode STRING

CREATE CLASS doc EXTENDS V
CREATE PROPERTY doc.doctype STRING
CREATE PROPERTY doc.title STRING
CREATE PROPERTY doc.date DATE

CREATE CLASS matter EXTENDS V
CREATE PROPERTY case.title STRING

CREATE CLASS info EXTENDS V

CREATE CLASS enquiry EXTENDS V
CREATE PROPERTY enquiry.date DATE


CREATE VERTEX person CONTENT {name: "Barry Smith", title: "Mr", firstname:"Barry", lastname:"Smith", legaltype:"natural", salutation:"Mr Smith", contacts:{email:"barry.smith@example.com", mobile:"077nnn"}}
CREATE VERTEX person CONTENT {name: "Sir Patrick Moore", title: "Sir", firstname:"Patrick", lastname:"Moore", legaltype:"natural", salutation:"Mr Smith", contacts:{email:"sirpatrick@example.com", mobile:"077nn123n"}}
CREATE VERTEX person CONTENT {name: "King Charles II", title: "His Majesty", firstname:"Charles", lastname:"Stuart", legaltype:"natural", salutation:"Mr Smith", contacts:{email:"CharlesII@example.com"}}
CREATE VERTEX person CONTENT {name: "Moneylenders Limited", legaltype:"fictional", salutation:"Sirs", contacts:{email:"enquiries@moneylenders.example.com", phone:"0800 nnnnnn"}}
#13:9
#13:10
#13:11
#13:14

CREATE VERTEX address CONTENT {line1: "10, South Ridge", line2:"Berkamstone", line3:"Surrey", ISOcountrycode: "GB", postcode:"GU99 2BR"}
CREATE VERTEX address CONTENT {line1: "Skylight Hall", line2:"Dark Lane", line3:"Orionsville", line4:"Essex", ISOcountrycode: "GB", postcode:"CO89 2QQ"}
CREATE VERTEX address CONTENT {line1: "Buckingham Palace", line2:"London", ISOcountrycode: "GB", postcode:"SW1A 1AA"}
CREATE VERTEX address CONTENT {line1: "Office Block Nine", line2:"Industrial Park 3", line3:"Near the Airport", line4:"Dublin", ISOcountrycode: "IE", postcode:"D33 99"}
CREATE VERTEX address CONTENT {line1: "Office Block Four", line2:"Industrial Park 1", line3:"Near the Airport", line4:"Dublin", ISOcountrycode: "IE", postcode:"D33 96"}
#20:0
#20:1 
#20:2 
#20:3
#20:4

INSERT INTO doc (doctype, date, title) VALUES
(".pdf", "2016-01-05", "Letter from a friend"),
(".doc", "2015-07-08", "Application Notice"),
(".pdf", "2015-08-05", "Notice of change of solicitor"),
(".pdf", "2015-01-05", "Credit report"),
(".doc", "2014-01-05", "Power of attorney"),
(".pdf", "2016-01-09", "Letter from a creditors"),
(".msg", "2016-01-15", "Default notice")
CREATE VERTEX doc CONTENT {doctype: ".pdf", date: "2014-02-05", title: "Judgment order"}

#14:7
#14:8
#14:9
#14:10
#14:11
#14:12
#14:13
#14:21



INSERT INTO matter (title) VALUES
("Application to set aside CCJ v MoneyLenders"),
("Application to set aside CCJ v Big Bank"),
("Enduring power of attorney for children")

#12:3
#12:4
#12:5

CREATE VERTEX info CONTENT{label: "Claim number", value: "B00AA1234"}
#15:0

//EDGE naming natural language with 'is', so "filedIn" edge FROM doc TO case because the doc is "filedIn" that case.
//e.g. party FROM person TO case because that person IS a party to that case. 

CREATE CLASS client EXTENDS E
CREATE EDGE client FROM #13:9 TO #12:3
CREATE EDGE client FROM #13:10 TO #12:4
CREATE EDGE client FROM #13:11 TO #12:5


CREATE CLASS filedIn EXTENDS E
CREATE EDGE filedIn FROM #14:7 TO #12:3
CREATE EDGE filedIn FROM #14:8 TO #12:3
CREATE EDGE filedIn FROM #14:9 TO #12:3
CREATE EDGE filedIn FROM #14:10 TO #12:3
CREATE EDGE filedIn FROM #14:11 TO #12:5
CREATE EDGE filedIn FROM #14:12 TO #12:4
CREATE EDGE filedIn FROM #14:13 TO #12:4
CREATE EDGE filedIn FROM #14:21 TO #12:3


CREATE CLASS party EXTENDS E
CREATE PROPERTY party.role STRING
CREATE EDGE party FROM #13:9 TO #12:3 SET role="Client"
CREATE EDGE party FROM #13:10 TO #12:4 SET role="Client"
CREATE EDGE party FROM #13:11 TO #12:5 SET role="Client"
CREATE EDGE party FROM #13:14 TO #12:3 SET role="Other side"


CREATE CLASS addressFor EXTENDS E
CREATE PROPERTY addressFor.description STRING
CREATE PROPERTY addressFor.correspondence BOOLEAN

CREATE EDGE addressFor FROM #20:0 to #13:9 SET description="Residence"
CREATE EDGE addressFor FROM #20:1 to #13:10 SET description="Residence"
CREATE EDGE addressFor FROM #20:2 to #13:11 SET description="Residence"
CREATE EDGE addressFor FROM #20:3 to #13:14 
CREATE EDGE addressFor FROM #20:4 to #13:14 SET description="Registered office"
#21:0
#21:1
#21:2

CREATE CLASS evidenceSource EXTENDS E
CREATE EDGE evidenceSource FROM #15:0 TO #14:21

CREATE CLASS informs EXTENDS E
CREATE EDGE informs from #15:0 to #12:3





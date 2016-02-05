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


INSERT INTO person (title, firstname, lastname) VALUES
("Mr", "Barry", "Smith"),
("Mr", "Patrick", "Moore"),
("Mr", "Charles", "Stuart")

#13:9
#13:10
#13:11

CREATE VERTEX address CONTENT {line1: "10, South Ridge", line2:"Berkamstone", line3:"Surrey", ISOcountrycode: "GB", postcode:"GU99 2BR"}
CREATE VERTEX address CONTENT {line1: "Skylight Hall", line2:"Dark Lane", line3:"Orionsville", line4:"Essex", ISOcountrycode: "GB", postcode:"CO89 2QQ"}
CREATE VERTEX address CONTENT {line1: "Buckingham Palace", line2:"London", ISOcountrycode: "GB", postcode:"SW1A 1AA"}
#20:0
#20:1 
#20:2 


INSERT INTO doc (doctype, date, title) VALUES
(".pdf", "2016-01-05", "Letter from a friend"),
(".doc", "2015-07-08", "Application Notice"),
(".pdf", "2015-08-05", "Notice of change of solicitor"),
(".pdf", "2015-01-05", "Credit report"),
(".doc", "2014-01-05", "Power of attorney"),
(".pdf", "2016-01-09", "Letter from a creditors"),
(".msg", "2016-01-15", "Default notice")

#14:7
#14:8
#14:9
#14:10
#14:11
#14:12
#14:13



INSERT INTO case (title) VALUES
("Application to set aside CCJ v MoneyLenders"),
("Application to set aside CCJ v Big Bank"),
("Enduring power of attorney for children")

#12:3
#12:4
#12:5

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


CREATE CLASS party EXTENDS E
CREATE PROPERTY party.role STRING
CREATE EDGE party FROM #13:9 TO #12:3 SET role="Client"
CREATE EDGE party FROM #13:10 TO #12:4 SET role="Client"
CREATE EDGE party FROM #13:11 TO #12:5 SET role="Client"


CREATE CLASS addressFor EXTENDS E
CREATE PROPERTY addressFor.description STRING
CREATE PROPERTY addressFor.correspondence BOOLEAN

CREATE EDGE addressFor FROM #20:0 to #13:9 SET description="Residence"
CREATE EDGE addressFor FROM #20:1 to #13:10 SET description="Residence"
CREATE EDGE addressFor FROM #20:2 to #13:11 SET description="Residence"
#21:0
#21:1
#21:2


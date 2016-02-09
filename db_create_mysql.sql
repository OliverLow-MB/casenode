-- MySQL dump 10.13  Distrib 5.6.27, for Win64 (x86_64)
--
-- Host: localhost    Database: casenode
-- ------------------------------------------------------
-- Server version	5.6.27-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address` (
  `r_id` int(11) NOT NULL AUTO_INCREMENT,
  `address_id` varchar(45) NOT NULL,
  `postcode` varchar(45) DEFAULT NULL,
  `line1` varchar(45) DEFAULT NULL,
  `line2` varchar(45) DEFAULT NULL,
  `line3` varchar(45) DEFAULT NULL,
  `line4` varchar(45) DEFAULT NULL,
  `line5` varchar(45) DEFAULT NULL,
  `line6` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `iso_country_code` char(2) DEFAULT 'GB',
  PRIMARY KEY (`address_id`),
  UNIQUE KEY `r_id_UNIQUE` (`r_id`),
  UNIQUE KEY `address_id_UNIQUE` (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO address (line1, line2, line3, line4, line5, line6, postcode, country, iso_country_code) VALUES
("10, South Ridge", "Berkamstone",	"Surrey", 		NULL,		NULL,	NULL, "GU99 2BR", "UK", "GB"),
("Skylight Hall", 	"Dark Lane", 	"Orionsville", 	"Essex", 	NULL, 	NULL, "CO89 3ZZ", "UK", "GB"),
("Buckingham Palace","London", 		NULL,			NULL,		NULL,	NULL, "SW1A 1AA", "UK", "GB"),
("Office Block Nine", "Industrial Park 3", "Near the Airport", "Dublin", NULL, NULL, "D33 99", "REPUBLIC OF IRELAND", "IE"),
("Office Block Four", "Industrial Park 1", "Near the Airport", "Dublin", NULL, NULL, "D33 96", "REPUBLIC OF IRELAND", "IE")

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;

/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client` (
  `r_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'client entity\n',
  `client_id` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `person_id` varchar(45) DEFAULT NULL COMMENT 'person who is identically the client',
  `salutation` varchar(45) NOT NULL,
  `billing_address_id` varchar(45) NOT NULL,
  `correspondence_email_address` varchar(254) DEFAULT NULL COMMENT 'email address for correspondence',
  `alternate_email_address` varchar(45) DEFAULT NULL,
  `pays_VAT` tinyint(1) DEFAULT '1' COMMENT 'Whether to charge VAT to this client',
  `phone_main` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `rid_UNIQUE` (`r_id`),
  UNIQUE KEY `client_id_UNIQUE` (`client_id`),
  KEY `fk_client_address1_idx` (`billing_address_id`),
  CONSTRAINT `fk_client_address1` FOREIGN KEY (`billing_address_id`) REFERENCES `address` (`address_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client-person`
--

DROP TABLE IF EXISTS `client-person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client-person` (
  `r_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` varchar(45) NOT NULL,
  `person_id` varchar(45) NOT NULL,
  `auth_instructions` tinyint(1) DEFAULT NULL COMMENT 'Authorised to take instructions from this person',
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `r_id_UNIQUE` (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client-person`
--

LOCK TABLES `client-person` WRITE;
/*!40000 ALTER TABLE `client-person` DISABLE KEYS */;
/*!40000 ALTER TABLE `client-person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doc`
--

DROP TABLE IF EXISTS `doc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doc` (
  `r_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Record I.D.\nThe primary key',
  `doc_id` varchar(45) NOT NULL,
  `type` varchar(45) DEFAULT NULL,
  `draft` varchar(8) DEFAULT NULL COMMENT 'psudo enum\nTODO - not yet a draft\nDRAFT - draft document\nFINAL \nSIGNED\nSEALED\n',
  `filepath` varchar(45) DEFAULT NULL,
  `hash` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`doc_id`),
  UNIQUE KEY `iddocs_UNIQUE` (`r_id`),
  UNIQUE KEY `doc_id_UNIQUE` (`doc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doc`
--

LOCK TABLES `doc` WRITE;
/*!40000 ALTER TABLE `doc` DISABLE KEYS */;
INSERT INTO doc (doctype, date, title) VALUES
(".pdf", "2016-01-05", "Letter from a friend"),
(".doc", "2015-07-08", "Application Notice"),
(".pdf", "2015-08-05", "Notice of change of solicitor"),
(".pdf", "2015-01-05", "Credit report"),
(".doc", "2014-01-05", "Power of attorney"),
(".pdf", "2016-01-09", "Letter from a creditors"),
(".msg", "2016-01-15", "Default notice"),
(".pdf", "2014-02-05", "Judgment order")

/*!40000 ALTER TABLE `doc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doc_type`
--

DROP TABLE IF EXISTS `doc_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doc_type` (
  `r_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'type of document\nused for selecting templates\nused for workflow\nused for collation\n',
  `doc_type_id` varchar(45) NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`doc_type_id`),
  UNIQUE KEY `r_id_UNIQUE` (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doc_type`
--

LOCK TABLES `doc_type` WRITE;
/*!40000 ALTER TABLE `doc_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `doc_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doc_type-template`
--

DROP TABLE IF EXISTS `doc_type-template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doc_type-template` (
  `r_id` int(11) NOT NULL COMMENT 'doc_type-template\nlist of available templates for this doc type',
  `doc_type_id` varchar(45) DEFAULT NULL,
  `template_id` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doc_type-template`
--

LOCK TABLES `doc_type-template` WRITE;
/*!40000 ALTER TABLE `doc_type-template` DISABLE KEYS */;
/*!40000 ALTER TABLE `doc_type-template` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `enquiry`
--

DROP TABLE IF EXISTS `enquiry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enquiry` (
  `r_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'enquiry\nsimilar to a matter',
  `enquiry_id` varchar(45) DEFAULT NULL,
  UNIQUE KEY `r_id_UNIQUE` (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiry`
--

LOCK TABLES `enquiry` WRITE;
/*!40000 ALTER TABLE `enquiry` DISABLE KEYS */;
/*!40000 ALTER TABLE `enquiry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enquiry-person`
--

DROP TABLE IF EXISTS `enquiry-person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enquiry-person` (
  `r_id` int(10) unsigned NOT NULL COMMENT 'links a person to an enquiry',
  `person_id` varchar(45) NOT NULL,
  `enquiry_id` varchar(45) NOT NULL,
  PRIMARY KEY (`person_id`,`enquiry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiry-person`
--

LOCK TABLES `enquiry-person` WRITE;
/*!40000 ALTER TABLE `enquiry-person` DISABLE KEYS */;
/*!40000 ALTER TABLE `enquiry-person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `r_id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL COMMENT 'e.g.\nPhone call\nMeeting\n',
  `description` varchar(255) DEFAULT NULL,
  `eventcol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jcodes`
--

DROP TABLE IF EXISTS `jcodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jcodes` (
  `r_id` int(11) NOT NULL COMMENT 'J-Codes\n4 chars\nchar 1 = ''J''\nchar 2 = phase\nchar 3,4 = task (00= phase)',
  `jcode` varchar(45) DEFAULT NULL COMMENT 'The jcode\nShould be type char(4), but you never know...',
  `phase` varchar(45) DEFAULT NULL COMMENT 'litigation phase name\nNB task 00 is the phase',
  `task` varchar(45) DEFAULT NULL COMMENT 'task name\nNB task 00 is the phase',
  `precedentH` varchar(45) DEFAULT NULL COMMENT 'precedent H equivalent',
  PRIMARY KEY (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jcodes`
--

LOCK TABLES `jcodes` WRITE;
/*!40000 ALTER TABLE `jcodes` DISABLE KEYS */;
/*!40000 ALTER TABLE `jcodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matter`
--

DROP TABLE IF EXISTS `matter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `matter` (
  `r_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Record I.D.\nPrimary key',
  `matter_id` varchar(45) NOT NULL,
  `client_id` int(11) NOT NULL COMMENT 'FK client.rid\nThe client whose matter this is',
  `title` varchar(128) NOT NULL COMMENT 'Descriptive title of matter',
  `responsible_user_id` varchar(45) NOT NULL,
  `supervisor_user_id` varchar(45) NOT NULL,
  `start_date` date NOT NULL COMMENT 'Start date for matter.',
  `matterNum` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`matter_id`),
  UNIQUE KEY `id_matter_UNIQUE` (`r_id`),
  UNIQUE KEY `matter_id_UNIQUE` (`matter_id`),
  KEY `fk_matter_user1_idx` (`responsible_user_id`),
  KEY `fk_matter_user2_idx` (`supervisor_user_id`),
  CONSTRAINT `fk_matter_user1` FOREIGN KEY (`responsible_user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_matter_user2` FOREIGN KEY (`supervisor_user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matter`
--

LOCK TABLES `matter` WRITE;
/*!40000 ALTER TABLE `matter` DISABLE KEYS */;
INSERT INTO matter (title) VALUES
("Application to set aside CCJ v MoneyLenders"),
("Application to set aside CCJ v Big Bank"),
("Enduring power of attorney for children")

/*!40000 ALTER TABLE `matter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matter-doc`
--

DROP TABLE IF EXISTS `matter-doc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `matter-doc` (
  `r_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'This doc belongs to this matter\nmany to many\nMatters will have many docs\nSome docs belong to more than one matter (e.g. emails about more than one matter)',
  `matter_id` varchar(45) NOT NULL,
  `doc_id` varchar(45) NOT NULL,
  PRIMARY KEY (`doc_id`,`matter_id`),
  UNIQUE KEY `r_id_UNIQUE` (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matter-doc`
--

LOCK TABLES `matter-doc` WRITE;
/*!40000 ALTER TABLE `matter-doc` DISABLE KEYS */;
/*!40000 ALTER TABLE `matter-doc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matter-person`
--

DROP TABLE IF EXISTS `matter-person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `matter-person` (
  `r_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'List of people authorised to give instructions on a matter\n',
  `matter_id` varchar(45) NOT NULL,
  `person_id` varchar(45) NOT NULL,
  `take_instructions_from` tinyint(1) DEFAULT NULL COMMENT '1 = authorised to take instructions from this person on this matter',
  PRIMARY KEY (`matter_id`,`person_id`),
  UNIQUE KEY `matter-person-instructing_id_UNIQUE` (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matter-person`
--

LOCK TABLES `matter-person` WRITE;
/*!40000 ALTER TABLE `matter-person` DISABLE KEYS */;
/*!40000 ALTER TABLE `matter-person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person` (
  `r_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'person\nAn actual person\nusually a client or principal contact for a client',
  `name` varchar(45) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `middle_names` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `postnomials` varchar(45) DEFAULT NULL,
  `email_address` varchar(254) DEFAULT NULL,
  `alt_email_address` varchar(254) DEFAULT NULL,
  `phone_mobile` varchar(45) DEFAULT NULL,
  `phone_work` varchar(45) DEFAULT NULL,
  `preferred_contact` enum('email_address','alt_email_address','phone_work') DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  UNIQUE KEY `r_id_UNIQUE` (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person-event`
--

DROP TABLE IF EXISTS `person-event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person-event` (
  `r_id` int(11) NOT NULL,
  `person_id` varchar(45) DEFAULT NULL,
  `event_id` varchar(45) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person-event`
--

LOCK TABLES `person-event` WRITE;
/*!40000 ALTER TABLE `person-event` DISABLE KEYS */;
/*!40000 ALTER TABLE `person-event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `template`
--

DROP TABLE IF EXISTS `template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `template` (
  `r_id` int(11) NOT NULL COMMENT 'document templates',
  `template_id` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `filepath` varchar(255) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template`
--

LOCK TABLES `template` WRITE;
/*!40000 ALTER TABLE `template` DISABLE KEYS */;
/*!40000 ALTER TABLE `template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `r_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'system user table',
  `user_id` varchar(45) NOT NULL COMMENT 'Recognisable user_id\nappears on screens and reports\n\n',
  `name` varchar(45) NOT NULL COMMENT 'User''s name\nappears on screens and reports',
  `pw_hash` varchar(45) NOT NULL COMMENT 'Hash of user''s password',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `rid_UNIQUE` (`r_id`),
  UNIQUE KEY `userID_UNIQUE` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work`
--

DROP TABLE IF EXISTS `work`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `work` (
  `r_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Work done\n',
  `user_id` varchar(45) DEFAULT NULL,
  `event_id` varchar(45) DEFAULT NULL,
  `doc_id` varchar(45) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `duration` time DEFAULT NULL,
  `billable` tinyint(1) DEFAULT NULL,
  `matter_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`r_id`),
  UNIQUE KEY `r_id_UNIQUE` (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work`
--

LOCK TABLES `work` WRITE;
/*!40000 ALTER TABLE `work` DISABLE KEYS */;
/*!40000 ALTER TABLE `work` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflow`
--

DROP TABLE IF EXISTS `workflow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `workflow` (
  `r_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'A workflow\nheads a list of documents for ',
  `workflow_id` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`workflow_id`),
  UNIQUE KEY `r_id_UNIQUE` (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflow`
--

LOCK TABLES `workflow` WRITE;
/*!40000 ALTER TABLE `workflow` DISABLE KEYS */;
/*!40000 ALTER TABLE `workflow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflow-doc`
--

DROP TABLE IF EXISTS `workflow-doc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `workflow-doc` (
  `r_id` int(11) NOT NULL COMMENT 'workflow-doc\nsets the docs used by a workflow\n',
  `workflow_id` varchar(45) DEFAULT NULL,
  `doc_type_id` varchar(45) DEFAULT NULL,
  `template_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflow-doc`
--

LOCK TABLES `workflow-doc` WRITE;
/*!40000 ALTER TABLE `workflow-doc` DISABLE KEYS */;
/*!40000 ALTER TABLE `workflow-doc` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-09 10:14:51

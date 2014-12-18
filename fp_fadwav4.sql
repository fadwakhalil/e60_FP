-- ******************************************************
-- 2014fp.sql
--
-- Loader for Final Project (fp)  Database
--
-- Description:	This script contains the DDL to load
--              the tables of the
--              Inventory Patient-Tracking System database
--
-- There are 7 tables on this DB
--
-- Student:  Fadwa Khalil
--
-- Date:   December, 2014
-- ******************************************************
--    SPOOL SESSION
-- ******************************************************

set echo on
set serveroutput on
define _editor="vi"



spool 2014fp.lst


-- ******************************************************
-- Note:  Issue the appropiate commands to drop tables
-- ******************************************************

DROP TABLE pdisease purge;
DROP TABLE pappointment purge;
DROP TABLE medication purge;
DROP TABLE disease purge;
DROP TABLE package purge;
DROP TABLE pvisit purge;
DROP TABLE patient purge;
DROP TABLE tblogin purge;
-- ******************************************************
--    DROP SEQUENCES
-- Note:  Issue the appropiate commands to drop sequences
-- ******************************************************

DROP sequence disease_seq;
DROP sequence patient_seq;
Drop sequence appointment_seq;
Drop sequence bill_seq;
Drop sequence package_seq;
-- ******************************************************
--    CREATE TABLES
-- ******************************************************

CREATE TABLE tblogin (
        uname       	varchar2(20)            not null,
        pwd		varchar2(20)		not null,
	fname		varchar2(20)		null,
	userview	varchar2(20)		null
);

CREATE TABLE patient (
        patientid      	char(2)			not null
CONSTRAINT pid_range CHECK (patientid between 1 and 99),	
        name    	varchar2(20)            not null,
	dob     	date    DEFAULT Sysdate null,
        phone   	varchar2(10)           	not null,
        email           varchar2(50)           	not null,
 constraint pk_patientid primary key (patientid)
);

CREATE TABLE package (
        packageid       char(2)              	not null
CONSTRAINT packid_range CHECK (packageid between 1 and 99),
        duration   	char(5)             	null,
        price           number(10,4)  default 0 null
                        constraint rg_price check (price >= 0),
			constraint pk_package primary key (packageid)
);

CREATE TABLE disease (
	diseaseid 	char(2)             	null
CONSTRAINT did_range CHECK (diseaseid between 1 and 99),
        disease         varchar2(20)            null,
constraint pk_diseaseid primary key (diseaseid)
);
 
CREATE TABLE medication (
        medid           char(4)           	not null
                        constraint pk_medid primary key
CONSTRAINT mid_range CHECK (medid between 1 and 9999),
        medtype         varchar(20)             null
);


CREATE TABLE pvisit (
	patientid       char(2)             	not null,
        appointmentid   char(4)             	not null,
        billid		char(4)            	not null
CONSTRAINT bid_range CHECK (billid between 1 and 9999),
	packageid       char(1)              	not null,
	duration   	char(5)             	null,
	lastvisit       date            	DEFAULT Sysdate null,
	Paid		char(1) 		not null,
constraint pk_appointment_patient primary key (appointmentid, patientid),
constraint fk_patientd FOREIGN KEY (patientid) references patient (patientid)  on delete cascade
);

CREATE TABLE pdisease (
        patientid       char(2)             	not null,
        diseaseid       char(2)             	null,
        medid           char(4)             	null,
constraint pk_disease_patient PRIMARY KEY (diseaseid, patientid),
constraint fk_patientdiseas FOREIGN KEY (patientid) references patient (patientid)  on delete cascade,
constraint fk_medid FOREIGN KEY (medid) references medication (medid)  on delete cascade,
constraint fk_diseaseid FOREIGN KEY (diseaseid) references disease (diseaseid)  on delete cascade
);


CREATE TABLE pappointment (
	appointmentid   char(4)             	null
			constraint pk_appointment PRIMARY KEY
CONSTRAINT appid_range CHECK (appointmentid between 1 and 9999),
	patientid       char(2)             	not null,
 	packageid       char(1)                 not null,	
	nextvisit       date	DEFAULT Sysdate null,
	aptime		varchar2(5)		null,
	estduration	char(5)			null,
	visited		varchar2(5)         	null,
	paid		varchar2(5)     	null,
constraint fk_patient_app FOREIGN KEY (patientid) references patient (patientid)  on delete cascade
);

-- ******************************************************
--    CREATE SEQUENCES
-- ******************************************************

CREATE sequence bill_seq
increment by 1
start with 1;

CREATE sequence appointment_seq
increment by 1
start with 1;

CREATE sequence patient_seq
increment by 1
start with 1;

CREATE sequence disease_seq
increment by 1
start with 1;

CREATE sequence package_seq
increment by 1
start with 1;

-- ******************************************************
--    Create Procedure to increment patientid
-- ******************************************************

-- ******************************************************
--    POPULATE TABLES
-- ******************************************************
/* tblogin entity */

INSERT INTO tblogin VALUES ('admin', 'admin', 'admin', 'all');
INSERT INTO tblogin VALUES ('user', 'user', 'user', 'install');

/* patient entity */

SELECT patient_seq.nextval FROM dual;
INSERT INTO patient VALUES (patient_seq.currval, 'Earl Smith', TO_DATE('1989-12-09','RRRR-MM-DD'), '0718012921', 'esmith0@a8.net');
SELECT patient_seq.nextval FROM dual;
INSERT INTO patient VALUES (patient_seq.currval, 'Beverly Porter', TO_DATE('1990-11-04','RRRR-MM-DD'), '2406764467', 'bporter@gmail');
SELECT patient_seq.nextval FROM dual;
INSERT INTO patient VALUES (patient_seq.currval, 'Samuel Bowman', TO_DATE('1967-08-06','RRRR-MM-DD'), '0773059462', 'sbowman2@vk.com');
SELECT patient_seq.nextval FROM dual;
INSERT INTO patient VALUES (patient_seq.currval, 'Raymond Owens', TO_DATE('1988-03-09','RRRR-MM-DD'), '5895251248', 'rowens3@vk.com');
SELECT patient_seq.nextval FROM dual;
INSERT INTO patient VALUES (patient_seq.currval, 'Linda Washington', TO_DATE('1977-10-10','RRRR-MM-DD'), '0898832701', 'lwashington4@si.edu');

/* Package Entry */

SELECT package_seq.nextval FROM dual;
INSERT INTO package VALUES (package_seq.currval, 0.5, 35);
SELECT package_seq.nextval FROM dual;
INSERT INTO package VALUES (package_seq.currval, 1, 65);
SELECT package_seq.nextval FROM dual;
INSERT INTO package VALUES (package_seq.currval, 1.5, 85);

/* Disease Entity*/

SELECT disease_seq.nextval FROM dual;
INSERT INTO disease VALUES (disease_seq.currval, 'Diabetes');
SELECT disease_seq.nextval FROM dual;
INSERT INTO disease VALUES (disease_seq.currval, 'Allergy');
SELECT disease_seq.nextval FROM dual;
INSERT INTO disease VALUES (disease_seq.currval, 'Heart Disease');
SELECT disease_seq.nextval FROM dual;
INSERT INTO disease VALUES (disease_seq.currval, 'Hepatitis');
SELECT disease_seq.nextval FROM dual;
INSERT INTO disease VALUES (disease_seq.currval, 'Other');

/* Medication Entity*/
 
INSERT INTO medication VALUES (0001, 'Med1');
INSERT INTO medication VALUES (0002, 'Med2');
INSERT INTO medication VALUES (0003, 'Med3');
INSERT INTO medication VALUES (0004, 'Med4');
INSERT INTO medication VALUES (0005, 'Med5');

/* pvisit entity */
INSERT INTO pvisit VALUES (1, 1,  1, 2, 1, TO_DATE('2015-12-09','RRRR-MM-DD'), 0);
INSERT INTO pvisit VALUES (1, 2,  2, 2, 1.5, TO_DATE('2015-06-09','RRRR-MM-DD'), 0);
INSERT INTO pvisit VALUES (2, 3,  1, 2, 0.5, TO_DATE('2014-03-09','RRRR-MM-DD'), 0);
INSERT INTO pvisit VALUES (2, 4,  2, 3, 1.5, TO_DATE('2014-01-09','RRRR-MM-DD'), 0);
INSERT INTO pvisit VALUES (3, 5,  3, 3, 1.5, TO_DATE('2014-07-09','RRRR-MM-DD'), 0);
INSERT INTO pvisit VALUES (3, 6,  4, 3, 0.5, TO_DATE('2014-04-09','RRRR-MM-DD'), 0);
INSERT INTO pvisit VALUES (4, 7,  1, 3, 1, TO_DATE('2014-12-09','RRRR-MM-DD'), 0);
INSERT INTO pvisit VALUES (4, 8,  2, 3, 1.5, TO_DATE('2014-11-09','RRRR-MM-DD'), 0);
INSERT INTO pvisit VALUES (5, 9,  1, 2, 1.5, TO_DATE('2014-10-09','RRRR-MM-DD'), 0);
INSERT INTO pvisit VALUES (5, 10, 2, 1, 1, TO_DATE('2014-11-09','RRRR-MM-DD'), 0);

/* pdisease entity */
 
INSERT INTO pdisease VALUES (1, 5, 1 );
INSERT INTO pdisease VALUES (2, 2, 2 );
INSERT INTO pdisease VALUES (1, 3, 3 );
INSERT INTO pdisease VALUES (1, 4, 4 );
INSERT INTO pdisease VALUES (2, 5, 5 );
INSERT INTO pdisease VALUES (2, 1, 1 );
INSERT INTO pdisease VALUES (3, 5, 2 );
INSERT INTO pdisease VALUES (4, 5, 3 );

/* pappointment entity */
SELECT appointment_seq.nextval FROM dual;
INSERT INTO pappointment VALUES (appointment_seq.currval, 1, 1, TO_DATE('2015-09-09','RRRR-MM-DD'), '8:30', 1, 'false', 'false');
SELECT appointment_seq.nextval FROM dual;
INSERT INTO pappointment VALUES (appointment_seq.currval, 1, 2, TO_DATE('2015-12-08','RRRR-MM-DD'), '9:30', 1, 'false', 'false');
SELECT appointment_seq.nextval FROM dual;
INSERT INTO pappointment VALUES (appointment_seq.currval, 2, 1, TO_DATE('2015-10-06','RRRR-MM-DD'), '10:00', 0.5, 'false', 'false');
SELECT appointment_seq.nextval FROM dual;
INSERT INTO pappointment VALUES (appointment_seq.currval, 2, 1, TO_DATE('2014-02-08','RRRR-MM-DD'), '11:00', 1, 'false', 'false');
SELECT appointment_seq.nextval FROM dual;
INSERT INTO pappointment VALUES (appointment_seq.currval, 3, 1, TO_DATE('2014-04-01','RRRR-MM-DD'), '12:30', 1, 'false', 'false');
SELECT appointment_seq.nextval FROM dual;
INSERT INTO pappointment VALUES (appointment_seq.currval, 3, 1, TO_DATE('2014-08-11','RRRR-MM-DD'), '1:00', 0.5, 'false', 'false');
SELECT appointment_seq.nextval FROM dual;
INSERT INTO pappointment VALUES (appointment_seq.currval, 4, 2, TO_DATE('2015-07-15','RRRR-MM-DD'), '2:30', 1.5, 'false', 'false');
SELECT appointment_seq.nextval FROM dual;
INSERT INTO pappointment VALUES (appointment_seq.currval, 4, 2, TO_DATE('2014-09-18','RRRR-MM-DD'),'2:30', 1, 'false', 'false');
SELECT appointment_seq.nextval FROM dual;
INSERT INTO pappointment VALUES (appointment_seq.currval, 5, 1, TO_DATE('2014-12-10','RRRR-MM-DD'),'3:30', 1, 'false', 'false');
SELECT appointment_seq.nextval FROM dual;
INSERT INTO pappointment VALUES (appointment_seq.currval, 5, 1,  TO_DATE('2014-11-09','RRRR-MM-DD'),'5:00', 1.5, 'false', 'false');


-- ******************************************************
--    VIEW TABLES
--
-- Note:  Issue the appropiate commands to show your data
-- ******************************************************

SELECT * FROM tblogin;
SELECT * FROM patient;
SELECT * FROM pdisease;
SELECT * FROM pvisit;
SELECT * FROM pappointment;
SELECT * FROM package;
SELECT * FROM disease;
SELECT * FROM medication;


-- ******************************************************
--    QUALITY CONTROLS
--
-- Note:  Testing  constraints of the following types:
--        *) Entity integrity
--        *) Referential integrity
--        *) Column constraints
--        *) 1. Entity integrity: Duplicate PK
-- SELECT * FROM package;
-- INSERT into package values ('1', 0.6, 40);
--        *) 2. Entity integrity: Null PK
-- SELECT * FROM package;
-- INSERT into package values (null, 0.5, 35);
--        *) 1. Referential integrity: Updating PK with Existing PK
-- SELECT * FROM patient;
-- UPDATE patient set patientid=5 where patientid=1;

-- ******************************************************
--    END SESSION
-- ******************************************************

commit;

spool off

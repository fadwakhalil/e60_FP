<!DOCTYPE html>
<html>  	  
<head>
      <cfinclude template = "general.css">
	  <cfinclude template = "header.cfm">  
</head>

<body>
<cfif not IsDefined ("Session.userview")>
		<cflocation url="http://cscie60.dce.harvard.edu/~fkhalil/FP/login.cfm">
	<cfelse>
		<cfif Session.userview eq "all" >
<h8>Please double click each cell when you need to edit information.</h8>
	  <cfif isdefined("Form.Grid.rowstatus.action")>

    		<cfloop index = "counter" from = "1" to = #arraylen(Form.Grid.rowstatus.action)#>


        		<cfif Form.Grid.rowstatus.action[counter] is "D">
                   <cfquery name="DeleteExistingPatient" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#" >
                           DELETE FROM patient
                           WHERE patientid=<cfqueryparam value="#Form.Grid.original.patientid[counter]#" CFSQLType="CF_SQL_CHAR" >
                   </cfquery>

                        
        		<cfelseif Form.Grid.rowstatus.action[counter] is "U">
            		<cfquery name="UpdateExistingPatient" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#"> 
                				UPDATE patient 
                				SET
                				name=<cfqueryparam  value="#Form.Grid.name[counter]#" CFSQLType="CF_SQL_VARCHAR" >,
                    			dob=TO_DATE('#Form.Grid.DoB[counter]#','MM/DD/YYYY'),
                     			phone=<cfqueryparam  value="#Form.Grid.phone[counter]#" CFSQLType="CF_SQL_VARCHAR" >,
                    			email=<cfqueryparam  value="#Form.Grid.email[counter]#" CFSQLType="CF_SQL_VARCHAR" >
	                			WHERE patientid=<cfqueryparam value="#Form.Grid.original.patientid[counter]#" CFSQLType="CF_SQL_CHAR"> 
            		</cfquery> 
	            		
	         	<cfelseif Form.Grid.rowstatus.action[counter] is "I">
                    <cfquery name="Increment_seq" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#" >
                        	SELECT patient_seq.nextval FROM dual
                    </cfquery>
                    <cfoutput>
                        <cfquery name="InsertNewPatient" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#" >
                        	INSERT INTO patient 
                        	(patientid, 
                        	name, 
	                        DoB, 
                         	phone, 
                        	email
                        	)
                        	VALUES 
                        	(#Increment_seq.nextval#, 
                        	<cfqueryparam  value="#Form.Grid.name[counter]#" CFSQLType="CF_SQL_VARCHAR" >, 
	                        TO_DATE('#Form.Grid.DoB[counter]#','MM/DD/YYYY'),                          	
	                        <cfqueryparam  value="#Form.Grid.phone[counter]#" CFSQLType="CF_SQL_VARCHAR" >, 
                        	<cfqueryparam  value="#Form.Grid.email[counter]#" CFSQLType="CF_SQL_VARCHAR" >
                        	)
                        </cfquery>
                    </cfoutput>
            	</cfif>
           </cfloop>
	  </cfif> 

  <cfoutput>
 	  <cfif IsDefined("patname")>
	    	  <cfquery name="getpatient" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    		    SELECT patientid, name, to_char(dob,'MM/DD/YYYY') as dob, phone, email FROM patient where name='#patname#' ORDER BY patientid
	  		  </cfquery>
	  <cfelseif IsDefined("pid")>
			  <cfquery name="getpatient" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
					SELECT patientid, name, to_char(dob,'MM/DD/YYYY') as dob, phone, email FROM patient where patientid='#pid#' ORDER BY patientid
			  </cfquery>
	  <cfelse>
			  <cfquery name="getpatient" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
			    	SELECT patientid, name, to_char(dob,'MM/DD/YYYY') as dob, phone, email FROM patient ORDER BY name
			  </cfquery>	  
	  
	  </cfif>

	  <cfform name="Form" action="patient.cfm" preserveData="yes">
          <cfgrid name="Grid" query="getpatient" format="html"  colHeaderBold = "Yes" selectmode="edit" delete="Yes" deleteButton="Delete" insert="Yes" insertButton="Insert">
 
          		<cfgridcolumn name="PATIENTID" header="PATIENTID" width=200 headeralign="center" headerbold="Yes" display="No">
          		<cfgridcolumn name="name" header="* Name" width=200 headeralign="center" headerbold="Yes"  >
          		<cfgridcolumn name="dob" header="* Date of Birth (mm/dd/yyyy)" width=200 headeralign="center" headerbold="Yes">
	          	<cfgridcolumn name="phone" header="* Phone" width=200 headeralign="center" headerbold="Yes">
	          	<cfgridcolumn name="email" header="* Email" width=200 headeralign="center" headerbold="Yes">
          </cfgrid>
 		  <cfinput type="submit" name="gridEntered" value="Submit the change">

 	  </cfform>
 	  
	  <cfform>
	   	  <cfinput name="patname" type="text" value="" autosuggest="cfc:suggestcfc.getLNames({cfautosuggestvalue})">
          <cfinput type="image" src="http://cscie60.dce.harvard.edu/~fkhalil/FP/images/searchbutton1.gif" name="gridEntered" value="Search" >
	  </cfform>
	  
 	  <cfform name="Form" action="appointment.cfm">
          <cfinput name="pida" value=#getpatient.PATIENTID# bind="{Grid.PATIENTID}" type="hidden">
          <cfinput type="submit" name="makeapp" value="Appointments">
	  </cfform>

	  <cfform>
	  		<cfinput type="dateField" name="selectdate" label="DoB" width="100" value= #getpatient.dob# bind="{Grid.dob}">
	  		<cfinput type="Submit" name="submitit" value="Save" width="100" > 
 	  </cfform>

  </cfoutput>
 	
 			</cfif>
	</cfif>

</body>	 
<cfinclude template = "footer.cfm">
</html>






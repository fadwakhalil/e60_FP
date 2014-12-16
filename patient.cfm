<!DOCTYPE html>
<html>  	  
<head>
      <cfinclude template = "general.css">
	  <cfinclude template = "header.cfm">  
</head>

<body>

	  <cfif isdefined("Form.Grid.rowstatus.action")>

    		<cfloop index = "counter" from = "1" to = #arraylen(Form.Grid.rowstatus.action)#>

        		<cfoutput>
           			The row action for #counter# is:
            		#Form.Grid.rowstatus.action[counter]#
            		<br>
        		</cfoutput>

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
	  <cfquery name="getpatient" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    	SELECT patientid, name, to_char(dob,'MM/DD/YYYY') as dob, phone, email FROM patient ORDER BY name
	  </cfquery>	  
	  
  	  <cfif IsDefined("patname")>
	    		<cfquery name="getpatient" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    			SELECT patientid, name, to_char(dob,'MM/DD/YYYY') as dob, phone, email FROM patient where name='#patname#' ORDER BY name
	  			</cfquery>
	  </cfif>

	  <cfform name="Form" action="patient.cfm" preserveData="yes">
          <cfgrid name="Grid" query="getpatient" format="html"  colHeaderBold = "Yes" selectmode="edit" delete="Yes" deleteButton="Delete" insert="Yes" insertButton="Insert">
 
          		<cfgridcolumn name="PATIENTID" header="PATIENTID" width=200 headeralign="center" headerbold="Yes" display="No">
          		<cfgridcolumn name="name" header="* Name" width=200 headeralign="center" headerbold="Yes"  >
          		<cfgridcolumn name="dob" header="* Date of Birth" width=200 headeralign="center" headerbold="Yes">
	          	<cfgridcolumn name="phone" header="* Phone" width=200 headeralign="center" headerbold="Yes">
	          	<cfgridcolumn name="email" header="* Email" width=200 headeralign="center" headerbold="Yes">
          </cfgrid>
          
          <cfinput name="patname" type="text" value="" autosuggest="cfc:suggestcfc.getLNames({cfautosuggestvalue})">
          <cfinput type="submit" name="gridEntered">
 	  </cfform>

	  <cfform>
	  		<cfinput type="dateField" name="selectdate" label="DoB" width="100" value= #getpatient.dob# bind="{Grid.dob}">
	  		<cfinput type="Submit" name="submitit" value="Save" width="100" > 
 	  </cfform>

	  <cfform name="Form" action="appointment.cfm">
          <cfinput name="patname"  type="hidden" >
          <cfinput type="submit" name="makeapp" value="Appointments">
	  </cfform>
  </cfoutput>
 
 	
 	
</body>	 
<cfinclude template = "footer.cfm">
</html>






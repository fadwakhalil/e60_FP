<!DOCTYPE html>
<html>  	  
<head>
      <cfinclude template = "general.css">
	  <cfinclude template = "header.cfm">  

</head>

<body>


	  <cfif isdefined("Form.Grid.rowstatus.action")> 
           <cfloop index = "counter" from = "1" to = #arraylen(Form.Grid.rowstatus.action)#>
           
                   <cfif Form.Grid.rowstatus.action[counter] is "D">
                        <cfquery name="DeleteExistingAppointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#" >
                                DELETE FROM pappointment
                                WHERE appointmentid=<cfqueryparam value="#Form.Grid.original.appointmentid[counter]#" CFSQLType="CF_SQL_CHAR" >
                        </cfquery>

        			<cfelseif Form.Grid.rowstatus.action[counter] is "I">
                        <cfquery name="Increment_seq" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#" >
                        	SELECT appointment_seq.nextval FROM dual
                        </cfquery>
                        <cfoutput>
                        <cfquery name="InsertNewAppointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#" >
                        	INSERT INTO pappointment 
                        	VALUES 
                        	(#Increment_seq.nextval#, 
                        	<cfqueryparam  value="#Form.Grid.PATIENTID[counter]#" CFSQLType="CF_SQL_CHAR" >, 
                        	<cfqueryparam  value="#Form.Grid.PACKAGEID[counter]#" CFSQLType="CF_SQL_CHAR" >, 
                        	TO_DATE('#Form.Grid.NEXTVISIT[counter]#','MM/DD/YYYY'),
                        	<cfqueryparam  value="#Form.Grid.APTIME[counter]#" CFSQLType="CF_SQL_VARCHAR" >, 
                        	<cfqueryparam  value="#Form.Grid.ESTDURATION[counter]#" CFSQLType="CF_SQL_CHAR" >,
	                        <cfqueryparam  value="#Form.Grid.visited[counter]#" CFSQLType="CF_SQL_BOOLEAN" >,
	                       'false'
                        	)
                        	
                        </cfquery>
                        </cfoutput>
                        
       			    <cfelseif Form.Grid.rowstatus.action[counter] is "U">
            			<cfquery name="UpdateExistingAppointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#"> 
                				UPDATE pappointment 
                				SET
                				PATIENTID=<cfqueryparam  value="#Form.Grid.PATIENTID[counter]#" CFSQLType="CF_SQL_CHAR" >,
                    			NEXTVISIT=TO_DATE('#Form.Grid.NEXTVISIT[counter]#','MM/DD/YYYY'),
	                    		APTIME=<cfqueryparam  value="#Form.Grid.APTIME[counter]#" CFSQLType="CF_SQL_VARCHAR" >,
                    			ESTDURATION=<cfqueryparam  value="#Form.Grid.ESTDURATION[counter]#" CFSQLType="CF_SQL_CHAR" >,
	                    		visited=<cfqueryparam  value="#Form.Grid.visited[counter]#" CFSQLType="CF_SQL_VARCHAR" >
	                    		WHERE appointmentid=<cfqueryparam value="#Form.Grid.original.appointmentid[counter]#" CFSQLType="CF_SQL_CHAR">
            			</cfquery>
            			
            			<cfif #Form.Grid.visited[counter]# >
	            			<cfoutput>
	            				<cfmail from="fadwakhalil@gmail.com" to="fadwakhalil@gmail.com" subject="Thanks for Visiting ">
	            						Thank you for your visit.
	            				</cfmail>
	            			</cfoutput>
            			</cfif>
            			
                   </cfif>
           </cfloop>
	  </cfif> 


	  <cfoutput>

	  <cfquery name="getappointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    	SELECT pac.appointmentid, pac.patientid, pac.packageid, to_char(pac.nextvisit,'MM/DD/YYYY') as nextvisit, pac.aptime, pac.estduration, pac.visited FROM pappointment pac
	    	inner join package pack ON pack.packageid=pac.packageid
	    	where pac.visited='false' 
	    	ORDER BY APPOINTMENTID
	  </cfquery>	  

  	  
  	  <cfif IsDefined("pacid")>
	  	  	<cfif IsNumeric(#pacid#)>
	    		<cfquery name="getappointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    			SELECT pac.appointmentid, pac.patientid, pac.packageid, to_char(pac.nextvisit,'MM/DD/YYYY') as nextvisit, pac.aptime, pac.estduration, pac.visited
	    			FROM pappointment pac
	    			inner join package pack ON pack.packageid=pac.packageid
	    			where pac.visited='false' and pac.APPOINTMENTID=#pacid# 
	    			ORDER BY APPOINTMENTID
	  			</cfquery>
	  		</cfif>
	  </cfif>

	  <cfquery name="getdu" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    	SELECT * FROM package 
	  </cfquery>

	  <cfset estdu = ValueList(getdu.duration)>


	  <cfform name="Form" action="appointment.cfm">
          <cfgrid name="Grid" query="getappointment" format="html"  colHeaderBold = "Yes" selectmode="edit" delete="Yes" deleteButton="Delete" insert="Yes" insertButton="Insert">
 
           		<cfgridcolumn name="appointmentid" header="Appointment ID" width=100 headeralign="center" headerbold="Yes"  display="yes" >
          		<cfgridcolumn name="PATIENTID" header="PATIENTID" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="PACKAGEID" header="PACKAGEID" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="NEXTVISIT" header="NEXT VISIT" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="APTIME" header="TIME" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="ESTDURATION" header="DURATION" width=200 headeralign="center" headerbold="Yes" values="#estdu#" valuesdisplay="#estdu#" valuesdelimiter=",">
	          	<cfgridcolumn name="VISITED" header="VISITED?" width=200 headeralign="center" headerbold="Yes"  type="boolean">
	          	 
          </cfgrid>
          
          <cfinput name="pacid" type="text" value="" autosuggest="cfc:suggestcfc.getLNames({cfautosuggestvalue})">
          <cfinput type="submit" name="gridEntered">
	  </cfform>

	
	  <cfform name="Form1" action="patient.cfm">
          <cfinput name="pacid"  type="hidden" >
          <cfinput type="submit" name="patient" value="Patients">
	  </cfform>
	  
	  <cfform name="Form2" action="invoice.cfm">
          <cfinput name="pacid"  type="hidden" >
          <cfinput type="submit" name="invoice" value="Invoices">
	  </cfform>
</cfoutput>
 		
</body>	 
	  
   
<cfinclude template = "footer.cfm">
</html>






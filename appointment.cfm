<!DOCTYPE html>
<html>  	  
<head>
      <cfinclude template = "general.css">
	  <cfinclude template = "header.cfm">  

</head>

<body>
	  <cfoutput>
		  <cfif IsDefined("pida")>
		      	<cfset pidains = #pida#> 
		  </cfif>
	  </cfoutput>
	  


	  <cfif isdefined("Form.Grid.rowstatus.action")> 
           <cfloop index = "counter" from = "1" to = #arraylen(Form.Grid.rowstatus.action)#>
           
                   <cfif Form.Grid.rowstatus.action[counter] is "D">
                        <cfquery name="DeleteExistingAppointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#" >
                                DELETE FROM pappointment
                                WHERE appointmentid=<cfqueryparam value="#Form.Grid.original.appointmentid[counter]#" CFSQLType="CF_SQL_CHAR" >
                        </cfquery>

        			<cfelseif Form.Grid.rowstatus.action[counter] is "I">
        				<cfif IsDefined("pidains")>
	                        <cfquery name="Increment_seq" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#" >
	                        	SELECT appointment_seq.nextval FROM dual
	                        </cfquery>
	                        <cfoutput>
		                        <cfquery name="InsertNewAppointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#" >
		                        	INSERT INTO pappointment 
		                        	VALUES 
		                        	(#Increment_seq.nextval#, 
		                        	#pidains#, 
		                        	<cfqueryparam  value="#Form.Grid.PACKAGEID[counter]#" CFSQLType="CF_SQL_CHAR" >, 
		                        	TO_DATE('#Form.Grid.NEXTVISIT[counter]#','MM/DD/YYYY'),
		                        	<cfqueryparam  value="#Form.Grid.APTIME[counter]#" CFSQLType="CF_SQL_VARCHAR" >, 
		                        	<cfqueryparam  value="#Form.Grid.ESTDURATION[counter]#" CFSQLType="CF_SQL_CHAR" >,
			                        <cfqueryparam  value="#Form.Grid.visited[counter]#" CFSQLType="CF_SQL_BOOLEAN" >,
			                       'false'
		                        	)
		                        	
		                        </cfquery>
	                        </cfoutput>
        				</cfif>
                        
       			    <cfelseif Form.Grid.rowstatus.action[counter] is "U">
            			<cfquery name="UpdateExistingAppointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#"> 
                				UPDATE pappointment 
                				SET
                    			NEXTVISIT=TO_DATE('#Form.Grid.NEXTVISIT[counter]#','MM/DD/YYYY'),
	                    		APTIME=<cfqueryparam  value="#Form.Grid.APTIME[counter]#" CFSQLType="CF_SQL_VARCHAR" >,
                    			ESTDURATION=<cfqueryparam  value="#Form.Grid.ESTDURATION[counter]#" CFSQLType="CF_SQL_CHAR" >,
	                    		VISITED=<cfqueryparam  value="#Form.Grid.visited[counter]#" CFSQLType="CF_SQL_VARCHAR" >
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
	    	SELECT		app.appointmentid, app.patientid, app.packageid, to_char(app.nextvisit,'MM/DD/YYYY') as nextvisit, 
	    				app.aptime, app.estduration, app.visited 
	    	FROM		pappointment app
	    	INNER JOIN	package pkg 
	    	ON 			pkg.packageid=app.packageid
	    	WHERE 		app.visited='false' 
	    	ORDER BY 	appointmentid
	  </cfquery>	  

  	  
  	  <cfif IsDefined("pidains")>
	  	  	<cfif IsNumeric(#pidains#)>
	    		<cfquery name="getappointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    			SELECT		app.appointmentid, app.patientid, app.packageid, to_char(app.nextvisit,'MM/DD/YYYY') as nextvisit, 
	    						app.aptime, app.estduration, app.visited
	    			FROM 		pappointment app
	    			INNER JOIN	package pkg 
	    			ON			pkg.packageid=app.packageid
	    			WHERE 		app.visited='false' AND app.PATIENTID IN (select PATIENTID from patient where patientid = #pidains#) 
	    			ORDER BY	appointmentid
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
          		<cfgridcolumn name="PATIENTID" header="PATIENTID" width=200 headeralign="center" headerbold="Yes" display="No">
          		<cfgridcolumn name="PACKAGEID" header="PACKAGEID" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="NEXTVISIT" header="NEXT VISIT" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="APTIME" header="TIME" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="ESTDURATION" header="DURATION" width=200 headeralign="center" headerbold="Yes" values="#estdu#" valuesdisplay="#estdu#" valuesdelimiter=",">
	          	<cfgridcolumn name="VISITED" header="VISITED?" width=200 headeralign="center" headerbold="Yes"  type="boolean">
	          	 
          </cfgrid>
		  <cfif IsDefined("pidains")>
		      	 <cfinput name="pidains" type="hidden" value=#pidains#>
		  </cfif>
		  
 		  <cfinput type="submit" name="gridEntered" value="Submit the change">

 	  </cfform>



 	  <cfform name="Form" action="patient.cfm">
 	  	<cfif len(#getappointment.PATIENTID#)>
          <cfinput name="pid" value=#getappointment.PATIENTID# bind="{Grid.PATIENTID}" type="hidden">
 	  	<cfelseif IsDefined("pidains")>
 	  		<cfinput name="pid" value=#pidains# type="hidden">
 	  	<cfelse>
 	  		<cfinput name="pid" value="" type="hidden">
 	  	</cfif>
          <cfinput type="submit" name="makeapp" value="Patient">
	  </cfform>


 	  <cfform name="Form" action="invoice.cfm">
 	  	<cfif len(#getappointment.PATIENTID#)>
 	  		<cfinput name="pidi" value=#getappointment.PATIENTID# bind="{Grid.PATIENTID}" type="hidden">
 	  	<cfelseif IsDefined("pidains")>
 	  		<cfinput name="pidi" value=#pidains# type="hidden">
 	  	<cfelse>
 	  		<cfinput name="pidi" value="" type="hidden">
 	  	</cfif>
          <cfinput type="submit" name="makeapp" value="Invoice">
	  </cfform>
	  

	  
	</cfoutput>
 		
</body>	 
	  
   
<cfinclude template = "footer.cfm">
</html>






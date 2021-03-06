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

	  <cfoutput>
		  <cfif IsDefined("pidi")>
		      	<cfset pidiins = #pidi#> 
		  </cfif>
	  </cfoutput>
	  

	  <cfif isdefined("Form.Grid.rowstatus.action")> 
           <cfloop index = "counter" from = "1" to = #arraylen(Form.Grid.rowstatus.action)#>
	                 
      			    <cfif Form.Grid.rowstatus.action[counter] is "U">
      			    	<cftry>
	            			<cfquery name="UpdateExistingAppointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#"> 
	                				UPDATE pappointment 
	                				SET
	                    			NEXTVISIT=TO_DATE('#Form.Grid.NEXTVISIT[counter]#','MM/DD/YYYY'),
		                    		APTIME=<cfqueryparam  value="#Form.Grid.APTIME[counter]#" CFSQLType="CF_SQL_CHAR" >,
	                    			ESTDURATION=<cfqueryparam  value="#Form.Grid.ESTDURATION[counter]#" CFSQLType="CF_SQL_CHAR" >,
		                    		VISITED=<cfqueryparam  value="#Form.Grid.visited[counter]#" CFSQLType="CF_SQL_BOOLEAN" >,
		                    		PAID=<cfqueryparam  value="#Form.Grid.paid[counter]#" CFSQLType="CF_SQL_BOOLEAN" >
		                    		WHERE appointmentid=<cfqueryparam value="#Form.Grid.original.appointmentid[counter]#" CFSQLType="CF_SQL_CHAR">
	            			</cfquery>
            			<cfcatch type="any">
            				Invalid Entry.
            			</cfcatch>
      			    	</cftry>
            			<cfif #Form.Grid.paid[counter]# >
	            			<cfoutput>
	            				<cfmail from="info.cscie60@gmail.com" to="fadwakhalil@gmail.com" subject="Payment received">
	            					Thanks For Your Payment.
	            				</cfmail>
	            			</cfoutput>
            			</cfif>

                   </cfif>
           </cfloop>
	  </cfif> 

	  <cfoutput>


	  <cfquery name="getinvoice" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    	SELECT	 app.appointmentid, app.patientid, to_char(app.nextvisit,'MM/DD/YYYY') as nextvisit, 
	    			 app.aptime, app.estduration, pkg.price, app.visited, app.paid, pkg.packageid, pkg.duration, pkg.price
	    	FROM	 pappointment app, package pkg
	    	WHERE	 visited='true' 
	    	AND		 pkg.packageid=app.packageid
	    	ORDER BY appointmentid
	  </cfquery>	  

  	  <cfif IsDefined("pidiins")>
	  	  	<cfif IsNumeric(#pidiins#)>
	    		<cfquery name="getinvoice" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
			    	SELECT	 app.appointmentid, app.patientid, to_char(app.nextvisit,'MM/DD/YYYY') as nextvisit, 
			    			 app.aptime, app.estduration, pkg.price, app.visited, app.paid, pkg.packageid, pkg.duration, pkg.price
		 			FROM	 pappointment app, package pkg 
		 			WHERE	 visited='true' 
		 			AND		 pkg.packageid=app.packageid
			 		AND		 patientid=#pidiins#
			 		ORDER BY appointmentid
	  			</cfquery>
	  		</cfif>
	  </cfif>

	  <cfquery name="getdu" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    			SELECT * FROM package 
	  </cfquery>
	  <cfset estdu = ValueList(getdu.duration)>

	  <cfform name="Form" action="invoice.cfm">
         <cfgrid name="Grid" query="getinvoice" format="html"  colHeaderBold = "Yes" selectmode="edit" >
 
           		<cfgridcolumn name="appointmentid" header="Appointment ID" width=100 headeralign="center" headerbold="Yes"  display="No" >
          		<cfgridcolumn name="PATIENTID" header="PATIENTID" width=200 headeralign="center" headerbold="Yes" display="No">
          		<cfgridcolumn name="NEXTVISIT" header="NEXT VISIT" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="APTIME" header="TIME" width=100 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="ESTDURATION" header="DURATION" width=100 headeralign="center" headerbold="Yes" values="#estdu#" valuesdisplay="#estdu#" valuesdelimiter=",">
          		<cfgridcolumn name="PRICE" header="PRICE" width=100 headeralign="center" headerbold="Yes">
	          	<cfgridcolumn name="VISITED" header="VISITED?" width=100 headeralign="center" headerbold="Yes"  type="boolean">
	          	<cfgridcolumn name="PAID" header="PAID?" width=100 headeralign="center" headerbold="Yes"  type="boolean">
	          	 
          </cfgrid>
           
		  <cfif IsDefined("pidiins")>
		      	 <cfinput name="pidiins" type="hidden" value=#pidiins#>
		  </cfif>
		  
 		  <cfinput type="submit" name="gridEntered" value="Submit the change">

 	  </cfform>
	  
	  
 	  <cfform name="Form" action="patient.cfm">
 	  	<cfif len(#getinvoice.PATIENTID#)>
          <cfinput name="pid" value=#getinvoice.PATIENTID#  bind="{Grid.PATIENTID}" type="hidden">
 	  	<cfelseif IsDefined("pidiins")>
 	  		<cfinput name="pid" value=#pidiins# type="hidden">
 	  	<cfelse>
 	  		<cfinput name="pid" value="" type="hidden">
 	  	</cfif>
          <cfinput type="submit" name="makeapp" value="Patient">
	  </cfform>


 	  <cfform name="Form" action="appointment.cfm">
 	  	<cfif len(#getinvoice.PATIENTID#)>
 	  		<cfinput name="pida" value=#getinvoice.PATIENTID# bind="{Grid.PATIENTID}" type="hidden">
 	  	<cfelseif IsDefined("pidiins")>
 	  		<cfinput name="pida" value=#pidiins# type="hidden">
 	  	<cfelse>
 	  		<cfinput name="pida" value="" type="hidden">
 	  	</cfif>
          <cfinput type="submit" name="makeapp" value="Appointment">
	  </cfform>
	  
	  
	</cfoutput>
			</cfif>
	</cfif>

 	
</body>	 
	  
   
<cfinclude template = "footer.cfm">
</html>






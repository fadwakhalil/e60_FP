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
           

      			    <cfif Form.Grid.rowstatus.action[counter] is "U">
            			<cfquery name="UpdateExistingAppointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#"> 
                				UPDATE pappointment 
                				SET
                				PATIENTID=<cfqueryparam  value="#Form.Grid.PATIENTID[counter]#" CFSQLType="CF_SQL_CHAR" >,
                    			NEXTVISIT=TO_DATE('#Form.Grid.NEXTVISIT[counter]#','MM/DD/YYYY'),
	                    		APTIME=<cfqueryparam  value="#Form.Grid.APTIME[counter]#" CFSQLType="CF_SQL_CHAR" >,
                    			ESTDURATION=<cfqueryparam  value="#Form.Grid.ESTDURATION[counter]#" CFSQLType="CF_SQL_CHAR" >,
	                    		visited=<cfqueryparam  value="#Form.Grid.visited[counter]#" CFSQLType="CF_SQL_BOOLEAN" >,
	                    		paid=<cfqueryparam  value="#Form.Grid.paid[counter]#" CFSQLType="CF_SQL_BOOLEAN" >
	                    		WHERE appointmentid=<cfqueryparam value="#Form.Grid.original.appointmentid[counter]#" CFSQLType="CF_SQL_CHAR">
            			</cfquery>
            			<cfif #Form.Grid.paid[counter]# >
	            			<cfoutput>
	            				<cfmail from="fkhalil@dce.harvard.edu" to="fadwakhalil@gmail.com" subject="Paiment received">
	            					Thanks For Your Payment.
	            				</cfmail>
	            			</cfoutput>
            			</cfif>

                   </cfif>
           </cfloop>
	  </cfif> 

	  <cfoutput>


	  <cfquery name="getappointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    	SELECT app.appointmentid, app.patientid, to_char(app.nextvisit,'MM/DD/YYYY') as nextvisit, app.aptime, app.estduration, pac.price, app.visited, app.paid, pac.packageid, pac.duration, pac.price
	    	 FROM pappointment app, package pac where visited='true' 
	    	 and
	    	 pac.packageid=app.packageid
	    	 ORDER BY APPOINTMENTID
	  </cfquery>	  

  	  <cfif IsDefined("apptid")>
	  	  	<cfif IsNumeric(#apptid#)>
	    		<cfquery name="getappointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    	SELECT app.appointmentid, app.patientid, to_char(app.nextvisit,'MM/DD/YYYY') as nextvisit, app.aptime, app.estduration, pac.price, app.visited, app.paid, pac.packageid, pac.duration, pac.price
 			FROM pappointment app, package pac 
 			where visited='true' 
 			and
	 		pac.packageid=app.packageid
	 		and
	 		APPOINTMENTID=#apptid# ORDER BY APPOINTMENTID
	  			</cfquery>
	  		</cfif>
	  </cfif>

	  <cfquery name="getdu" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    			SELECT * FROM package 
	  </cfquery>
	  <cfset estdu = ValueList(getdu.duration)>

	  <cfform name="Form" action="invoice.cfm">
          <cfgrid name="Grid" query="getappointment" format="html"  colHeaderBold = "Yes" selectmode="edit" >
 
           		<cfgridcolumn name="appointmentid" header="Appointment ID" width=100 headeralign="center" headerbold="Yes"  display="Yes" >
          		<cfgridcolumn name="PATIENTID" header="PATIENTID" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="NEXTVISIT" header="NEXT VISIT" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="APTIME" header="TIME" width=100 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="ESTDURATION" header="DURATION" width=100 headeralign="center" headerbold="Yes" values="#estdu#" valuesdisplay="#estdu#" valuesdelimiter=",">
          		<cfgridcolumn name="PRICE" header="PRICE" width=100 headeralign="center" headerbold="Yes">
	          	<cfgridcolumn name="VISITED" header="VISITED?" width=100 headeralign="center" headerbold="Yes"  type="boolean">
	          	<cfgridcolumn name="PAID" header="PAID?" width=100 headeralign="center" headerbold="Yes"  type="boolean">
	          	 
          </cfgrid>
          <cfinput name="pacid" type="text" value="" autosuggest="cfc:suggestcfc.getLNames({cfautosuggestvalue})">
          <cfinput type="submit" name="gridEntered">
	  </cfform>

	</cfoutput>
 	
</body>	 
	  
   
<cfinclude template = "footer.cfm">
</html>






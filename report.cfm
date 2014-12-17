<html lang="">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=">
		<cfinclude template = "general.css">
		<cfinclude template = "header.cfm">  
  
 </head>
 <cfoutput>

<cfparam name="patid" default="AAA" type="string">
	  <cfquery name="getappointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    	SELECT * from patient
	  </cfquery>	  

  	  
  	  <cfif IsDefined("pacid")>
	  	  	<cfif IsNumeric(#pacid#)>
	    		<cfquery name="getappointment" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    			SELECT * from patient
	  			</cfquery>
	  		</cfif>
	  </cfif>

<cfquery name="getdu" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    			SELECT * FROM package 
	  			</cfquery>
<cfset estdu = ValueList(getdu.duration)>


	  <cfform name="Form" action="report.cfm">
          <cfgrid name="Grid" query="getappointment" format="html"  colHeaderBold = "Yes" selectmode="column" delete="Yes" deleteButton="Delete" insert="Yes" insertButton="Insert">
 
           		<cfgridcolumn name="NAME" header="NAME" width=100 headeralign="center" headerbold="Yes" select="Yes" >
          		<cfgridcolumn name="dob" header="dob" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="email" header="email" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="phone" header="phone" width=200 headeralign="center" headerbold="Yes">
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
          <cfinput type="submit" name="invoice" value="Invoices" >
	  </cfform>
</cfoutput>   
</body>	 
<cfinclude template = "footer.cfm">
</html>


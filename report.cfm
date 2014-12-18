<html lang="">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=">
		<cfinclude template = "general.css">
		<cfinclude template = "header.cfm">  
  
 </head>
 <body>	 

 <cfsetting enablecfoutputonly="Yes"> 

<cfoutput>
	    	  <cfquery name="getpatient" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    			SELECT		pat.patientid, pat.name, to_char(pat.dob,'MM/DD/YYYY') as dob, pat.phone, pat.email, 
	    						app.appointmentid, to_char(app.nextvisit,'MM/DD/YYYY') as nextvisit, 
	    						app.aptime, app.estduration, app.visited, pat.patientid, app.paid
	    			FROM 		pappointment app, patient pat
	    			ORDER BY	name
	  		  </cfquery>
<cfcontent type="application/msexcel"> 
<cfheader name="Content-Disposition" value="filename=Patients.xls"> 
<cfform name="Patients Report" method="post" format="html">      
<table cols="4"> 
            <tr> 
                <td>Patient ID</td>
                <td>Name</td>        
                <td>Date of Birth</td>  
                <td>Phone</td>  
                <td>Email</td>
                <td>Visit</td>
                <td>Time</td>
                <td>Visited?</td>
                <td>Paid?</td>
            </tr> 
                    <cfloop query="getpatient"> 
            <tr> 
                <td>#patientid#</td> 
                <td>#name#</td> 
                <td>#DoB#</td> 
                <td>#phone#</td> 
                <td>#email#</td> 
                <td>#nextvisit#</td> 
                <td>#estduration#</td> 
                <td>#visited#</td> 
                <td>#Paid#</td> 
                
            </tr> 
        </cfloop> 
    </table>
</cfform>  
</cfoutput>
</body>	 
<cfinclude template = "footer.cfm">
</html>


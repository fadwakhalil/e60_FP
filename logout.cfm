<!DOCTYPE html>
<html>  	  
<head>
      <cfinclude template = "general.css">
	  <cfinclude template = "header.cfm">  

</head>

<body>

	<cfif not IsDefined ("Session.userview")>
		<cfset Session.loggedIN = "No">
		<h8><a href="http://cscie60.dce.harvard.edu/~fkhalil/FP/login.cfm">Back to Login Page</a></h8>
	<cfelse>
		<h3><cfoutput><h8>See you again soon #Session.username#!</h8></cfoutput></h3>
		<cfset Session.loggedIN = "No">
		<h8><a href="http://cscie60.dce.harvard.edu/~fkhalil/FP/login.cfm">Back to Login Page</a></h8>
		<cfinclude template = "footer.cfm">
	</cfif>
	
</body>	 

</html>


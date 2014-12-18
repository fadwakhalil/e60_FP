<!DOCTYPE html>
<html>  	  
<head>
      <cfinclude template = "general.css">
	  <cfinclude template = "header.cfm">  

</head>

<body>

	<cfif IsDefined ("Form.userLogin")>
		<cfquery name="isValidLogin" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#"> 
			SELECT 	*
			FROM 	tblogin
			WHERE 	uname = '#Form.userLogin#'
			AND 	pwd = '#Form.userPassword#'
		</cfquery> 
	  	<cfif isValidLogin.RecordCount IS 0>
	  		<cflocation url="http://cscie60.dce.harvard.edu/~fkhalil/FP/login.cfm">
	  	<cfelse>
	  		<cfset Session.loggedIN = "YES">
	  		<cfset Session.username = "#isValidLogin.fname#">
	  		<cfset Session.userview = "#isValidLogin.userview#">
	  		<cfcookie name="userview" value="#Session.userview#">
	  		<cflocation url="http://cscie60.dce.harvard.edu/~fkhalil/FP/home.cfm" addtoken="no">
	  	</cfif>
	<cfelse>
		<form action="login.cfm" method="post">
			<table>
				<tr><th colspan="2" class="highlight"><h8>Please Log In</h8></th></tr>
					<tr>
						<td>Name:</td>
						<td>
							<input type="text" name="userLogin" /><br />
							<input type="hidden" name="userLogin_required" value="Please enter your USERNAME." >
						</td>
					</tr>
					<tr>
						<td>Password:</td>
						<td>
							<input type="text" name="userPassword" /><br />
							<input type="hidden" name="userPassword_required" value="Please enter your Password." >
						</td>
					</tr>
					<tr>
						<td>
							<input name="submit" type="submit" value="Login"/>
						</td>
					</tr>
			</table>
		</form>
	</cfif> 

	<h8><a href="http://cscie60.dce.harvard.edu/~fkhalil/FP/login.cfm">Back to Login Page</a></h8>
</body>	 
	  
<cfinclude template = "footer.cfm">
</html>




<!--- ########## Oracle Variables ########## --->
<cfparam name="Request.DSN" default="cscie60">
<cfparam name="Request.username" default="fkhalil">
<cfparam name="Request.password" default="5523">


<!--- ########## Application Variables ########## --->
<cfapplication name="Project Maintenance Application" clientmanagement="no" sessionmanagement="yes" setclientcookies="yes" setdomaincookies="no" sessiontimeout="#CreateTimeSpan(0,0,1,0)#" applicationtimeout="#CreateTimeSpan(0,0,2,0)#">


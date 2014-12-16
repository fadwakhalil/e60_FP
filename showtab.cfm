<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<title>Review Tables</title>
<cfinclude template = "general.css">
</head>
<body>
<cfinclude template = "header.cfm">
<cfquery name="getTab"
datasource="#Request.DSN#"
username="#Request.username#"
password="#Request.password#">
select * from tab
</cfquery>
<h3>Database Schema</h3>
<table>
<tr>
<th>Table Name</th>
</tr>
<cfoutput query="getTab">
<tr>
<td>#getTab.tname#</td>
</tr>
</cfoutput>
</table>
<cfinclude template = "footer.cfm">
</body>
</html>
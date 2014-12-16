 <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
    <head>
      <cfinclude template = "general.css">
	  <cfinclude template = "header.cfm">  

</head>
    <body>

		<table>
			<tr>
				<th>Document</th>
				<th>View</th>
			</tr>
				<tr>
				<td>Skin Care</td>
				<td><a href="http://cscie60.dce.harvard.edu/~fkhalil/FP/home.cfm">View</a></td>
			</tr>
			<tr>
				<td>Body Care</td>
				<td><a href="http://cscie60.dce.harvard.edu/~fkhalil/FP/home.cfm">View</a></td>
				
			</tr>
				<tr>
				<td>Meditation</td>
				<td><a href="http://cscie60.dce.harvard.edu/~fkhalil/FP/home.cfm">View</a></td>
			</tr>
			<tr>
				<td>Sun Damage</td>
				<td><a href="http://cscie60.dce.harvard.edu/~fkhalil/FP/home.cfm">View</a></td>
			</tr>
			<tr>
				<td>Exercise</td>
				<td><a href="http://cscie60.dce.harvard.edu/~fkhalil/FP/home.cfm">View</a></td>
			</tr>
		</table>
		
<cfif isDefined("fileUpload")>
  <cffile action="upload" fileField="fileUpload" destination="/home/courses/f/k/fkhalil/FP" nameConflict = "overwrite">
     <p>Thankyou, your file has been uploaded.</p>
</cfif>
<form enctype="multipart/form-data" method="post">
<input type="file" name="fileUpload" /><br />
<input type="submit" value="Upload File" />
</form>

    </body>
    <cfinclude template = "footer.cfm">
</html>
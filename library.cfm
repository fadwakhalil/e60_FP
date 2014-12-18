 <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
    <head>
      <cfinclude template = "general.css">
	  <cfinclude template = "header.cfm">  

</head>
    <body>
 
 
<cfset UploadFolder="/home/courses/f/k/fkhalil/wwwroot-tmp">  
<cfif IsDefined("Form.UploadFile") AND Form.UploadFile NEQ "">  
 <cffile action="upload" filefield="UploadFile" destination="#UploadFolder#" nameconflict="overwrite" accept = "image/jpg, application/msword, application/pdf">  
 File uploaded successfully!  
    <br />  
    Uploaded file: <cfoutput>#cffile.ClientFile#</cfoutput>  
<cfelse>  
 Select a file first!          
</cfif>  

<form name="UploadForm" method="post" enctype="multipart/form-data" action="">  
 <input type="file" name="UploadFile">  
    <input type="submit"  name="submit" value="Upload"/>  
</form>  
 
<CFSET filepath = "/home/courses/f/k/fkhalil/wwwroot-tmp"> 
<cfif IsDefined("Form.DownloadFile") AND Form.DownloadFile NEQ "">  
<cfheader name="Content-Disposition"  value="attachment" > 
<cfcontent type="application/msword" file="/home/courses/f/k/fkhalil/wwwroot-tmp/dcscsdcsdc.doc" deletefile="No">  
 </cfif>  

 <form name="DownloadForm" method="post" enctype="multipart/form-data" action="">  
 <input type="file" name="DownloadFile">  
    <input type="submit"  name="submit" value="Download"/>  
 </form>  
    
<cfparam name="url.sort" default="datelastmodified desc">
<cfdirectory directory="#ExpandPath("./")#" action="list" name="dir" sort="#url.sort#">

<table width="50%" cellpadding="0" cellspacing="0">
	<tr>
		<th>Name <a href="?sort=name" class="sort" title="Sort By Name">∨</a></th>
		<th>Size (bytes) <a href="?sort=size" class="sort" title="Sort By Size">∨</a></th>
		<th>Last Modified <a href="?sort=datelastmodified+desc" class="sort" title="Sort By Date">∨</a></th>
	</tr>
	<cfoutput query="dir">
	<cfif dir.name IS NOT "library.cfm">
	<tr>
		<td><a href="#dir.name#">#dir.name#</a></td>
		<td>#dir.size#</td>
		<td>#dir.datelastmodified#</td>
	</tr>
	</cfif>
	</cfoutput>
</table>
  
    </body>
    <cfinclude template = "footer.cfm">
</html>
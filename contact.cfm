    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
    <head>
      <cfinclude template = "general.css">
	  <cfinclude template = "header.cfm">  

</head>
    <body>
<cfif IsDefined("form.mailto")> 
    <cfif form.mailto is not "" AND form.mailfrom is not "" AND form.Subject is not ""> 
        <cfmail to = "#form.mailto#" from = "#form.mailFrom#" subject = "#form.subject#"> 
                This message was sent by an automatic mailer built with cfmail: 
                = = = = = = = = = = = = = = = = = = = = = = = = = = = 
                #form.body# 
        </cfmail>  
        <h3>Thank you</h3> 
        <p>Thank you, <cfoutput>#mailfrom#: your message, #subject#, has been sent to 
            #mailto#</cfoutput>.</p> 
    </cfif>    
</cfif> 
<p> 
<form action = "contact.cfm" method="POST"> 
    <pre> 
    TO: <input type = "Text" name = "MailTo"> 
    FROM: <input type = "Text" name = "MailFrom"> 
    SUBJECT:     <input type = "Text" name = "Subject"> 
    <hr> 
    MESSAGE BODY: 
    <textarea name ="body" cols="40" rows="5" wrap="virtual"></textarea> 
    </pre> 
    <!--- Establish required fields. ---> 
    <input type = "hidden" name = "MailTo_required" value = "You must enter a recipient"> 
    <input type = "hidden" name = "MailFrom_required" value = "You must enter a sender"> 
    <input type = "hidden" name = "Subject_required" value = "You must enter a subject"> 
    <input type = "hidden" name = "Body_required" value = "You must enter some text"> 
    <p><input type = "Submit" name = ""></p> 
</p> 
</form> 
    </body>
    <cfinclude template = "footer.cfm">

    </html>
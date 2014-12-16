<cfparam name="Form.selectdate" default="#dateformat(now(), 'mm/dd/yyyy')#">

<cfif isDefined("Form.submitit")>
    <cfoutput><b>You selected #Form.selectedDate#</b><br><br></cfoutput>
</cfif>

<b>Please select a date on the calendar and click Save.</b><br>
<br>
<cfform name="form1" format="html" skin="haloBlue" width="375" height="350" >
    <cfcalendar name="selectedDate" selectedDate="#Form.selectdate#" mask="mmm dd, yyyy" 
        dayNames="SU,MO,TU,WE,TH,FR,SA"
        monthNames="JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC"
        style="rollOverColor:##FF0000"
        width="200" height="150">
    <cfinput type="dateField" name="selectdate" label="Initial date" width="100"
        value="#Form.selectdate#" >
    <cfinput type="Submit" name="submitit" value="Save" width="100"> 
</cfform>

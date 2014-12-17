<!DOCTYPE html>
<html>  	  
<head>
      <cfinclude template = "general.css">
	  <cfinclude template = "header.cfm">  

</head>

<body>

	  <cfif isdefined("Form.Grid.rowstatus.action")> 
           <cfloop index = "counter" from = "1" to = #arraylen(Form.Grid.rowstatus.action)#>
           
	                   <cfoutput> 
            				The row action for #counter# is: 
          					#Form.Grid.rowstatus.action[counter]# 
            				<br> 
        				</cfoutput> 
           
           
                   <cfif Form.Grid.rowstatus.action[counter] is "D">
                        <cfquery name="DeleteExistingPackage" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#" >
                                DELETE FROM package
                                WHERE packageid=<cfqueryparam value="#Form.Grid.original.packageid[counter]#" CFSQLType="CF_SQL_INTEGER" >
                        </cfquery>

        			<cfelseif Form.Grid.rowstatus.action[counter] is "I">
	        			<cfoutput>
                        <cfquery name="InsertNewPackage" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#" >
                        	INSERT INTO package 
                        	VALUES 
                        	(<cfqueryparam  value="#Form.Grid.packageid[counter]#" CFSQLType="CF_SQL_VARCHAR" >, 
                        	<cfqueryparam  value="#Form.Grid.duration[counter]#" CFSQLType="CF_SQL_VARCHAR" >, 
                        	<cfqueryparam  value="#Form.Grid.price[counter]#" CFSQLType="CF_SQL_VARCHAR" > 
                        	)
	                    </cfquery>
                        </cfoutput>
                        
        			<cfelseif Form.Grid.rowstatus.action[counter] is "U">
            			<cfquery name="UpdateExistingPackage" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#"> 
                				UPDATE package 
                				SET
                				packageid=<cfqueryparam  value="#Form.Grid.packageid[counter]#" CFSQLType="CF_SQL_VARCHAR" >,
                    			duration=<cfqueryparam  value="#Form.Grid.duration[counter]#" CFSQLType="CF_SQL_VARCHAR" >,
	                    		price=<cfqueryparam  value="#Form.Grid.price[counter]#" CFSQLType="CF_SQL_VARCHAR" >
	                    		
	                    		WHERE packageid=<cfqueryparam value="#Form.Grid.original.packageid[counter]#" CFSQLType="CF_SQL_INTEGER"> 
            			</cfquery> 
                   </cfif>
           </cfloop>
	  </cfif> 


	<cfoutput>

	    	<cfquery name="getpackage" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    		SELECT * FROM package ORDER BY packageid
	  		</cfquery>
	   	  <cfif IsDefined("packid")>
	  	  	<cfif IsNumeric(#packid#)>
	    	<cfquery name="getpackage" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
	    		SELECT * FROM package where packageid=#packid# ORDER BY packageid
	  		</cfquery>	  
	  </cfif>
	  </cfif>
	
	  
	  <cfform name="Form" action="package.cfm">
          <cfgrid name="Grid" query="getpackage" format="html"  colHeaderBold = "Yes" selectmode="edit" delete="Yes" deleteButton="Delete" insert="Yes" insertButton="Insert">
          		<cfgridcolumn name="duration" header="duration" width=200 headeralign="center" headerbold="Yes">
          		<cfgridcolumn name="price" header="Price" width=200 headeralign="center" headerbold="Yes">
	                    		
          		<cfgridcolumn name="packageid" header="Package ID" width=100 headeralign="center" headerbold="Yes"  display="Yes" >
           </cfgrid>
 		  <cfinput type="submit" name="gridEntered" value="Submit the change">
 	  </cfform>
	 </cfoutput>
		  
 	
</body>	 
	  
   
<cfinclude template = "footer.cfm">
</html>






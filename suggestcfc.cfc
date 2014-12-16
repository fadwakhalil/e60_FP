<cfcomponent>
    <cffunction name="getLNames" access="remote" returntype="array" output="false">
        <cfargument name="suggestvalue" required="true">
        <cfset var myarray = ArrayNew(1)>
        <cfquery name="getDBNames" datasource="#Request.DSN#" username="#Request.username#" password="#Request.password#">
        SELECT DISTINCT name FROM patient
        WHERE name LIKE <cfqueryparam value="#suggestvalue#%"
            cfsqltype="cf_sql_varchar">
        </cfquery>
        <!--- Convert the query to an array. --->
        <cfloop query="getDBNames">
            <cfset arrayAppend(myarray, name)>
        </cfloop>
        <cfreturn myarray>
    </cffunction>    
 </cfcomponent>
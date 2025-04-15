# ZenikaAssignment

## Database
The MySQL database is hosted on Clever Cloud.

There are 3 tables
 - Cafes [ID(pk), NAME, DESCRIPTION, LOCATION]
 - Employees [ID(pk), NAME, EMAIL, PHONE, GENDER]
 - Employments [CAFE_ID, EMPLOYEE_ID, START_DATE, END_DATE]

The Employments table is meant to keep a record of all employment history.

Employments where END_DATE is null indicates a current employment.

## ASP.NET Backend
The backend server connects directly to the database on Clever Cloud.

The connection string can be found in appsettings.json.

Opening the project in Visual Studio 2022 and running it will start the server and display a Swagger UI.

## React Vite Frontend
The react app can be run with "npm run dev".

(the project has not been tested for production due to time constraints)

In the Employees Page, clicking on the cafe button of each row displays that employee's employment history.

This is where they can be fired or hired.

## Considerations
NOTE: The database is hosted on a free tier of Clever Cloud and is only allowed 5 concurrent connections.


CORS issues were encountered but mostly mitigated by adding a policy to allow origin "http://localhost:5173", and also using only GET or POST methods on the front end.


In hindsight, the database structure was overcomplicated for the scenario.

It would have been sufficient to have the Employee table store a CafeID and StartDate.

The overcomplication resulted in a slightly different way of managing employments than was requested in the assignment.

## Known Issues
When creating a new Cafe or Employee, an api is used to get the next ID.

This function looks for the Max value of the ID column, parses the numerical part, and increments it by 1.

A problem occurs because employment history is persistent .

So deleting the top-most row of a table, means that the next row created will take on the same ID.

A possible mitigation would be to implement an ID tracking table that increments everytime a new row is created.


The antd toast message doesn't seem to be working for this project for some reason.

You may notice a WeatherforecastController, which was created by the ASP web api template. (It can be ignored)

## Conclusion
Many of these frameworks were new to me, so hopefully I was able to implement the best practices.

Given more time the application could definitely be improved, given that it was my first time implementing many of these things.

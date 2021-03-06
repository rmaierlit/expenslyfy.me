# expenslyfy.me
An expense tracking application

## How to get started:
* Run npm install.
* Run webpack.
* Run mysql -u root < server/db/schema.sql to initialize the database (mysqld must be running).
* Run npm start to launch the server.
* Run npm test for mocha tests.
* Navigate to localhost:6565 in a browser to view the app.

## Using the App:
Username and password are required to log in.
Try using these three:
* Wint (password: ‘@dril’)
* Ulysses (password: ‘metis’)
* Juno (password: ‘gr8h8r’)

Only Juno has admin permissions.

#### Login
Enter a username and matching password, then click the Login button.
The screen will now display “Logged In As [User]”.

Here you can create reports, view your expenses, and add or delete expenses.

#### Reports
Create reports with the “Create Report” button.
This sends a requests to the server and displays the results.
Enter a minimum or a maximum datetime to limit the expenses within the report.

Get rid of the report by clicking “discard” below the report.
You can now create a new report.

#### Expenses
Expenses are displayed ordeed by transaction date.
Click the ‘x’ next to a report to delete it.

At the bottom of the screen is the Add Expense panel.
Enter an amount and a description for the expense, then click “Create New Expense”.
You must have a number for the amount; the client will warn you otherwise.

If you are an admin user, there will be a selection box to let you view other users.
However, the delete and add expense ui will not be visibile for those users.
You can still create reports, but they will be for your own expenses, not those of the viewed user.

#### Logout
Click the “Logout” button near the top of the screen to discard your web token and log out.

### Security Concerns
Password hashing is not implemented at this point.

Since username and password are sent in an http body, requests should be encrypted with https for production use.

### Updating expenses
This is possible on the back-end (through a PUT request on /users/[user]/expenses[expenseId]), but the interface for updating these expenses is not currently impemented on the front-end.

WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database 
WHEN I choose to update an employee role 
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

   INSERT INTO votes (voter_id, candidate_id) 
VALUES(3,1), (4,2), (5,2), (6,2), (7,2), (8,3), (9,3);

SELECT COUNT(candidate_id) FROM votes;

SELECT COUNT(candidate_id) FROM votes GROUP BY candidate_id;

SELECT COUNT(candidate_id) FROM votes GROUP BY candidate_id;

SELECT candidates.*, parties.name AS party_name, COUNT(candidate_id)
FROM votes
LEFT JOIN candidates ON votes.candidate_id = candidates.id
LEFT JOIN parties ON candidates.party_id = parties.id
GROUP BY candidate_id;

THIS IS THE JAVASCRIPT PART OF YOUR PROJECT 

const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

router.post('/vote', ({ body }, res) => {
  // Data validation
  const errors = inputCheck(body, 'voter_id', 'candidate_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO votes (voter_id, candidate_id) VALUES (?,?)`;
  const params = [body.voter_id, body.candidate_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body,
      changes: result.affectedRows
    });
  });
});

module.exports = router;

router.use(require('./voteRoutes'));

BACK TO SQL / schema 

CREATE TABLE votes (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  voter_id INTEGER NOT NULL,
  candidate_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
);
Because we might make other edits to the schema during this lesson, we should add a DROP TABLE IF EXISTS statement at the top of the file. It is very important that we drop the tables in the following order:

DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS voters;

CREATE TABLE votes (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  voter_id INTEGER NOT NULL,
  candidate_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uc_voter UNIQUE (voter_id),
  CONSTRAINT fk_voter FOREIGN KEY (voter_id) REFERENCES voters(id) ON DELETE CASCADE,
  CONSTRAINT fk_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

USE election;
source db/schema.sql
source db/seeds.sql
Next, run the following SQL statements in the MySQL command line, one at a time:

INSERT INTO votes (voter_id, candidate_id) VALUES(1, 1);
INSERT INTO votes (voter_id, candidate_id) VALUES(2, 1);
INSERT INTO votes (voter_id, candidate_id) VALUES(2, 2);

DELETE FROM voters WHERE id = 2;
SELECT * FROM votes;

Create POST Route
First, let's implement the POST request. Assuming the front end will send us the user's first name, last name, and email address, we can write the route to appear like the following code:

router.post('/voter', ({ body }, res) => {
  const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.email];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});
The ? prepared statements will protect us from malicious data, but we should also do our best to prevent blank records from being created. In the same POST route, add the following code right before the sql variable declaration:

// Data validation
const errors = inputCheck(body, 'first_name', 'last_name', 'email');
if (errors) {
  res.status(400).json({ error: errors });
  return;
}

NEW JAVA SCRIPT 

router.put('/voter/:id', (req, res) => {
  // Data validation
  const errors = inputCheck(req.body, 'email');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE voters SET email = ? WHERE id = ?`;
  const params = [req.body.email, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Voter not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

Create DELETE Route
Lastly, we need a DELETE route to remove voters from the database. Add the following route to the voterRoutes.js file:

router.delete('/voter/:id', (req, res) => {
  const sql = `DELETE FROM voters WHERE id = ?`;

  db.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Voter not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

Remember to test a few of the GET routes, as well, so you can see that your changes are, in fact, taking effect!

Once you're happy with the results, git add and git commit your progress, then git push the feature branch, as follows:

git add .
git commit -m "added voter routes"
git push origin feature/voters
Because there is nothing left to do on this GitHub issue, you can also close it and git merge the feature branch into develop, as follows:

git checkout develop
git merge feature/voters
git push origin develop
Finally, let's merge develop into the main branch, as follows:

git checkout main
git merge develop


Prepare index.js and voterRoutes.js
In index.js, add the voter routes alongside the other require() expressions, as shown in the following code:

router.use(require('./voterRoutes'));
In the voterRoutes.js file, import the necessary modules by adding the following code:

const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');
Create GET Route for Voters
Next, create a GET route for /voters. This route will perform a SELECT * FROM voters and return the rows on success or a 500 status if there were errors.

The route should look like the following code:

router.get('/voters', (req, res) => {
  const sql = `SELECT * FROM voters`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});
Finally, export the router object by adding the following line of code:

module.exports = router;
Restart the Node.js server and test the route with Insomnia Core. Remember that the full route is /api/voters due to the prefix that's defined in server.js. The GET request in Insomnia Core will look like the following image:

Add Sort Option to Return Voters in Alphabetical Order
This is great, but we're not done yet. The front-end team wanted the data returned in alphabetical order by last name. We could use JavaScript and the Array.prototype.sort() method before sending the response back, but why do that when SQL has sort options built in?

Update the sql variable to look like the following code:

const sql = `SELECT * FROM voters ORDER BY last_name`;
In SQL, rows can be sorted on retrieval simply by including an ORDER BY clause. If you want to sort the data in descending order (i.e., starting at Z instead of A), you can add a DESC keyword (e.g., ORDER BY last_name DESC).

Restart the Node.js server and make the same GET request again. This time, the data should be sorted alphabetically by last name, as shown in the following image:

Now that we have a route for all voters, let's create a route for individual voters.

In voterRoutes.js, add the following code:

// Get single voter
router.get('/voter/:id', (req, res) => {
  const sql = `SELECT * FROM voters WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});
As always, save and restart the Node.js server, then test the route in Insomnia Core using a voter id of 10. 

Modularize Database Connection Code
First, we'll modularize the database connection logic.

Create a new file located at db/connection.js.

Remove the following lines of code from server.js and add them to connection.js:

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: '',
  database: 'election'
});
Because this file is its own module now, you'll need to export it by adding the following code at the bottom of the file:

module.exports = db;
Back in server.js, import this new module by adding the following variable declaration at the top of the file:

const db = require('./db/connection');
Let's make sure that nothing broke in the transition. Start the Node.js server again with npm start and test one of your existing routes (for example, /api/candidates). If you see anything unusual, use your debugging skills and review your recent changes.

Some questions you can ask yourself as you debug are:

Are the files in the right places?

Is the module.exports and require syntax correct?

Did you make any typos?

Once you have everything working properly, we'll move on to modularizing the routes code.

Modularize Routes Code
Now we'll modularize the routes code.

In the project root folder, create a new folder called routes.

Inside that folder, create another folder called apiRoutes. It probably seems unnecessary to create a folder two levels deep, but this leaves space for the front-end team to eventually make a routes/htmlRoutes folder.

In the routes/apiRoutes directory, create the following files:

index.js

candidateRoutes.js

partyRoutes.js

voterRoutes.js

Notice that each route file matches one of the tables, adhering to separation of concerns.

Add Routes to the Route Files
Now we'll add the routes to each route file.

Add Code to index.js
The index.js file will act as a central hub to pull them all together. Open index.js and add the following code:

const express = require('express');
const router = express.Router();

router.use(require('./candidateRoutes'));

module.exports = router;
We'll only import the candidate routes for now to make it easier to test as we shuffle things around.

Add Code to server.js
In server.js, add the following two lines:

// Add near the top of the file
const apiRoutes = require('./routes/apiRoutes');

// Add after Express middleware
app.use('/api', apiRoutes);
By adding the /api prefix here, we can remove it from the individual route expressions after we move them to their new home.

Add Code to candidateRoutes.js
Open candidateRoutes.js and add the following declarations at the top of the file:

const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');
Next, remove all of the candidate-related routes from server.js and add them here. You'll need to make a few modifications, though. Namely, the app object should be changed to router, and the route URLs don't need to include '/api' anymore because that prefix is defined in server.js.

At a glance, the routes in candidateRoutes.js should now look like the following code:

// originally app.get('/api/candidates')
router.get('/candidates', (req, res) => {
  // internal logic remains the same
});

// originally app.get('/api/candidate/:id')
router.get('/candidate/:id', (req, res) => {});

// originally app.post('/api/candidate')
router.post('/candidate', ({ body }, res) => {});

// originally app.put('/api/candidate/:id')
router.put('/candidate/:id', (req, res) => {});

// originally app.delete('/api/candidate/:id')
router.delete('/candidate/:id', (req, res) => {});
Finally, export the router object with the following code:

module.exports = router;
This is a great time to restart the Node.js server and test the routes again. Make a GET request to /api/candidates. If all is well, nothing about using the API endpoint should have changed.

Add Code to partyRoutes.js
Let's complete the same process now for the party routes.

In index.js, add the following line of code:

router.use(require('./partyRoutes'));
In partyRoutes.js, add the necessary module declarations and move the relevant routes from server.js, renaming them as you go. The partyRoutes.js file should look like the following code block when you're done:

const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// Get all parties
router.get('/parties', (req, res) => {
  // internal logic remains the same
});

// Get single party
router.get('/party/:id', (req, res) => {});

// Delete a party
router.delete('/party/:id', (req, res) => {});

module.exports = router;
Test the party API endpoints again to verify that nothing broke.

Review the Streamlined server.js File
After all of these changes, the server.js file should be very minimal now, as shown in the following code block:

const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
Phew! It feels good to do some spring cleaning before the voting app gets too large! Now we're in a better place to start adding even more routes.

Save your work, then add, commit, and push to GitHub. Let's create the routes for the voters!

Create Voters Table
Let's go ahead and map out the voters table in schema.sql using the following statement to define the table and its constraints:

CREATE TABLE voters (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  email VARCHAR(50) NOT NULL
);
Note that there's no mention of candidates anywhere. What do candidates have to do with the existence of voters? Nothing—so we won't include them in this table! When it comes time to vote, we'll create a separate table for that.

The U Develop It folks did mention that they wanted to track when voters registered, though, so we should probably add one more field to capture that. If you already ran the script to create the table, that's okay. Just add a DROP TABLE IF EXISTS voters; statement to the top of schema.sql.

Add a statement at the end of the voters creation SQL to capture the date and time when the voter registered, as shown in the following code block:

CREATE TABLE voters (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  email VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
As you can see, we added a new field, created_at, with a data type of DATETIME. In SQL, a DATETIME field's value will look something like 2020-01-01 13:00:00. That probably doesn't seem very user-friendly, but the front-end team can take that value, convert it with JavaScript's Date() constructor, and display anything they want at that point.

There are two other important keywords in there that you might not recognize:

DEFAULT: If you don't specify NOT NULL, then a field could potentially be NULL if that value isn't provided in an INSERT statement. With DEFAULT, however, you can specify what the value should be if no value is provided.

CURRENT_TIMESTAMP: This will return the current date and time in the same 2020-01-01 13:00:00 format. Note that the time will be based on what time it is according to your server, not the client's machine.

So, in our code we're specifying CURRENT_TIMESTAMP as the value for DEFAULT.

Add Voters to the Table
Next, add the following INSERT statements to your seeds.sql file (brace yourself—there are a lot of voters!):

INSERT INTO voters (first_name, last_name, email)
VALUES
  ('James', 'Fraser', 'jf@goldenbough.edu'),
  ('Jack', 'London', 'jlondon@ualaska.edu'),
  ('Robert', 'Bruce', 'rbruce@scotland.net'),
  ('Peter', 'Greenaway', 'pgreenaway@postmodern.com'),
  ('Derek', 'Jarman', 'djarman@prospectcottage.net'),
  ('Paolo', 'Pasolini', 'ppasolini@salo.com'),
  ('Heathcote', 'Williams', 'hwilliams@bafta.com'),
  ('Sandy', 'Powell', 'spowell@oscars.com'),
  ('Emil', 'Zola', 'ezola@requin.com'),
  ('Sissy', 'Coalpits', 'scoalpits@greenaway.com'),
  ('Antoinette', 'Capet', 'acapet@dontloseyourhead.com'),
  ('Samuel', 'Delany', 'sdelany@dhalgren.com'),
  ('Tony', 'Duvert', 'tduvert@frenchletters.edu'),
  ('Dennis', 'Cooper', 'dcooper@georgemiles.com'),
  ('Monica', 'Bellucci', 'mbell@irreverisble.net'),
  ('Samuel', 'Johnson', 'sjohnson@boswell.com'),
  ('John', 'Dryden', 'jdryden@restoration.net'),
  ('Alexander', 'Pope', 'apope@cambridge.uk.edu'),
  ('Lionel', 'Johnson', 'ljohnson@darkangel.com'),
  ('Aubrey', 'Beardsley', 'abeardsely@wilde.net'),
  ('Tulse', 'Luper', 'tluper@films.net'),
  ('William', 'Morris', 'wmorris@victoriana.com'),
  ('George', 'Shaw', 'gshaw@labor.uk'),
  ('Arnold', 'Bennett', 'abennett@poemsgalore.com'),
  ('Algernon', 'Blackwood', 'ablack@creepy.net'),
  ('Rhoda', 'Broughton', 'rb@feminist.com'),
  ('Hart', 'Crane', 'hcrane@schwesters.de'),
  ('Vitorio', 'DeSica', 'vdesica@italiano.net'),
  ('Wilkie', 'Collins', 'wcollins@madmonkton.com'),
  ('Elizabeth', 'Gaskell', 'egaskell@pages.net'),
  ('George', 'Sand', 'gsand@pride.com'),
  ('Vernon', 'Lee', 'vlee@spooks.net'),
  ('Arthur', 'Machen', 'amach@spirits.com'),
  ('Frederick', 'Marryat', 'fmarry@boats.net'),
  ('Harriet', 'Martineau', 'hmartineau@journalism.com'),
  ('George', 'Meredith', 'gm@egoist.uk'),
  ('Margaret', 'Oliphant', 'moli@victoriana.com'),
  ('Anthony', 'Trollope', 'atrollope@barchester.com'),
  ('Charlotte', 'Yonge', 'cyonge@newday.com'),
  ('Horace', 'Walpole', 'hwal@otranto.net'),
  ('Matthew', 'Lewis', 'mlewis@monk.com'),
  ('William', 'Bedford', 'wbed@grandtour.net'),
  ('Anne', 'Radcliffe', 'arad@udolpho.uk'),
  ('Charles', 'Brown', 'cbrown@wieland.us'),
  ('Eliza', 'Parsons', 'lizzie@fierce.net'),
  ('Susan', 'Hill', 'shill@womaninblack.net'),
  ('Sydney', 'Owenson', 'Sowen@think.net'),
  ('Hubert', 'Crackanthorpe', 'hcrackan@goodletters.com'),
  ('William', 'Carleton', 'wcarleton@literature.com'),
  ('Gerald', 'Griffin', 'ggriff@lit.net');
Rebuild and seed the database using the MySQL CLI. You can check that your MySQL Server is running and initiate the MySQL CLI by typing the following in your command line:

mysql -u root -p
Enter your MySQL password when prompted. Then, at the MySQL CLI prompt, switch to the election database by typing the following command:

USE election;
Then rebuild and seed the database by running the following commands:

source db/schema.sql
source db/seeds.sql
Next, test your efforts by running a few SELECT queries from the MySQL CLI. You can use the following examples or write your own:

SELECT * FROM voters;
SELECT first_name, last_name FROM voters;
SELECT email FROM voters WHERE id = 1;

server.js 

In server.js, add a new route alongside the other /api/candidate routes to handle updates, as shown in the following code:

// Update a candidate's party
app.put('/api/candidate/:id', (req, res) => {
  const sql = `UPDATE candidates SET party_id = ? 
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});
This route might feel a little strange because we're using a parameter for the candidate's id (req.params.id), but the request body contains the party's id (req.body.party_id). Why mix the two? Again, we want to follow best practices for consistency and clarity. The affected row's id should always be part of the route (e.g., /api/candidate/2) while the actual fields we're updating should be part of the body.

If the front end will be making this request, though, then we should be extra sure that a party_id was provided before we attempt to update the database. Let's leverage our friend's inputCheck() function again to do so.

Add the following block of code right before the sql variable declaration:

const errors = inputCheck(req.body, 'party_id');

if (errors) {
  res.status(400).json({ error: errors });
  return;
}
This now forces any PUT request to /api/candidate/:id to include a party_id property. Even if the intention is to remove a party affiliation by setting it to null, the party_id property is still required.

Let's test this out. Restart your Node.js server, then open Insomnia Core. Change the request type to PUT and the URL to http://localhost:3001/api/candidate/1. Add a JSON body that includes a party_id property. Then click Send!

In server.js, add the following route for all parties:

app.get('/api/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});
Next, add a second route that includes an id parameter for a single party, as shown in the following code:

app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});
The only other CRUD operation required by the front end is to delete parties. Building a delete route will give us an opportunity to test the ON DELETE SET NULL constraint effect through the API.

Add the following third and final route to server.js:

app.delete('/api/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Party not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

CREATE TABLE parties (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

Now that we have a table, let's add some data to it. Run the following INSERT statement in MySQL Shell, then add it to the seeds.sql file:

INSERT INTO parties (name, description)
VALUES
  ('JS Juggernauts', 'The JS Juggernauts eat, breathe, and sleep JavaScript. They can build everything you could ever want in JS, including a new kitchen sink.'),
  ('Heroes of HTML', 'Want to see a mock-up turn into an actual webpage in a matter of minutes? Well, the Heroes of HTML can get it done in a matter of seconds.'),
  ('Git Gurus', 'Need to resolve a merge conflict? The Git Gurus have your back. Nobody knows Git like these folks do.');
Next, open MySQL Shell and run a few test SELECT queries to check that the table populated correctly. You might want to try the following queries:

SELECT * FROM parties;
SELECT * FROM parties WHERE id = 1;
SELECT name, description FROM parties WHERE id = 3;



Let's say that the first candidate we inserted into the database, Ronald Firbank, is a JavaScript wizard and belongs to the JS Juggernauts Party. How do we establish that relationship between two tables? We can add the party's id to the candidates table!

This is known as a foreign key. A foreign key is a field in one table that references the primary key of another table. In this case, Ronald Firbank's row in candidates would include a field with the number 1, but we'd know that that refers to a row in the parties table with the same id value. Take a look at the following image to better understand the relationship:

A diagram illustrates the relationship of a candidates row to a parties row using a foreign key.

Currently, the candidates table isn't set up to accommodate a foreign key. We'll need to add a new field to the table. Unfortunately, we already ran the schema to create the table. How can we add a new field without losing any of the existing data?

Enter the ALTER TABLE statement. This statement allows you to add a new field, delete an existing field, or modify a field.

In MySQL Shell, run the following statement:

ALTER TABLE candidates ADD COLUMN party_id INTEGER;
Note that we didn't include NOT NULL, as some candidates might not be affiliated with a party.

Now if you run DESCRIBE candidates; from MySQL Shell, you'll see that the candidates table has been updated, as shown in the following image:

The MySQL command line shows that the schema has been updated with a party_id.

Awesome, we've successfully prepped the candidates table with a foreign key. However, we should still update the original schema in schema.sql so other developers will have the correct starting point. While we're at it, let's make a few other adjustments.

In schema.sql, change the candidates table to look like the following:

CREATE TABLE candidates (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  party_id INTEGER,
  industry_connected BOOLEAN NOT NULL,
  CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
);
We've added a new line to the table called a constraint. This allows us to flag the party_id field as an official foreign key and tells SQL which table and field it references. In this case, it references the id field in the parties table. This ensures that no id can be inserted into the candidates table if it doesn't also exist in the parties table. MySQL will return an error for any operation that would violate a constraint.

IMPORTANT
Because this constraint relies on the parties table, the parties table MUST be defined first before the candidates table. Make sure to order your tables in schema.sql correctly.

Because we've established a strict rule that no candidate can be a member of a party that doesn't exist, we should also consider what should happen if a party is deleted. In this case, we added ON DELETE SET NULL to tell SQL to set a candidate's party_id field to NULL if the corresponding row in parties is ever deleted.

Should we start testing this yet? Unfortunately, we made a change to the schema that isn't actually in effect, because candidates already exists. We could use ALTER TABLE again, but at this point, it would probably be easier to just trash the tables and start over.

In SQL, you can delete a table using the DROP TABLE statement. We'll most likely need to drop the tables many times as we continue to build out the database, so let's factor that into the schema.sql file.

ON THE JOB
When you're developing an application locally it's okay to drop and re-create databases and tables freely, and delete data as necessary. However, as soon as your application "goes live" to other developers, customers, or the general public, these operations become very risky. Most businesses have teams devoted to database operations, who will take over the security and management of databases after they emerge from the development stage.

Add the following two lines at the top of schema.sql:

DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;
This will drop/delete the tables every time you run the schema.sql file, ensuring that you start with a clean slate.

IMPORTANT
As noted previously, the order of table creation is vital due to the dependency of the candidates table on the existence of a parties.id. In the same regard, the candidates table must be dropped before the parties table due to the foreign key constraint that requires the parties table to exist.

Let's also update the seeds.sql file so that the initial candidates have valid party_id values. Remember, the parties will need to be created first, or the INSERT statements will fail due to the foreign key constraint we added to the candidates schema.

The seeds.sql file should now look like the following in total:

INSERT INTO parties (name, description)
VALUES
  ('JS Juggernauts', 'The JS Juggernauts eat, breathe, and sleep JavaScript. They can build everything you could ever want in JS, including a new kitchen sink.'),
  ('Heroes of HTML', 'Want to see a mock-up turn into an actual webpage in a matter of minutes? Well, the Heroes of HTML can get it done in a matter of seconds.'),
  ('Git Gurus', 'Need to resolve a merge conflict? The Git Gurus have your back. Nobody knows Git like these folks do.');

INSERT INTO candidates (first_name, last_name, party_id, industry_connected)
VALUES
  ('Ronald', 'Firbank', 1, 1),
  ('Virginia', 'Woolf', 1, 1),
  ('Piers', 'Gaveston', 1, 0),
  ('Charles', 'LeRoi', 2, 1),
  ('Katherine', 'Mansfield', 2, 1),
  ('Dora', 'Carrington', 3, 0),
  ('Edward', 'Bellamy', 3, 0),
  ('Montague', 'Summers', 3, 1),
  ('Octavia', 'Butler', 3, 1),
  ('Unica', 'Zurn', NULL, 1);
To make these changes to the database, we'll run the schema.sql and seeds.sql files again, with the following commands in MySQL Shell:

source db/schema.sql
source db/seeds.sql
In MySQL Shell, run a few test queries, as shown in the following code:

SELECT * FROM candidates;
SELECT * FROM candidates WHERE id = 2;
SELECT * FROM parties;
Finally, let's test the constraint by deleting a party. If we delete 'JS Juggernauts' from the parties table (party_id = 1), every candidate row that referenced that id should become NULL.

Taking that into consideration, run the following statements at the prompt:

DELETE FROM parties WHERE id = 1;
SELECT * FROM candidates;
The results should still display all of the candidates, but anyone who had a party_id of 1—namely Robert, Virginia, and Piers—now has their party_id set to NULL, as shown in the following image:

Database response in MySQL Shell displays the party-id field is set to NULL for all in party_id=1.

Now that we've verified that the changes in the schema work, let's add the route that will execute this query to the database.

Relational databases consist of tables using foreign keys to reference data in other tables. In the case of the candidates and parties tables, we have what is called a one-to-many relationship. That is, one party may be related to many candidates, but one candidate may be related to only one party. Rather than duplicating the party's information for each applicable row in the candidates table, we simply use the party's id.

For a recap of the different relationships data can have in SQL databases, take a moment to watch the following video:


For the voting app, the end goal is to display a candidate's information alongside his or her actual party's name, not just the id. Does this mean we'd need to query the database twice, once for the candidate and again for the party, and then merge the data with JavaScript?

Thankfully, no! We can use SQL's JOIN statement to do this for us. When added to a SELECT statement, a JOIN can merge two or more tables together, filling in the foreign keys with the actual data.

There are a few different ways JOIN statements can be used. You can retrieve only the rows that have matching id's from both tables, all of the rows from one table and only the matching data from another, etc. The following image illustrates these differences:

Four diagrams highlight how much data from two tables is selected when using different JOIN statements.

Restore the database by running the schema.sql and seeds.sql files again in MySQL Shell. Then run the following statement in MySQL Shell:

SELECT * FROM candidates
LEFT JOIN parties ON candidates.party_id = parties.id;
Notice that we're using dot notation to specify the party_id column in the candidates table. It's just like dot notation in JavaScript, where the table would be the object and the column would be the property.

The following image shows what you should see:

The MySQL command line displays a table with all candidate and party data merged.

Note that we told SQL we wanted to get everything from the candidates table combined with any rows from the parties table where the candidate's party_id matched a party's primary key.

However, this returned more information than what we'll ultimately need. Update the query to look like the following:

SELECT candidates.*, parties.name
FROM candidates
LEFT JOIN parties ON candidates.party_id = parties.id;
This will still return all of the candidate's data but only the party's name. Notice that we're using a wildcard to return all of the column data from the candidates table, something we can't do with dot notation in JavaScript. Let's rename it to something more meaningful as part of the query, as shown in the following code:

SELECT candidates.*, parties.name AS party_name
FROM candidates
LEFT JOIN parties ON candidates.party_id = parties.id;
The AS keyword lets you define an alias for your data, which is particularly useful when joining tables that might have overlapping field names.

The final result should look like the following image:

The MySQL command line displays a table of candidate data merged with only the party name.

You just wrote an impressive JOIN query! Figuring out the details of the query in MySQL before touching any JavaScript code ensured that any problems that arose would be with the query itself and not any outside forces. Now that you know the query works, you can update the corresponding API route to use it.

Open server.js and find the two app.get() routes. Update the sql variable in both to use the JOIN syntax.

The /api/candidates route will contain the following code:

const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id`;
And the updated /api/candidate/:id route will contain the following code:

const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id 
             WHERE candidates.id = ?`;
Note that we were still able to use a WHERE clause with a JOIN, but we had to place it at the end of the statement, as shown in the preceding code.

PAUSE
How can you test these routes if there's still no front end?

Answer
Start your server by running npm start or node server.js. Then open Insomnia Core and make a GET request to the following URL: http://localhost:3001/api/candidates.

You should see similar results as you did in the previous lesson, only now the party name is included! Use the following image as a reference:

An Insomnia Core GET request displays candidate objects that include party details.

This is an excellent stopping point, so remember to save your work, then add, commit, and push to GitHub.

The voting app that we're building toward eventually will have an interface to display all parties and display an individual party. Naturally, we'll need to provide API endpoints for each of these features.

Fortunately, the process for creating these party routes will be very similar to what you already accomplished with the candidate routes.

In server.js, add the following route for all parties:

app.get('/api/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});
Next, add a second route that includes an id parameter for a single party, as shown in the following code:

app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});
The only other CRUD operation required by the front end is to delete parties. Building a delete route will give us an opportunity to test the ON DELETE SET NULL constraint effect through the API.

Add the following third and final route to server.js:

app.delete('/api/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Party not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});
REWIND
Because the intention of this route is to remove a row from the table, we should use app.delete() instead of app.get().

If you haven't already, seed the database so there is party data to retrieve. Restart the Node.js server with npm start, then open Insomnia Core and make a few test requests.

The following image demonstrates what you'd see when making a GET request to /api/party/3:

An Insomnia Core GET request displays a single party object.

Remember to test a DELETE request, too! Try deleting a party by making a DELETE request to /api/party/1, then make a GET request to /api/candidates to verify that the affected party_name fields are null.

Once these routes have been tested, remember to reset the data by executing the schema.sql and seeds.sql files so that all the parties can participate in the vote.

It's possible that a candidate will change his or her party affiliation over time. Ronald Firbank, for instance, might decide one day that he likes HTML more than JavaScript. This kind of update is something the front-end team would like to be able to make through the app itself. Sounds like the team will need an API route!

What request type would be appropriate for updating data? We've established that GET is for reading, POST for creating, and DELETE for deleting. None of those make sense for updating, but there is a fourth request type we can use: the PUT request.

ON THE JOB
It might seem unnecessary to worry over the appropriate request types. Technically, you could do everything you need with just GET requests. However, clearly labeling your requests makes it easier for other developers to understand how to use your API endpoints. Large apps with hundreds of routes could become very confusing if delete and update actions were lumped into the same request category as reading data.

In server.js, add a new route alongside the other /api/candidate routes to handle updates, as shown in the following code:

// Update a candidate's party
app.put('/api/candidate/:id', (req, res) => {
  const sql = `UPDATE candidates SET party_id = ? 
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});
This route might feel a little strange because we're using a parameter for the candidate's id (req.params.id), but the request body contains the party's id (req.body.party_id). Why mix the two? Again, we want to follow best practices for consistency and clarity. The affected row's id should always be part of the route (e.g., /api/candidate/2) while the actual fields we're updating should be part of the body.

If the front end will be making this request, though, then we should be extra sure that a party_id was provided before we attempt to update the database. Let's leverage our friend's inputCheck() function again to do so.

Add the following block of code right before the sql variable declaration:

const errors = inputCheck(req.body, 'party_id');

if (errors) {
  res.status(400).json({ error: errors });
  return;
}
This now forces any PUT request to /api/candidate/:id to include a party_id property. Even if the intention is to remove a party affiliation by setting it to null, the party_id property is still required.

Let's test this out. Restart your Node.js server, then open Insomnia Core. Change the request type to PUT and the URL to http://localhost:3001/api/candidate/1. Add a JSON body that includes a party_id property. Then click Send!

The following image demonstrates what your request and preview should look like:

An Insomnia Core PUT request displays a JSON body object and a success response object.

If the update was successful, make a GET request now to /api/candidate/1 to verify that the party_id is, in fact, null (or whatever you chose to set it to).

To check whether the foreign key constraint we placed in the candidates schema is working properly in the voting application, try updating a candidate's party_id field to an id that doesn't exist, like 4. This would demonstrate that the foreign key constraints are working by default, thanks to the mysql2 npm package, as shown in the following image:

Insomnia shows the foreign key constraint error when adding a party id that doesn't exist.

Once you're satisfied with the state of the project, close the corresponding GitHub issue. Because the issue is complete, you can also git merge this feature branch into develop once the work has been added and committed.

Before moving on to the next lesson, take a moment to work through the following knowledge check:



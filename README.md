# My Introvert
"My Introvert" is the name of the Application that we will build, where we use this App to help Introverts from weaknesses that Introverts have, this App will be based on Mobile Interfaces, which is supported by Back-End based Web, and will implement Machine Learning Technology in it.

# Features
1. Login multilevel
2. Added User (with Role : Admin, Editor, User)
3. Added Daily Notes.
4. Added CRUD Video Content.
5. Added CRUD Book Content.
6. Added CRUD Blog Content.

# Run the App
1. npm start or install Package <b>Nodemon</b> globally and run <b>nodemon index</b>
2. For created account Admin Default used "npm run create-admin" (File location ./config/defaultUser.js)

# Tech Stack
1. [Express.js](https://expressjs.com) (Framework)
2. [Express-Session](https://expressjs.com/en/resources/middleware/session.html) (Package for Session Login)
3. [MySQL2](https://www.npmjs.com/package/mysql2) (Driver Database)
4. [Sequelize](https://sequelize.org/) (ORM)
5. [Dotenv](https://www.npmjs.com/package/dotenv) (Environment Variabel)
6. [Argon2](https://www.npmjs.com/package/argon2) (Password Hash)
7. [CORS](https://www.npmjs.com/package/cors) (Policy API Agreement)

# Endpoin's API
### Add User's Endpoint's
1. POST - http://localhost:5000/user (Endpoin Add User)
2. GET - http://localhost:5000/users (Endpoin Get All User)
3. GET - http://localhost:5000/user/:id (Endpoin Get Single User)
4. PATCH - http://localhost:5000/user (Endpoin Update User)
5. DELETE - http://localhost:5000/user/:id (Endpoin Deleted User)

### Login Endpoint's
1. POST - http://localhost:5000/login (Endpoin Login User)
2. GET - http://localhost:5000/me (Endpoin Get Info User Logged)
3. DELETE - http://localhost:5000/logout (Endpoint Usesr Loggout)

### Add Daily Note's Endpoint's
1. POST - http://localhost:5000/note (Endpoint Add Note)
2. GET - http://localhost:5000/notes (Endpoin Get All Notes)
3. GET http://localhost:5000/note/:id (Endpoin Get Single Note)
4. PATCH http://localhost:5000/note/:id (Endpoint Update Note)
5. DELETE http://localhost:5000/note/:id (Endpoint Deleted Note)















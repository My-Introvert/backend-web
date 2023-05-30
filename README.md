# backend-web
This is the Repo for Back-End Web Code in App My Introvert

# Features
1. Login multilevel
2. Add user (with Role : Admin, Editor, User)
3. Add daily notes

# Run the App
1. npm start
2. Or install Package <b>Nodemon</b> globally and run <b>nodemon index</b>

<br />

# Tech Stack
1. [Express.js](https://expressjs.com) (Framework)
2. [Express-Session](https://expressjs.com/en/resources/middleware/session.html) (Package for Session Login)
3. [MySQL2](https://www.npmjs.com/package/mysql2) (Driver Database)
4. [Sequelize](https://sequelize.org/) (ORM)
5. [Dotenv](https://www.npmjs.com/package/dotenv) (Environment Variabel)
6. [Argon2](https://www.npmjs.com/package/argon2) (Password Hash)
7. [CORS](https://www.npmjs.com/package/cors) (Policy API Agreement)

<br />

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















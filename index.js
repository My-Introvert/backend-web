import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SquelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import NoteRoute from "./routes/NoteRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

const app = express();

// Save session to database
const sessionStore = SquelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

// Sync Database or Create table in database
// (async () => {
//   await db.sync();
// })();

// Sync or Create tabel session on database
// store.sync();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: process.env.APP_PROTOCOL_FE + process.env.APP_HOSTNAME_FE + ":" + process.env.APP_PORT_FE,
  })
);

app.use(express.json());
app.use(UserRoute);
app.use(NoteRoute);
app.use(AuthRoute);

app.listen(process.env.APP_PORT_BE, () => {
  console.log(`Server up and running in Port ${process.env.APP_PORT_BE}`);
});

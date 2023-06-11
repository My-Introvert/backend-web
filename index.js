import express from "express";
import session from "express-session";
import fileUpload from "express-fileupload";
import SquelizeStore from "connect-session-sequelize";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";

// Route
import UserRoute from "./routes/UserRoute.js";
import NoteRoute from "./routes/NoteRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import BlogRoute from "./routes/BlogRoute.js";
import BookRoute from "./routes/BookRoute.js";
import VideoRoute from "./routes/VideoRoute.js";
import Quesioner from "./routes/QuesionerRoute.js";

dotenv.config();
const app = express();

// Save session to database
const sessionStore = SquelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

//  For ALTER TABLE to Sync Columns
// db.sync({ alter: true });

// Sync Database or Create all new Table in database
// (async () => {
//   await db.sync({ force: true });
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
    origin: process.env.CORS_ORIGIN_1,
  })
);

app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(UserRoute);
app.use(NoteRoute);
app.use(AuthRoute);
app.use(BlogRoute);
app.use(BookRoute);
app.use(VideoRoute);
app.use(Quesioner);

app.listen(process.env.APP_PORT_BE, () => {
  console.log(`Server up and running in Port ${process.env.APP_PORT_BE}`);
});

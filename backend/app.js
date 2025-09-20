const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./src/config/passport");
const usersRouter = require("./src/routers/usersRouter");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());

app.use("/api/v1/users", usersRouter);
app.use((req, res, next) => {
  const error = new Error("Route Not Found!");
  res.status(404);
  next(error);
});
app.use((err, req, res, next) => {
  res.json({ message: err.message });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Express application started at localhost:${PORT}`);
});

module.exports = app;

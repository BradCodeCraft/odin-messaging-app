const express = require("express");
const passport = require("./src/configs/passport");
const session = require("express-session");
const usersRouter = require("./src/routers/usersRouter");

const app = express();

/**
 * NOTE: Settings
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // NOTE: 24 hours
    },
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());

/**
 * NOTE: Routes
 */
app.use("/api/v1/users", usersRouter);
app.use((req, res, next) => {
  res.code = 404;
  throw new Error("Endpoint Not Found");
});
app.use((err, req, res, next) => {
  return res
    .status(res.code || 500)
    .json({ message: err.message || "Internal Server Error" });
});

/**
 * NOTE: Server
 */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Express application started at http://localhost:${PORT}`);
});

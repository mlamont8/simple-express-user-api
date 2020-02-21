const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//load ENV Variables from config file
const config = require("./config/local");
process.env.APP_PORT = config.APP_PORT;
process.env.DB_HOST = config.DB_HOST;
process.env.DB_USER = config.DB_USER;
process.env.DB_PASS = config.DB_PASS;

//compose connection details
let dbConn =
  "mongodb://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASS +
  "@" +
  process.env.DB_HOST;

mongoose
  .connect(dbConn, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to Mongodb"))
  .catch(err => {
    console.log("failed to connect to Mongodb...", err);
    process.exit();
  });

const usersRouter = require("./routes/user.route");

app.use("/api/users", usersRouter);

app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});
//endpoints
app.get("/", (req, res) => {
  res.send({ message: "Yabadabadooo" });
});

module.exports = app;

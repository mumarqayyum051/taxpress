const express = require("express");
const app = express();
const passport = require("passport");
const db = require("./db");
require("dotenv").config();
const port = process.env.PORT;
const httpResponse = require("express-http-response");
app.use(httpResponse.Middleware);
const cors = require("cors");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`${process.env.SERVER_STARTED_TEXT} ${port}`);
});

app.use(passport.initialize());

app.use("/api/users", require("./controllers/user/userController"));
app.use("/api/cases", require("./controllers/cases/casesController"));

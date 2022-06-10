const express = require("express");
const app = express();
const passport = require("passport");
const db = require("./db");
const path = require("path");
require("dotenv").config();
const port = process.env.PORT;
const httpResponse = require("express-http-response");
const cors = require("cors");
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "200mb" }));
app.use(cors());

app.listen(port, () => {
  console.log(`${process.env.SERVER_STARTED_TEXT} ${port}`);
});

app.use(passport.initialize());
app.use("/upload/image", express.static(path.join("upload", "image")));

app.use("/api/users", require("./controllers/user/userController"));
app.use("/api/cases", require("./controllers/cases/casesController"));
app.use("/api/services", require("./controllers/service/servicesController"));
app.use("/api/blogs", require("./controllers/blogs/blogsController"));
app.use(
  "/api/notifications",
  require("./controllers/notifications/notificationsController"),
);
app.use("/api/counts", require("./controllers/counts/countsController"));
app.use("/api/statutes", require("./controllers/statutes/statutesController"));
app.use(
  "/api/dictionary",
  require("./controllers/dictionary/dictionaryController"),
);
app.use(
  "/api/ordinance",
  require("./controllers/ordinance/ordinanceController"),
);
app.use("/api/team", require("./controllers/team/teamController"));
app.use("/api/insights", require("./controllers/insights/insightsController"));

app.use(httpResponse.Middleware);

const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const createNotification = (req, res, next) => {
  const filePath = req.files[0].path;
  const { notificationTypeId, sroNO, subject, year, dated, law_or_statute_id } =
    req.body || req.body.notification;

  var domain = req.headers.host;
  var pathname = new URL(filePath).pathname;
  var serverLink = pathname.split("\\").splice(-2).join("/");
  const file = domain + "/" + serverLink;
  console.log(req.body);
  if (
    !notificationTypeId ||
    !sroNO ||
    !subject ||
    !year ||
    !dated ||
    !law_or_statute_id ||
    !serverLink
  ) {
    return res
      .status(403)
      .send(new BadRequestResponse("Please fill all the fields"));
  }

  const query = `INSERT INTO notifications (notificationTypeId,sroNO,subject,year,dated,law_or_statute_id,file) VALUES ('${notificationTypeId}', '${sroNO}', '${subject}','${year}',  '${dated}', '${law_or_statute_id}','${serverLink}')`;
  db.query(query, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err));
    }
    return res.send(new OkResponse("Notification created successfully"));
  });
};

const searchNotifications = (req, res) => {
  const { sroNO, year, notificationTypeId, subject, dated, law_or_statute_id } =
    req.body || req.body.notification;

  console.log(req.body);
  let search = `SELECT * FROM notifications WHERE `;
  if (sroNO) {
    search += `sroNO LIKE '%${sroNO}%' OR `;
  }
  if (year) {
    search += `year LIKE '%${year}%' OR `;
  }
  if (notificationTypeId) {
    search += `notificationTypeId LIKE '%${notificationTypeId}%' OR `;
  }
  if (subject) {
    search += `subject LIKE '%${subject}%' OR `;
  }
  if (dated) {
    search += `dated LIKE '%${dated}%' OR `;
  }
  if (law_or_statute_id) {
    search += `law_or_statute_id LIKE '%${law_or_statute_id}%'`;
  }

  console.log(search);
  search = search.trim();
  if (search.includes("OR") && search.endsWith("OR")) {
    search = search.split("OR").slice(0, -1).join(" OR ");
  }
  if (!search.includes("LIKE")) {
    return res
      .status(422)
      .send(
        new BadRequestResponse("Please pass at least one search parameter"),
      );
  }
  console.log("-result---", search);
  db.query(search, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err));
    }
    return res.send(new OkResponse(result));
  });
};

const createNotificationType = (req, res) => {
  const { notificationCategoryName } = req.body || req.body.notificationType;

  if (!notificationCategoryName) {
    return res.send(new BadRequestResponse("Please fill all the fields"));
  }
  const query = `INSERT INTO notificationtypes (notificationCategoryName) VALUES ('${notificationCategoryName}')`;

  db.query(query, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err));
    }
    return res.send(new OkResponse("Notification type created successfully"));
  });
};

const getNotificationTypes = (req, res) => {
  const query = `SELECT * FROM notificationtypes`;
  db.query(query, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err));
    }
    return res.send(new OkResponse(result));
  });
};

const getAllNotifications = (req, res) => {
  const query = `SELECT * FROM notifications`;
  db.query(query, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err));
    }
    return res.send(new OkResponse(result));
  });
};
module.exports = {
  createNotification,
  searchNotifications,
  createNotificationType,
  getNotificationTypes,
  getAllNotifications,
};

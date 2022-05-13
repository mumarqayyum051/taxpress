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
    !file
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
    search += `law_or_statute_id LIKE '%${law_or_statute_id}%' `;
  }
  search = search.split("OR").slice(0, -1).join("OR");
  db.query(search, (err, result) => {
    console.log(result);
    if (err) {
      return res.send(new BadRequestResponse(err));
    }
    return res.send(new OkResponse(result));
  });
};

module.exports = { createNotification, searchNotifications };

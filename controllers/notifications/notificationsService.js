const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const createNotification = (req, res, next) => {
  const { notificationTypeId, sroNO, year, dated, law_or_statute_id } =
    req.body || req.body.notification;
  console.log(req.body);
  if (!notificationTypeId || !sroNO || !year || !dated || !law_or_statute_id) {
    return res
      .status(403)
      .send(new BadRequestResponse("Please fill all the fields"));
  }

  const query = `INSERT INTO notifications (notificationTypeId,sroNO,year,dated,law_or_statute_id) VALUES ('${notificationTypeId}', '${sroNO}', '${year}',  '${dated}', '${law_or_statute_id}')`;
  db.query(query, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err));
    }
    return res.send(new OkResponse("Notification created successfully"));
  });
};

const searchNotifications = (req, res) => {
  const { sroNO, year, notificationTypeId, dated, law_or_statute_id } =
    req.body || req.body.notification;

  console.log(req.body);
  let search = `SELECT * FROM notifications WHERE `;
  if (sroNO) {
    search += `sroNO = '${sroNO}' AND `;
  }
  if (year) {
    search += `year = '${year}' AND `;
  }
  if (notificationTypeId) {
    search += `notificationTypeId = '${notificationTypeId}' AND `;
  }
  if (dated) {
    search += `dated = '${dated}' AND `;
  }
  if (law_or_statute_id) {
    search += `law_or_statute_id = '${law_or_statute_id}' `;
  }
  console.log(search);
  db.query(search, (err, result) => {
    console.log(result);
    if (err) {
      return res.send(new BadRequestResponse(err));
    }
    return res.send(new OkResponse(result[0]));
  });
};

module.exports = { createNotification, searchNotifications };

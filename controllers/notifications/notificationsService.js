const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");
var base64ToFile = require("base64-to-file");

const fs = require("fs");
const path = require("path");
const createNotification = async (req, res, next) => {
  let {
    notification_type_id,
    sro_no,
    subject,
    year,
    dated,
    law_or_statute_id,
  } = req.body || req.body.notification;

  if (
    !notification_type_id ||
    !sro_no ||
    !subject ||
    !year ||
    !dated ||
    !law_or_statute_id
  ) {
    return next(new BadRequestResponse("Please fill all the fields"));
  }

  try {
    subject = subject.replace(/'/g, "\\'");
  } catch (e) {
    return next(new BadRequestResponse(e));
  }

  const filePath = req?.file?.path?.split("\\")?.join("/");

  const query = `INSERT INTO notifications (notification_type_id,sro_no,subject,year,dated,law_or_statute_id,file) VALUES ('${notification_type_id}', '${sro_no}', '${subject}','${year}',  '${dated}', '${law_or_statute_id}','${filePath}')`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return res.send(new OkResponse("Notification created successfully"));
    });
  });
};

const searchNotifications = (req, res, next) => {
  const {
    sro_no,
    year,
    notification_type_id,
    subject,
    dated,
    law_or_statute_id,
  } = req.body || req.body.notification;

  let search = `SELECT * FROM notifications WHERE `;
  if (sro_no) {
    search += `sro_no LIKE '%${sro_no}%' OR `;
  }
  if (year) {
    search += `year LIKE '%${year}%' OR `;
  }
  if (notification_type_id) {
    search += `notification_type_id LIKE '%${notification_type_id}%' OR `;
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
  db.then((conn) => {
    conn.query(search, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return res.send(new OkResponse(result));
    });
  });
};

const createNotificationType = (req, res, next) => {
  let { title } = req.body || req.body.notificationType;

  if (!title) {
    return next(new BadRequestResponse("Please fill all the fields"));
  }
  title = title.replace(/'/g, "\\'");
  const query = `INSERT INTO notificationstypes (title) VALUES ('${title}')`;

  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return res.send(new OkResponse("Notification type created successfully"));
    });
  });
};

const getNotificationTypes = (req, res, next) => {
  const query = `SELECT * FROM notificationstypes`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return res.send(new OkResponse(result));
    });
  });
};

const getAllNotifications = (req, res, next) => {
  const query = `SELECT notifications.*,statutes.law_or_statute, notificationstypes.title
   FROM notifications 
   LEFT JOIN 
   statutes ON notifications.law_or_statute_id = statutes.id
    LEFT JOIN
    notificationstypes ON notifications.notification_type_id = notificationstypes.id`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }

      return res.send(new OkResponse(result));
    });
  });
};

const deleteNotificationTypeById = (req, res, next) => {
  const { id } = req.params;
  const query = `DELETE FROM notificationstypes WHERE id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return res.send(new OkResponse("Notification type deleted successfully"));
    });
  });
};

const deleteNotification = (req, res, next) => {
  const { id } = req.params;
  const query = `DELETE FROM notifications WHERE id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return res.send(new OkResponse("Notification deleted successfully"));
    });
  });
};
module.exports = {
  createNotification,
  searchNotifications,
  createNotificationType,
  getNotificationTypes,
  getAllNotifications,
  deleteNotificationTypeById,
  deleteNotification,
};

// @ts-nocheck

const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");
const moment = require("moment");

const setAppointmentsTime = (req, res, next) => {
  let { startTime, endTime, consultant, day, appointmentType, minutesPerSlot } =
    req.body || req.body.appointmentSlot;
  if (!startTime || !endTime || !day || !minutesPerSlot) {
    return next(new BadRequestResponse("Please fill all the fields", 400));
  }

  var _startTime = moment(startTime, "HH:mm:ss a");
  var _endTime = moment(endTime, "HH:mm:ss a");
  const differenceInMinutes = _endTime.diff(_startTime, "minutes");

  if (differenceInMinutes <= minutesPerSlot) {
    return next(
      new BadRequestResponse(
        "The given time interval is greater than the time span for all the appointments",
        400,
      ),
    );
  }
  let totalNoPossibleSlots = (differenceInMinutes / minutesPerSlot).toFixed(2);

  console.log({ differenceInMinutes, totalNoPossibleSlots });

  let timeSlots = [];
  for (let i = 0; i < parseInt(totalNoPossibleSlots); i++) {
    if (i == 0) {
      _startTime = _startTime.add(0, "minutes");
    } else {
      _startTime = _startTime.add(minutesPerSlot, "minutes");
    }
    let startTime = moment(_startTime, "HH:mm:ss a");
    let endTime = moment(startTime).add(minutesPerSlot, "minutes");
    timeSlots.push({
      startTime: startTime.format("HH:mm:ss a"),
      endTime: endTime.format("HH:mm:ss a"),
      booked: "No",
      consultant,
    });
  }
  console.log(timeSlots);
  if (+totalNoPossibleSlots > 1) {
    let decimalPortion = (Number(totalNoPossibleSlots) % 1).toFixed(2);
    if (+decimalPortion > 0) {
      const lastSlot = timeSlots[timeSlots.length - 1];
      const lastSlotEndTime = lastSlot.endTime;
      console.log({ lastSlotEndTime });

      const slotOfRemainingMinutes = [
        {
          startTime: lastSlotEndTime,
          endTime: endTime,
          booked: "No",
          consultant,
          appointmentType,
        },
      ];
      console.log(slotOfRemainingMinutes);
      console.log(timeSlots);
      timeSlots = [...timeSlots, ...slotOfRemainingMinutes];
      // let lastSlotInMinutes = interval * +decimalPortion;
      // let lastSlotStartTime = moment(lastSlotEndTime, "HH:mm:ss a");
    }
    console.log({ decimalPortion });
  }
  // console.log(hours + " hour and " + minutes + " minutes.");
  console.log(timeSlots);

  const allowedAppointmentTypes = ["Physical Appointment", "Call Appointment"];
  if (appointmentType) {
    if (!allowedAppointmentTypes.includes(appointmentType)) {
      return next(
        new BadRequestResponse("Appointment type is not allowed", 400),
      );
    }
  }

  try {
    day = day?.split("/").join("-");
    day = day?.split("-").reverse().join("-");
    const query = `Select * from  appointments_schedule where day = '${day}'`;
    db.then((conn) => {
      conn.query(query, (err, result) => {
        if (err) {
          return next(new BadRequestResponse(err.message, 400));
        }
        if (result.length > 0) {
          return next(
            new BadRequestResponse(
              "An appointment schedule already exist against this date",
            ),
          );
        }
        if (consultant) {
          try {
            consultant = consultant.replace(/'/g, "'");
          } catch (e) {
            return next(new BadRequestResponse(e, 400));
          }
        }

        const insertIntoappointmentsSchedule = `INSERT INTO appointments_schedule (minutesPerSlot, startTime, endTime, consultant, day , appointmentType) VALUES ('${minutesPerSlot}','${startTime}','${endTime}', '${consultant}', '${day}','${appointmentType}')`;
        db.then((conn) => {
          console.log(insertIntoappointmentsSchedule);
          conn.query(insertIntoappointmentsSchedule, (err, result) => {
            if (err) {
              return next(new BadRequestResponse(err.message, 400));
            }

            for (let slot of timeSlots) {
              new Promise((resolve, reject) => {
                console.log(slot);
                const _query = `INSERT INTO appointment_slots (booked, startTime, endTime,consultant,appointmentType, appointment_schedule_id) VALUES ('${slot.booked}','${slot.startTime}','${slot.endTime}', '${slot.consultant}', '${slot.appointmentType}','${result.insertId}')`;

                conn.query(_query, (err, result) => {
                  if (err) {
                    return reject(new BadRequestResponse(err.message, 400));
                  }

                  resolve();
                });
              });
            }
            return next(
              new OkResponse("Appointment slot has been created", 200),
            );
          });
        }).catch((err) => {
          return next(new BadRequestResponse(err.message, 400));
        });
      });
    }).catch((err) => {
      return next(new BadRequestResponse(err.message, 400));
    });
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }
};

const deleteAppointmentSchedule = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new BadRequestResponse("Please provide an id"));
  }

  db.then((conn) => {
    Promise.all([
      new Promise((resolve, reject) => {
        const query = `DELETE FROM appointments_schedule WHERE id = '${id}'`;

        conn.query(query, (err, result) => {
          if (err) {
            return reject(new BadRequestResponse(err.message, 400));
          }

          resolve();
        });
      }),
      new Promise((resolve, reject) => {
        const query = `DELETE FROM appointment_slots WHERE appointment_schedule_id = '${id}'`;

        conn.query(query, (err, result) => {
          if (err) {
            return reject(new BadRequestResponse(err.message, 400));
          }

          resolve();
        });
      }),
    ]).then((result) => {
      return next(new OkResponse("Appointment schedule has been deleted", 200));
    });
  }).catch((e) => {});

  const query = `DELETE FROM appointments_schedule WHERE id = ${id}`;
  try {
    db.then((conn) => {
      conn.query(query, (err, result) => {
        if (err) {
          return next(new BadRequestResponse(err.message, 400));
        }
        return next(
          new OkResponse("Appointment schedule has been deleted", 200),
        );
      });
    }).catch((err) => {
      return next(new BadRequestResponse(err.message, 400));
    });
  } catch (e) {
    return next(new BadRequestResponse(e.message, 400));
  }
};

const getAppointmentSlots = (req, res, next) => {
  const query = `SELECT appointment_slots.*, COUNT(appointments.id) as NoOfAppointments FROM appointment_slots
  LEFT JOIN appointments ON appointment_slots.id = appointments.appointment_slot_id
  GROUP BY appointment_slots.id`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }

      return next(new OkResponse(result, 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const getAppointmentSlotsByType = (req, res, next) => {
  const appointmentType = req.params.appointmentType;
  if (!appointmentType) {
    return next(new BadRequestResponse("Please provide an appointment type"));
  }
  const query = `SELECT * FROM appointment_slots WHERE appointmentType = '${appointmentType}'`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }

      return next(new OkResponse(result, 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const getAppointmentSlotsByDate = (req, res, next) => {
  const { date } = req.body;
  if (!date) {
    return next(new BadRequestResponse("Please provide a date"));
  }
  const query = `SELECT * FROM appointment_slots WHERE day = '${date}'`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }

      return next(new OkResponse(result, 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const createAppoinmentSlot = (req, res, next) => {
  const { startTime, endTime, consultant } = req.body;

  if (!startTime || !endTime) {
    return next(
      new BadRequestResponse("Please provide all the required fields"),
    );
  }

  const isExist = `SELECT * FROM appointment_slots WHERE startTime = '${startTime}' AND endTime = '${endTime}'`;

  db.then((conn) => {
    conn.query(isExist, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      if (result.length > 0) {
        return next(
          new BadRequestResponse(
            "An appointment slot already exist against this time",
            400,
          ),
        );
      }
      const query = `INSERT INTO appointment_slots (startTime,endTime,consultant) VALUES ('${startTime}','${endTime}','${consultant}')`;

      db.then((conn) => {
        conn.query(query, (err, result) => {
          if (err) {
            return next(new BadRequestResponse(err.message, 400));
          }
          return next(new OkResponse("Appointment Created Successfully", 200));
        });
      }).catch((err) => {
        return next(new BadRequestResponse(err.message, 400));
      });
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const deleteAppointmentSlot = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new BadRequestResponse("Please provide an id"));
  }
  const query = `DELETE FROM appointment_slots WHERE id = '${id}'`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }

      return next(new OkResponse("Appointment slot has been deleted", 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const deleteAllAppointmentSlots = (req, res, next) => {
  const query = `truncate appointment_slots`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(
        new OkResponse("All appointment slots have been deleted", 200),
      );
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const changeAppointmentStatus = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new BadRequestResponse("Please provide an id"));
  }

  const { status } = req.body;
  if (!status) {
    return next(
      new BadRequestResponse("Please provide all the required fields"),
    );
  }
  const allowedStatuses = ["Completed", "Pending", "Canceled"];
  if (!allowedStatuses.includes(status)) {
    return next(new BadRequestResponse("Please provide a valid status"), 400);
  }

  const query = `UPDATE appointments SET status = '${status}' WHERE id = '${id}'`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }

      return next(new OkResponse("Appointment status has been changed", 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};
const bookeAppointmentSlot = (req, res, next) => {
  const {
    appointment_slot_id,
    client_name,
    client_phone,
    client_email,
    appointment_detail,
    date,
    appointmentType,
  } = req.body;

  if (
    !appointment_slot_id ||
    !client_name ||
    !client_phone ||
    !client_email ||
    !date ||
    !appointmentType
  ) {
    return next(
      new BadRequestResponse("Please provide all the required fields"),
    );
  }
  const allowedAppointmentTypes = ["physical_appointment", "call_appointment"];

  if (!allowedAppointmentTypes.includes(appointmentType)) {
    return next(
      new BadRequestResponse("Please provide a valid appointment type"),
    );
  }
  const ifBooked = `SELECT * FROM appointments WHERE appointment_slot_id = '${appointment_slot_id}' AND date='${date}' AND appointmentType = '${appointmentType}'`;
  console.log({ ifBooked });
  db.then((conn) => {
    conn.query(ifBooked, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      if (result.length && result[0]?.appointmentType === appointmentType) {
        return next(
          new BadRequestResponse("Appointment slot already booked", 400),
        );
      }
      const query = `INSERT INTO appointments (appointment_slot_id,client_name,client_phone,  client_email,date,appointment_detail, appointmentType) VALUES ('${appointment_slot_id}','${client_name}','${client_phone}','${client_email}','${date}','${appointment_detail}','${appointmentType}')`;

      conn.query(query, (err, result) => {
        if (err) {
          return next(new BadRequestResponse(err.message, 400));
        }
        return next(new OkResponse("Appointment Booked Successfully", 200));
      });
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const getAllAppointments = (req, res, next) => {
  const query = `SELECT appointments.*,appointment_slots.startTime, appointment_slots.endTime FROM appointments INNER JOIN appointment_slots ON appointments.appointment_slot_id = appointment_slots.id order by id DESC`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse(result, 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};
module.exports = {
  setAppointmentsTime,
  deleteAppointmentSchedule,
  getAppointmentSlots,
  createAppoinmentSlot,
  getAppointmentSlotsByType,
  deleteAppointmentSlot,
  deleteAllAppointmentSlots,
  bookeAppointmentSlot,
  getAllAppointments,
  changeAppointmentStatus,
};

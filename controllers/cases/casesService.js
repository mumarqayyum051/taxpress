const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");
const path = require("path");
var base64ToFile = require("base64-to-file");
const addCase = (req, res, next) => {
  let {
    year_or_vol,
    pageNo,
    month,
    law_or_statute_id,
    section,
    section2,
    court,
    caseNo,
    dated,
    textSearch1,
    textSearch2,
    phraseSearch,
    judge,
    lawyer,
    journals,
    appellant_or_opponent,
    principleOfCaseLaws,
    shortParagraph,
  } = req.body || req.body.case;
  if (
    !year_or_vol ||
    !pageNo ||
    !month ||
    !law_or_statute_id ||
    !section ||
    !section2 ||
    !court ||
    !caseNo ||
    !dated ||
    !textSearch1 ||
    !textSearch2 ||
    !phraseSearch ||
    !judge ||
    !lawyer ||
    !appellant_or_opponent ||
    !principleOfCaseLaws ||
    !journals ||
    !shortParagraph
  ) {
    return res
      .status(403)
      .send(new BadRequestResponse("Please fill all the fields"));
  }
  try {
    if (section) {
      section = section.replace(/'/g, "\\'");
    }
    if (section2) {
      section2 = section2.replace(/'/g, "\\'");
    }
    if (caseNo) {
      caseNo = caseNo.replace(/'/g, "\\'");
    }
    if (textSearch1) {
      textSearch1 = textSearch1.replace(/'/g, "\\'");
    }
    if (textSearch2) {
      textSearch2 = textSearch2.replace(/'/g, "\\'");
    }
    if (phraseSearch) {
      phraseSearch = phraseSearch.replace(/'/g, "\\'");
    }
    if (judge) {
      judge = judge.replace(/'/g, "\\'");
    }
    if (lawyer) {
      lawyer = lawyer.replace(/'/g, "\\'");
    }
    if (shortParagraph) {
      shortParagraph = shortParagraph.replace(/'/g, "\\'");
    }
    if (appellant_or_opponent) {
      appellant_or_opponent = appellant_or_opponent.replace(/'/g, "\\'");
    }
    if (principleOfCaseLaws) {
      principleOfCaseLaws = principleOfCaseLaws.replace(/'/g, "\\'");
    }
    if (journals) {
      journals = journals.replace(/'/g, "\\'");
    }
  } catch (e) {
    return next(new BadRequestResponse(e));
  }

  const filePath = req?.file?.path?.split("\\").join("/");

  const query = `INSERT INTO cases ( year_or_vol, pageNo, month, law_or_statute_id, section, section2, court, caseNo, dated, textSearch1, textSearch2, phraseSearch, judge, lawyer, appellant_or_opponent, principleOfCaseLaws,shortParagraph,journals, file) VALUES ('${year_or_vol}', '${pageNo}', '${month}', '${law_or_statute_id}', '${section}', '${section2}', '${court}', '${caseNo}', '${dated}', '${textSearch1}', '${textSearch2}', '${phraseSearch}', '${judge}', '${lawyer}', '${appellant_or_opponent}', '${principleOfCaseLaws}','${shortParagraph}', '${journals}', '${filePath}')`;
  console.log(query);
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Statutes has been created", 200));
    });
    // });
  });
};

const updateCase = (req, res, next) => {
  let {
    year_or_vol,
    pageNo,
    month,
    law_or_statute_id,
    section,
    section2,
    court,
    caseNo,
    dated,
    textSearch1,
    textSearch2,
    phraseSearch,
    judge,
    lawyer,
    journals,
    appellant_or_opponent,
    principleOfCaseLaws,
    shortParagraph,
    file,
  } = req.body || req.body.case;

  const id = req.params.id;
  console.log(req.body);
  if (!id) {
    return res.status(403).send(new BadRequestResponse("Please provide id"));
  }
  if (
    !year_or_vol ||
    !pageNo ||
    !month ||
    !law_or_statute_id ||
    !section ||
    !section2 ||
    !court ||
    !caseNo ||
    !dated ||
    !textSearch1 ||
    !textSearch2 ||
    !phraseSearch ||
    !judge ||
    !lawyer ||
    !appellant_or_opponent ||
    !principleOfCaseLaws ||
    !journals ||
    !shortParagraph
  ) {
    return res
      .status(403)
      .send(new BadRequestResponse("Please fill all the fields"));
  }

  try {
    const query = `SELECT * FROM cases WHERE id = '${id}'`;
    db.then((conn) => {
      conn.query(query, (err, result) => {
        if (err) {
          return next(new BadRequestResponse(err));
        }
        if (result.length === 0) {
          return next(
            new BadRequestResponse("No record found against given ID"),
          );
        }
        try {
          if (section) {
            section = section.replace(/'/g, "\\'");
          }
          if (section2) {
            section2 = section2.replace(/'/g, "\\'");
          }
          if (caseNo) {
            caseNo = caseNo.replace(/'/g, "\\'");
          }
          if (textSearch1) {
            textSearch1 = textSearch1.replace(/'/g, "\\'");
          }
          if (textSearch2) {
            textSearch2 = textSearch2.replace(/'/g, "\\'");
          }
          if (phraseSearch) {
            phraseSearch = phraseSearch.replace(/'/g, "\\'");
          }
          if (judge) {
            judge = judge.replace(/'/g, "\\'");
          }
          if (lawyer) {
            lawyer = lawyer.replace(/'/g, "\\'");
          }
          if (appellant_or_opponent) {
            appellant_or_opponent = appellant_or_opponent.replace(/'/g, "\\'");
          }
          if (principleOfCaseLaws) {
            principleOfCaseLaws = principleOfCaseLaws.replace(/'/g, "\\'");
          }
          if (journals) {
            journals = journals.replace(/'/g, "\\'");
          }
          if (shortParagraph) {
            shortParagraph = shortParagraph.replace(/'/g, "\\'");
          }
        } catch (err) {
          return next(new BadRequestResponse(err, 400));
        }
        if (!file?.includes("upload")) {
          console.log("upload");
          const filePath = req?.file?.path?.split("\\").join("/");

          db.then((conn) => {
            let update = `UPDATE cases SET year_or_vol = '${year_or_vol}', pageNo = '${pageNo}', month = '${month}', law_or_statute_id = '${law_or_statute_id}', section = '${section}', section2 = '${section2}', court = '${court}', caseNo = '${caseNo}', dated = '${dated}', textSearch1 = '${textSearch1}', textSearch2 = '${textSearch2}', phraseSearch = '${phraseSearch}', judge = '${judge}', lawyer = '${lawyer}', appellant_or_opponent = '${appellant_or_opponent}', principleOfCaseLaws = '${principleOfCaseLaws}', journals = '${journals}', file = '${filePath}' WHERE id = '${id}'`;

            conn.query(update, (err, result) => {
              if (err) {
                return next(new BadRequestResponse(err.message, 400));
              }
              return next(
                new OkResponse("Case has been updated successfully", 200),
              );
            });
          });
        } else {
          let update = `UPDATE cases SET year_or_vol = '${year_or_vol}', pageNo = '${pageNo}', month = '${month}', law_or_statute_id = '${law_or_statute_id}', section = '${section}', section2 = '${section2}', court = '${court}', caseNo = '${caseNo}', dated = '${dated}', textSearch1 = '${textSearch1}', textSearch2 = '${textSearch2}', phraseSearch = '${phraseSearch}', judge = '${judge}', lawyer = '${lawyer}', appellant_or_opponent = '${appellant_or_opponent}', principleOfCaseLaws = '${principleOfCaseLaws}', journals = '${journals}',shortParagraph='${shortParagraph}' ,file = '${file}' WHERE id = '${id}'`;

          db.then((conn) => {
            conn.query(update, (err, result) => {
              if (err) {
                return next(new BadRequestResponse(err, 400));
              } else {
                return next(
                  new OkResponse("Case has been updated successfully", 200),
                );
              }
            });
          });
        }
      });
    });
  } catch (e) {
    return next(new BadRequestResponse(e));
  }
};
const searchCase = (req, res, next) => {
  const {
    year_or_vol,
    pageNo,
    month,
    law_or_statute_id,
    section,
    section2,
    court,
    caseNo,
    dated,
    textSearch1,
    textSearch2,
    phraseSearch,
    judge,
    lawyer,
    journals,
    appellant_or_opponent,
    principleOfCaseLaws,
    shortParagraph,
  } = req.body || req.body.case;
  if (!req.body) {
    return res
      .status(403)
      .send(new BadRequestResponse("Please at least send one field"));
  }
  let query = `SELECT * FROM cases WHERE`;
  if (year_or_vol) {
    query += ` year_or_vol LIKE '%${year_or_vol}%' OR`;
  }
  if (pageNo) {
    query += ` pageNo LIKE '%${pageNo}%' OR`;
  }
  if (month) {
    query += ` month LIKE '%${month}%' OR`;
  }
  if (shortParagraph) {
    query += ` shortParagraph LIKE '%${shortParagraph}%' OR`;
  }
  if (law_or_statute_id) {
    query += ` law_or_statute_id LIKE '%${law_or_statute_id}%' OR`;
  }
  if (section) {
    query += ` section LIKE'%${section}%' OR`;
  }
  if (section2) {
    query += ` section2 LIKE'%${section2}%' OR`;
  }
  if (court) {
    query += ` court LIKE '%${court}%' OR`;
  }
  if (caseNo) {
    query += ` caseNo LIKE'%${caseNo}%' OR`;
  }
  if (dated) {
    query += ` dated LIKE '%${dated}%' OR`;
  }
  if (textSearch1) {
    query += ` textSearch1 LIKE '%${textSearch1}%' OR`;
  }
  if (textSearch2) {
    query += ` textSearch2 LIKE '%${textSearch2}%' OR`;
  }
  if (phraseSearch) {
    query += ` phraseSearch LIKE '%${phraseSearch}%' OR`;
  }
  if (judge) {
    query += ` judge LIKE '%${judge}%' OR`;
  }
  if (lawyer) {
    query += ` lawyer LIKE '%${lawyer}%' OR`;
  }
  if (journals) {
    query += ` journals LIKE '%${journals}%' OR`;
  }

  if (appellant_or_opponent) {
    query += ` appellant_or_opponent LIKE '%${appellant_or_opponent}%' OR`;
  }
  if (principleOfCaseLaws) {
    query += ` principleOfCaseLaws LIKE '%${principleOfCaseLaws}%'`;
  }
  query = query.trim();

  // query = query.trim();
  if (query.includes("OR") && query.endsWith("OR")) {
    query = query.split("OR").slice(0, -1).join(" OR ");
  }
  //
  if (!query.includes("LIKE")) {
    return res
      .status(422)
      .send(
        new BadRequestResponse("Please pass at least one search parameter"),
      );
  }

  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return res.status(403).send(new BadRequestResponse(err));
      }
      if (result.length === 0) {
        return next(new OkResponse(result, 200));
      }
      return next(new OkResponse(result, 200));
    });
  });
};
const deleteCase = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(403).send(new BadRequestResponse("Please provide id"));
  }
  let deleteQuery = `DELETE FROM cases WHERE id = '${id}'`;

  db.then((conn) => {
    conn.query(deleteQuery, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return next(new OkResponse("Case has been deleted successfully", 200));
    });
  });
};

const getAllCases = (req, res, next) => {
  let query = `SELECT * FROM cases`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return next(new OkResponse(result, 200));
    });
  });
};

const getCaseById = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new BadRequestResponse("Please provide id"));
  }
  let query = `SELECT * FROM cases WHERE id = '${id}'`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return next(new OkResponse(result, 200));
    });
  });
};
module.exports = {
  addCase,
  searchCase,
  updateCase,
  deleteCase,
  getAllCases,
  getCaseById,
};

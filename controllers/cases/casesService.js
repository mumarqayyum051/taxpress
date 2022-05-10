const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const uploadCase = (req, res, next) => {
  const filePath = req.files[0].path;

  const {
    year_or_vol,
    pageNo,
    month,
    law_or_statute,
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
  } = req.body || req.body.case;
  var pathname = new URL(filePath).pathname;
  var serverLink = pathname.split("\\").splice(-2).join("/");
  console.log({ serverLink, ...req.body });
  if (
    !year_or_vol ||
    !pageNo ||
    !month ||
    !law_or_statute ||
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
    !serverLink
  ) {
    return res
      .status(403)
      .send(new BadRequestResponse("Please fill all the fields"));
  }
  const query = `INSERT INTO cases ( year_or_vol, pageNo, month, law_or_statute, section, section2, court, caseNo, dated, textSearch1, textSearch2, phraseSearch, judge, lawyer, appellant_or_opponent, principleOfCaseLaws,journals, file) VALUES ('${year_or_vol}', '${pageNo}', '${month}', '${law_or_statute}', '${section}', '${section2}', '${court}', '${caseNo}', '${dated}', '${textSearch1}', '${textSearch2}', '${phraseSearch}', '${judge}', '${lawyer}', '${appellant_or_opponent}', '${principleOfCaseLaws}', '${journals}', '${serverLink}')`;

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(403).send(new BadRequestResponse(err));
    } else {
      return res.send(
        new OkResponse("Case has been uploaded successfully", 200),
      );
    }
  });
};

const searchCase = (req, res) => {
  const {
    year_or_vol,
    pageNo,
    month,
    law_or_statute,
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
  } = req.body || req.body.case;
  let query = `SELECT * FROM cases WHERE`;
  if (year_or_vol) {
    query += ` year_or_vol = '${year_or_vol}' AND`;
  }
  if (pageNo) {
    query += ` pageNo = '${pageNo}' AND`;
  }
  if (month) {
    query += ` month = '${month}' AND`;
  }
  if (law_or_statute) {
    query += ` law_or_statute = '${law_or_statute}' AND`;
  }
  if (section) {
    query += ` section = '${section}' AND`;
  }
  if (section2) {
    query += ` section2 = '${section2}' AND`;
  }
  if (court) {
    query += ` court = '${court}' AND`;
  }
  if (caseNo) {
    query += ` caseNo = '${caseNo}' AND`;
  }
  if (dated) {
    query += ` dated = '${dated}' AND`;
  }
  if (textSearch1) {
    query += ` textSearch1 LIKE '%${textSearch1}%' AND`;
  }
  if (textSearch2) {
    query += ` textSearch2 LIKE '%${textSearch2}%' AND`;
  }
  if (phraseSearch) {
    query += ` phraseSearch LIKE '%${phraseSearch}%' AND`;
  }
  if (judge) {
    query += ` judge = '${judge}' AND`;
  }
  if (lawyer) {
    query += ` lawyer = '${lawyer}' AND`;
  }
  if (journals) {
    query += ` journals = '${journals}' AND`;
  }

  if (appellant_or_opponent) {
    query += ` appellant_or_opponent = '${appellant_or_opponent}' AND`;
  }
  if (principleOfCaseLaws) {
    query += ` principleOfCaseLaws = '${principleOfCaseLaws}'`;
  }
  console.log(query.split(" "));
  query = query
    .split(" ")
    .splice(0, query.split(" ").length - 1)
    .join(" ");

  console.log(query);

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(403).send(new BadRequestResponse(err));
    } else {
      return res.send(new OkResponse(result[0], 200));
    }
  });
};

module.exports = {
  uploadCase,
  searchCase,
};

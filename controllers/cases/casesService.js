const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const addCase = (req, res, next) => {
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

const updateCase = (req, res, next) => {
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

  const id = req.params.id;

  if (!id) {
    return res.status(403).send(new BadRequestResponse("Please provide id"));
  }
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

  let update = `UPDATE cases SET year_or_vol = '${year_or_vol}', pageNo = '${pageNo}', month = '${month}', law_or_statute = '${law_or_statute}', section = '${section}', section2 = '${section2}', court = '${court}', caseNo = '${caseNo}', dated = '${dated}', textSearch1 = '${textSearch1}', textSearch2 = '${textSearch2}', phraseSearch = '${phraseSearch}', judge = '${judge}', lawyer = '${lawyer}', appellant_or_opponent = '${appellant_or_opponent}', principleOfCaseLaws = '${principleOfCaseLaws}', journals = '${journals}', file = '${serverLink}' WHERE id = '${id}'`;

  db.query(update, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(403).send(new BadRequestResponse(err));
    } else {
      return res.send(
        new OkResponse("Case has been updated successfully", 200),
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
    query += ` month LIKE'%${month}%' OR`;
  }
  if (law_or_statute) {
    query += ` law_or_statute LIKE '%${law_or_statute}%' OR`;
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
  if (query.includes("OR") && query.endsWith("OR")) {
    query = query.split("OR").slice(0, -1).join(" OR ");
  }
  console.log(query.includes("LIKE"));
  if (!query.includes("LIKE")) {
    return res
      .status(422)
      .send(
        new BadRequestResponse("Please pass at least one search parameter"),
      );
  }
  console.log("-result---", query);

  db.query(query, (err, result) => {
    console.log(result);
    if (err) {
      console.log(err);
      return res.status(403).send(new BadRequestResponse(err));
    }
    if (result.length === 0) {
      return res.send(new OkResponse(result, 200));
    }
    return res.send(new OkResponse(result, 200));
  });
};
const deleteCase = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(403).send(new BadRequestResponse("Please provide id"));
  }
  let deleteQuery = `DELETE FROM cases WHERE id = '${id}'`;
  db.query(deleteQuery, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err));
    }
    return res.send(new OkResponse("Case has been deleted successfully", 200));
  });
};

const getAllCases = (req, res) => {
  let query = `SELECT * FROM cases`;
  db.query(query, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err));
    }
    return res.send(new OkResponse(result, 200));
  });
};
module.exports = {
  addCase,
  searchCase,
  updateCase,
  deleteCase,
  getAllCases,
};

const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const createBlog = (req, res, next) => {
  const { title, paragraph } = req.body.blog || req.body;
  const filePath = req.files[0].path;

  console.log(title, paragraph, filePath);
  if (!title || !paragraph || !filePath) {
    return next(new BadRequestResponse("Please fill all the fields", 400));
  }

  var domain = req.headers.host;
  var pathname = new URL(filePath).pathname;
  var serverLink = pathname.split("\\").splice(-2).join("/");
  const image = domain + "/" + serverLink;
  const query = `INSERT INTO blogs (title, paragraph, image) VALUES ('${title}', '${paragraph}', '${image}')`;
  db.query(query, (err, result) => {
    if (err) {
      return next(new BadRequestResponse(err.message, 400));
    }
    return next(new OkResponse(result, 200));
  });
};

const getAllBlogs = (req, res, next) => {
  const query = `SELECT * FROM blogs`;
  db.query(query, (err, result) => {
    if (err) {
      return next(new BadRequestResponse(err.message, 400));
    }
    return next(new OkResponse(result, 200));
  });
};

const getBlogById = (req, res, next) => {
  const { blogId } = req.params;
  const query = `SELECT * FROM blogs WHERE id = ${blogId}`;
  db.query(query, (err, result) => {
    if (err) {
      return next(new BadRequestResponse(err.message, 400));
    }
    return next(new OkResponse(result, 200));
  });
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
};

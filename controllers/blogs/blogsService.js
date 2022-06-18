const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");
const path = require("path");
var base64ToFile = require("base64-to-file");
const createBlog = (req, res, next) => {
  let { title, paragraph, short_paragraph, author, date } =
    req.body.blog || req.body;

  if (!title || !paragraph || !short_paragraph || !author || !date) {
    return next(new BadRequestResponse("Please fill all the fields", 400));
  }
  try {
    title = title.replace(/'/g, "\\'");
    paragraph = paragraph.replace(/'/g, "\\'");
    short_paragraph = short_paragraph.replace(/'/g, "\\'");
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }

  const filePath = req?.file?.path?.split("\\")?.join("/");
  const query = `INSERT INTO blogs  (title, short_paragraph, paragraph, date, author,file) VALUES ('${title}','${short_paragraph}', '${paragraph}', '${date}', '${author}', '${filePath}')`;

  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Blog has been created", 200));
    });
  });
};

const getAllBlogs = (req, res, next) => {
  const query = `SELECT * FROM blogs`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }

      console.log(result);
      return next(new OkResponse(result, 200));
    });
  });
};

const getBlogById = (req, res, next) => {
  const { blogId } = req.params;
  const query = `SELECT * FROM blogs WHERE id = ${blogId}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse(result, 200));
    });
  });
};

const deleteBlogById = (req, res, next) => {
  const { blogId } = req.params;
  const query = `DELETE FROM blogs WHERE id = ${blogId}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Blog has been deleted", 200));
    });
  });
};

const editBlogById = (req, res, next) => {
  const { blogId } = req.params;
  let { title, paragraph, file, author } = req.body.blog || req.body;

  if (!title || !paragraph || !author) {
    return next(new BadRequestResponse("Please fill all the fields", 400));
  }
  try {
    title = title.replace(/'/g, "\\'");
    paragraph = paragraph.replace(/'/g, "\\'");
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }

  if (!file?.includes("upload")) {
    const filePath = req?.file?.path?.split("\\")?.join("/");
    const query = `UPDATE blogs SET title = '${title}', paragraph = '${paragraph}', file = '${filePath}', author = '${author}' WHERE id = ${blogId}`;
    db.then((conn) => {
      conn.query(query, (err, result) => {
        if (err) {
          return next(new BadRequestResponse(err, 400));
        } else {
          return next(
            new OkResponse("Blog has been updated successfully", 200),
          );
        }
      });
    });
  } else {
    const query = `UPDATE blogs SET title = '${title}', paragraph = '${paragraph}' , file = '${file}' , author = '${author}' WHERE id = ${blogId}`;
    db.then((conn) => {
      conn.query(query, (err, result) => {
        if (err) {
          return next(new BadRequestResponse(err, 400));
        } else {
          return next(
            new OkResponse("Blog has been updated successfully", 200),
          );
        }
      });
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlogById,
  editBlogById,
};

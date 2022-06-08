const { BadRequestResponse, OkResponse } = require('express-http-response');
const db = require('../../db');
const path = require('path');
var base64ToFile = require('base64-to-file');
const createBlog = (req, res, next) => {
  let { title, paragraph, short_paragraph, date, image } =
    req.body.blog || req.body;

  if (!title || !paragraph || !image || !short_paragraph || !date) {
    return next(new BadRequestResponse('Please fill all the fields', 400));
  }
  try {
    title = title.replace(/'/g, "\\'");
    paragraph = paragraph.replace(/'/g, "\\'");
    short_paragraph = short_paragraph.replace(/'/g, "\\'");
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }

  const _path = path.join(process.cwd(), 'public', 'uploads/');
  base64ToFile.convert(
    image,
    _path,
    ['jpg', 'jpeg', 'png', 'pdf'],
    (_filePath) => {
      var pathname = new URL(_filePath).pathname;
      var filePath = pathname.split('\\').splice(-2).join('/');
      console.log(filePath);
      const query = `INSERT INTO blogs  (title, short_paragraph, paragraph, date, image) VALUES ('${title}','${short_paragraph}', '${paragraph}', '${date}', '${filePath}')`;

      db.then((conn) => {
        conn.query(query, (err, result) => {
          if (err) {
            return next(new BadRequestResponse(err.message, 400));
          }
          return res.send(new OkResponse('Blog has been created', 200));
        });
      });
    }
  );
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
      return next(new OkResponse('Blog has been deleted', 200));
    });
  });
};

const editBlogById = (req, res, next) => {
  const { blogId } = req.params;
  const { title, paragraph, image } = req.body.blog || req.body;
  const filePath = req.files[0].path;

  if (!title || !paragraph || !image) {
    return next(new BadRequestResponse('Please fill all the fields', 400));
  }

  const query = `UPDATE blogs SET title = '${title}', paragraph = '${paragraph}', image = '${image}' WHERE id = ${blogId}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse('Blog has been updated', 200));
    });
  });
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlogById,
  editBlogById,
};

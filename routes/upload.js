const express = require("express");
const multer = require("multer");

const getDb = require("../utils/database").getDb;

const router = express.Router();

//Disk storage

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//Filtering files by MIME type

/* const fileFilter = () => {
  if (
    mimetype === "image/png" ||
    mimetype === "image/jpg" ||
    mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
 */

const upload = multer({ storage: fileStorage /* , fileFilter: fileFilter  */ });

//UPLOAD SINGLE FILE AND STORE INFORMATION ABOUT FILE INTO DB

router.post("/upload", upload.single("file"), (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const file = req.file;
  console.log(file);

  if (!file || file.size === 0) {
    return res.json({
      status: 400,
      message: "File doesen't exist or empty.",
    });
  }

  const obj = {
    title: title,
    description: description,
    originalname: file.originalname,
    filename: file.filename,
    encoding: file.encoding,
    mimetype: file.mimetype,
    path: file.path,
    filesize: file.size,
  };

  const db = getDb();
  db.collection("files").insertOne(obj, function (err, data) {
    if (err) {
      return res.json({
        status: 500,
        message: "Can not insert data.",
      });
    }
    return res.json({
      status: 200,
      message: "Succesfully inserted data.",
      data,
    });
  });
});

//UPLOAD MULTIPLE FILES AND STORE INFORMATION ABOUT FILES INTO DB

router.post("/upload/files", upload.array("files", 12), (req, res, next) => {
  const files = req.files;

  console.log(files);

  if (files.length === 0) {
    return res.json({
      status: 400,
      message: "Files array is empty.",
    });
  }

  const arr = [];

  files.forEach((file) => {
    const obj = {
      originalname: file.originalname,
      filename: file.filename,
      encoding: file.encoding,
      mimetype: file.mimetype,
      path: file.path,
      filesize: file.size,
    };
    arr.push(obj);
  });

  const db = getDb();
  db.collection("files").insertMany(arr, function (err, data) {
    if (err) {
      return res.json({
        status: 500,
        message: "Can not insert data.",
      });
    }
    return res.json({
      status: 200,
      message: "Succesfully inserted data.",
      data,
    });
  });
});

module.exports = router;

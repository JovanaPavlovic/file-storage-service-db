const express = require("express");
const fs = require("fs");
const path = require("path");
const getDb = require("../utils/database").getDb;
const ObjectId = require("mongodb").ObjectId;

const router = express.Router();

//GET LIST OF FILES

/* router.get("/files", (req, res, next) => {
  const directory = "./public";

  fs.readdir(directory, (err, files) => {
    if (err) {
      return res.json({
        status: 500,
        message: "Error occured while retriving files.",
      });
    }
    res.json({
      status: 200,
      message: "Data retrived succesfully.",
      files,
    });
  });
}); */

//GET FILES DATA FROM DB

router.get("/files", (req, res, next) => {
  const db = getDb();
  db.collection("files")
    .find({})
    .toArray(function (err, data) {
      if (err) {
        return res.json({
          status: 500,
          message: "Can not retrive data.",
        });
      }
      return res.json({
        status: 200,
        message: "Succesfully retrived data.",
        data,
      });
    });
});

//GET INDIVIDUAL FILE DATA FROM DB

router.get("/files/:id", (req, res, next) => {
  const id = req.params.id;
  const db = getDb();
  db.collection("files")
    .find({ _id: ObjectId(id) })
    .toArray(function (err, data) {
      if (err) {
        return res.json({
          status: 500,
          message: "Can not retrive data.",
        });
      }
      return res.json({
        status: 200,
        message: "Succesfully retrived data.",
        data,
      });
    });
});

//DOWNLOAD ONE FILE

router.post("/download", function (req, res, next) {
  const fileName = req.body.name;
  const filePath = path.join("public", fileName);

  res.download(filePath, fileName, (err) => {
    if (err) {
      return res.json({
        status: 500,
        message: "Could not download the file",
        err,
      });
    }
  });
});

//DOWNLOAD ONE FILE (by routh parameters)

router.get("/download/:name", function (req, res, next) {
  const fileName = req.params.name;
  const filePath = path.join("public", fileName);

  res.download(filePath, fileName, (err) => {
    if (err) {
      return res.json({
        status: 500,
        message: "Could not download the file",
        err,
      });
    }
  });
});

module.exports = router;

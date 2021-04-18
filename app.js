require("dotenv").config();

const express = require("express");
const mongoConnect = require("./utils/database");

const upload = require("./routes/upload");
const download = require("./routes/download");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(upload);
app.use(download);

app.listen(3000);

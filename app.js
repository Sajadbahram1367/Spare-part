const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");

const app = express();
const port = process.env.PORT || 10000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("index", { data: null });
});

app.post("/upload", upload.single("excelFile"), (req, res) => {
  if (!req.file) return res.send("هیچ فایلی انتخاب نشده.");

  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  res.render("index", { data });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});


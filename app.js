const express = require("express");
const multer = require("multer");
const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 10000;

// تنظیمات EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// میدل‌ورها
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// محل ذخیره فایل‌های آپلود شده
const upload = multer({ dest: "uploads/" });

let inventoryData = []; // دیتای فایل موجودی
let mergedPriceData = []; // دیتای فایل قیمت برندها

// صفحه اصلی
app.get("/", (req, res) => {
  res.render("index", { result: null });
});

// آپلود فایل موجودی
app.post("/upload", upload.single("excel"), (req, res) => {
  if (!req.file) return res.send("فایلی انتخاب نشده!");

  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  inventoryData = xlsx.utils.sheet_to_json(sheet);

  fs.unlinkSync(req.file.path); // حذف فایل موقت
  res.send("✅ فایل موجودی با موفقیت بارگذاری شد!");
});

// جستجو در موجودی
app.get("/search", (req, res) => {
  const query = req.query.query?.trim();

  if (!query) return res.render("index", { result: null });

  // تطبیق نام یا کد کالا
  const found = inventoryData.find((item) => {
    return (
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.code?.toString().includes(query)
    );
  });

  if (found) {
    res.render("index", {
      result: {
        found: true,
        data: {
          name: found.name || "نام ندارد",
          code: found.code || "کد ندارد",
          price: found.price || "قیمت ندارد",
          brand: found.brand || "برند ندارد",
        },
      },
    });
  } else {
    res.render("index", { result: { found: false } });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});


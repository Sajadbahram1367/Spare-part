const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// پوشه فایل‌های استاتیک (برای نمایش فرم)
app.use(express.static('views'));

// ساختار ذخیره فایل اکسل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'inventory.xlsx');
  }
});
const upload = multer({ storage });

// نمایش فرم آپلود در صفحه اصلی
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'upload.html'));
});

// مسیر آپلود فایل اکسل و تبدیل به JSON
app.post('/upload-inventory', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', 'inventory.xlsx');
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // ذخیره داده به فایل JSON
  fs.writeFileSync('data/inventory.json', JSON.stringify(data, null, 2));
  res.send('✅ فایل اکسل با موفقیت آپلود و پردازش شد.');
});

// شروع سرور
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});


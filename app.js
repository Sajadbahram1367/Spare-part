
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// تنظیمات Multer برای آپلود فایل
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'inventory.xlsx'); // همیشه با همین اسم ذخیره شه
  }
});
const upload = multer({ storage: storage });

// نمایش فرم آپلود
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'upload.html'));
});

// پردازش فایل اکسل آپلود شده
app.post('/upload-inventory', upload.single('file'), (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // ذخیره فایل JSON
    fs.writeFileSync('data/inventory.json', JSON.stringify(data, null, 2), 'utf-8');

    res.send('✅ فایل با موفقیت آپلود و ذخیره شد.');
  } catch (error) {
    console.error('❌ خطا:', error);
    res.status(500).send('❌ خطا در پردازش فایل');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

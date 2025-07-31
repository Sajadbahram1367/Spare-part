const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// تنظیم ذخیره فایل‌ها در پوشه uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'inventory.xlsx'); // فایل آپلودی همیشه همین اسم رو می‌گیره
  }
});
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('✅ Yadak Market App is running and ready for Excel upload!');
});

// مسیر آپلود اکسل
app.post('/upload-inventory', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', 'inventory.xlsx');
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // ذخیره داده‌ها در فایل JSON
  fs.writeFileSync('data/inventory.json', JSON.stringify(data, null, 2));
  res.send('📦 فایل موجودی با موفقیت آپلود و پردازش شد.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');

// CheckFile type
function checkFileType(file, cb) {
  // Allowed extension
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extention
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only');
  }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public folder
app.use(express.static('./public'));

// Home Route
app.get('/', (req, res) => {
  res.render('index')
});

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render('index', {
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render('index', {
          msg: 'Error: No file selected'
        })
      } else {
        res.render('index', {
          msg: 'File uploaded',
          file: `uploads/${req.file.filename}`
        })
      }
    }
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is started on http://localhost:${port}`);
})
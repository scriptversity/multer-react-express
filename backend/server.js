const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },

  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Error: File upload only supports the following filetypes - " +
            filetypes
        )
      );
    }
  },
});

// Route for uploading single file
app.post("/upload_single", upload.single("file"), uploadSingle);

function uploadSingle(req, res) {
  // console.log("req file", req.file);
  console.log(req.body);
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const uploadedFile = req.file;
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      uploadedFile.filename
    }`;

    console.log(fileUrl);
    res.json({ message: "Successfully uploaded single file", fileUrl });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

// Route for uploading multiple files
app.post("/upload_files", upload.array("files"), uploadFiles);

function uploadFiles(req, res) {
  // console.log(req.body);
  console.log(req.files);
  res.json({ message: "Successfully uploaded files" });
}

// Route for deleting a file
app.delete("/delete_file/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(400).json({ message: "File not found or unable to delete" });
    }
    res.json({ message: `File ${filename} deleted successfully` });
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files from the "uploads" folder

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(8000, () => {
  console.log(`Server started...`);
});


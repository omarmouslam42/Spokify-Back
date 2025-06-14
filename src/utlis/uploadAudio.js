// middlewares/uploadAudio.js
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve("public");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `recording-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

export const uploadAudio = upload.single("audio");

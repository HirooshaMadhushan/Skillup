import multer from 'multer';
import path from 'path';
import fs from 'fs';

const lessonUploadDir = 'uploads/lessons';
const assignmentUploadDir = 'uploads/assignments';
const submissionUploadDir = 'uploads/submissions';

// Ensure directories exist
[lessonUploadDir, assignmentUploadDir, submissionUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'assignment') cb(null, assignmentUploadDir);
    else if (file.fieldname === 'submission') cb(null, submissionUploadDir);
    else cb(null, lessonUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['.mp4', '.pdf', '.mkv', '.avi', '.zip', '.docx', '.pptx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

export const lessonUpload = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } });
export const assignmentUpload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });
export const submissionUpload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });

const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpe?g|png|gif)$/)) return cb(new Error('Type error'), false);
    return cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 }, // 1MB (byte)
});

const uploadLimits = (err, req, res, next) => {
  if (err.message === 'Type error') return res.send({ success: false, message: '不支援的檔案格式' });
  if (err.message === 'File too large') return res.send({ success: false, message: '超過圖片限制大小' });
  return next();
};

module.exports = {
  upload,
  uploadLimits,
};

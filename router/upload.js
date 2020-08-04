const router = require('express').Router();
const axios = require('axios').default;
const { upload, uploadLimits } = require('../middleware/uploadHandler');

// 圖片上傳
router.post('/', upload.single('image'), uploadLimits, async (req, res) => {
  const uploadUrl = 'https://api.imgur.com/3/image';
  const uploadData = {
    image: req.file.buffer.toString('base64'),
    name: req.file.originalname,
    album: '2AkrbfT',
  };
  const tokenUrl = 'https://api.imgur.com/oauth2/token';
  const tokenData = {
    client_id: process.env.IMGUR_CLIENT_ID,
    client_secret: process.env.IMGUR_CLIENT_SECRET,
    refresh_token: process.env.IMGUR_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  };
  try {
    const token = await axios.post(tokenUrl, tokenData);
    const config = {
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    };
    const image = await axios.post(uploadUrl, uploadData, config);
    return res.send({ success: true, imgUrl: image.data.data.link });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;

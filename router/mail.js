const router = require('express').Router();
const nodemailer = require('nodemailer');

// 前台 && 發送郵件
router.post('/', async (req, res) => {
  const { nickname, email, subject } = req.body;
  const { imgUrl, content } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });
  try {
    await transporter.sendMail({
      from: `"${nickname}"<${process.env.GOOGLE_EMAIL}>`,
      to: `"student"<${email}>`,
      subject,
      html: `
      <img src="${imgUrl}" style="width: 100%;">
      <p>${content}</p>
      `,
    });
    return res.send({ success: true, message: '發送成功' });
  } catch (error) {
    return res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

module.exports = router;

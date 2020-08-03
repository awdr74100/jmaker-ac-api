const router = require('express').Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin');

// 前台 && 管理員註冊
router.post('/signup', async (req, res) => {
  const { email, password, nickname } = req.body;
  try {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    await Admin.create({
      email,
      password: hash,
      nickname,
    });
    return res.send({ success: true, message: '註冊成功' });
  } catch (error) {
    if (error.code === 11000) return res.send({ success: false, message: '重複註冊' });
    return res.status(500).send({ success: false, message: error.message });
  }
});

// 前台 && 管理員登入
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({
      email,
    });
    if (!admin) return res.send({ success: false, message: '帳號或密碼錯誤' });
    const pass = await argon2.verify(admin.password, password);
    if (!pass) return res.send({ success: false, message: '帳號或密碼錯誤' });
    const token = jwt.sign({ id: admin.id }, `${process.env.JWT_SECRET}`, { expiresIn: 60 * 15 });
    return res
      .cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15, // 15min
        sameSite: 'none',
        secure: true,
      })
      .send({ success: true, admin: { email: admin.email, nickname: admin.nickname } });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
});

// 前台 && 檢查是否持續登入
router.post('/check', (req, res) => {
  const exp = new Date(req.user.exp * 1000).getMinutes();
  const now = new Date().getMinutes();
  const interval = exp - now < 0 ? 60 + (exp - now) : exp - now;
  if (interval < 5) {
    const token = jwt.sign({ id: req.user.id }, `${process.env.JWT_SECRET}`, { expiresIn: 60 * 15 });
    return res
      .cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15, // 15min
        sameSite: 'none',
        secure: true,
      })
      .send({ success: true });
  }
  return res.send({ success: true });
});

// 前台 && 管理員登出
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    sameSite: 'none',
    secure: true,
  });
  return res.send({ success: true, message: '已登出' });
});

module.exports = router;

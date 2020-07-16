const router = require('express').Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin');

// 前台 - 管理員註冊
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    await Admin.create({
      email,
      password: hash,
    });
    res.send({ success: true, message: '成功註冊' });
  } catch (error) {
    if (error.code === 11000) {
      res.send({ success: false, message: '重複註冊' });
      return;
    }
    res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 前台 - 管理員登入
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({
      email,
    });
    if (!admin) {
      res.send({ success: false, message: '帳號或密碼錯誤' });
      return;
    }
    const pass = await argon2.verify(admin.password, password);
    if (!pass) {
      res.send({ success: false, message: '帳號或密碼錯誤' });
      return;
    }
    const token = jwt.sign({ id: admin.id }, `${process.env.JWT_SECRET}`, { expiresIn: 5 });
    res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 });
    res.send({ success: true, message: '登入成功' });
  } catch (error) {
    res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 前台 - 檢查是否持續登入
router.post('/check', async (req, res) => {
  res.send(req.user);
});

router.get('/', async (req, res) => {
  const admins = await Admin.find();
  res.send(admins);
});

module.exports = router;

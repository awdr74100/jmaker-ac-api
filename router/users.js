const router = require('express').Router();
const User = require('../model/user');

// 硬體 && 用戶加入
router.post('/', async (req, res) => {
  const { id } = req.body;
  try {
    await User.create({ _id: id });
    return res.send({ success: true, message: '加入成功' });
  } catch (error) {
    if (error.code === 11000) return res.send({ success: false, message: '重複加入' });
    return res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 硬體 && 權限檢查
router.get('/:id/auth', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.send({ success: false, message: '用戶尚未加入' });
    if (!user.register_at) return res.send({ success: false, message: '用戶尚未完成實體註冊' });
    if (!user.auth) return res.send({ success: false, message: '用戶權限遭移除' });
    return res.send({
      success: true,
      user: { username: user.username, userid: user.userid },
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 前台 && 取得所有用戶
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    return res.send({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 前台 && 取得指定用戶
router.get('/:userid', async (req, res) => {
  const { userid } = req.params;
  try {
    const user = await User.findOne({
      userid,
    });
    return res.send({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 前台 && 刪除指定用戶
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    return res.send({ success: true, message: '刪除成功' });
  } catch (error) {
    return res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 前台 && 實體用戶註冊
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, userid } = req.body;
  try {
    const user = await User.findOne({
      userid,
    });
    if (user) return res.send({ success: false, message: '重複註冊' });
    await User.findByIdAndUpdate(id, {
      username,
      userid,
      register_at: Date.now(),
    });
    return res.send({ success: true, message: '註冊成功' });
  } catch (error) {
    return res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 前台 && 調整訪問權限
router.patch('/:id/auth', async (req, res) => {
  const { id } = req.params;
  const { auth } = req.body;
  try {
    await User.findByIdAndUpdate(id, {
      auth,
    });
    return res.send({ success: true, message: '調整成功' });
  } catch (error) {
    return res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

module.exports = router;

const router = require('express').Router();
const User = require('../model/user');

// 硬體 - 加入用戶
router.post('/', async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    if (user) {
      res.status(409).send({ success: false, message: '重複註冊' });
      return;
    }
    await User.create({ _id: id });
    res.status(201).send({ success: true, message: '成功加入' });
  } catch (error) {
    res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 硬體 - 權限檢查
router.get('/:id/auth', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(401).send({ success: false, message: '尚未註冊' });
      return;
    }
    if (!user.approvalAt) {
      res.status(403).send({ success: false, message: '未完成實體用戶註冊' });
      return;
    }
    if (!user.auth) {
      res.status(403).send({ success: false, message: '權限遭移除' });
      return;
    }
    res.status(200).send({ success: true, message: '成功進入' });
  } catch (error) {
    res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 前台 - 取得所有用戶
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 前台 - 取得指定用戶
router.get('/:userNumber', async (req, res) => {
  const { userNumber } = req.params;
  try {
    const user = await User.findOne({
      userNumber,
    });
    res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 前台 - 刪除指定用戶
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).send({ success: '成功刪除' });
  } catch (error) {
    res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 前台 - 實體用戶註冊
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { userName, userNumber } = req.body;
  try {
    await User.findByIdAndUpdate(id, {
      userName,
      userNumber,
      approvalAt: Date.now(),
    });
    res.status(200).send({ success: true, message: '成功註冊' });
  } catch (error) {
    res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

// 前台 - 調整訪問權限
router.patch('/:id/auth', async (req, res) => {
  const { id } = req.params;
  const { auth } = req.body;
  try {
    await User.findByIdAndUpdate(id, {
      auth,
    });
    res.status(200).send({ success: true, message: '成功調整' });
  } catch (error) {
    res.status(500).send({ success: false, message: '操作失敗，系統存在異常' });
  }
});

module.exports = router;

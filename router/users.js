const router = require('express').Router();
const User = require('../model/user');

router.get('/', (req, res) => {
  res.send('Hi');
});

router.post('/', async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await User.create({
      _id: uid,
    });
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;

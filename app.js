const app = require('express')();
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import Router
const usersRouter = require('./router/users');

app.use('/api/v2/users', usersRouter);

// mongoose connect
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('連接成功'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`開啟 port 為 ${port} 的 localhost`);
});

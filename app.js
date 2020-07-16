/* eslint-disable comma-dangle */
require('dotenv').config();
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressJwt = require('express-jwt');
const mongoose = require('mongoose');

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3001'],
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    getToken: function fromHeaderOrQuerystring(req) {
      if (req.cookies.token) return req.cookies.token;
      return null;
    },
  }).unless({
    path: [
      /^\/*/,
      // { url: /^\/api\/v2\/users$/, methods: ['POST'] },
      // { url: /^\/api\/v2\/users\/([^/]*)\/auth$/, methods: ['GET'] },
      // { url: /^\/api\/v2\/admin\/login$/, methods: ['POST'] },
    ],
  })
);

// import Router
const usersRouter = require('./router/users');
const adminRouter = require('./router/admin');

const path = '/api/v2';
app.use(`${path}/users`, usersRouter);
app.use(`${path}/admin`, adminRouter);

// mongoose connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('連接成功'));

// error handler
app.use((err, req, res, next) => {
  if (err.code === 'credentials_required') res.send({ success: false, message: '未帶有訪問令牌' });
  if (err.code === 'invalid_token') res.send({ success: false, message: '無效的訪問令牌' });
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`開啟 port 為 ${port} 的 localhost`);
});

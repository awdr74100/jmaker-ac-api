require('dotenv').config();
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressJwt = require('express-jwt');
const mongoose = require('mongoose');

const corsOptions = {
  credentials: true,
  origin: ['https://jmaker-ac.netlify.app'],
};

const expressJwtOptions = {
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.cookies.token) return req.cookies.token;
    return null;
  },
};

const expressJwtUnless = {
  path: [
    // /^\/*/,
    { url: /^\/api\/admin\/users$/, methods: ['POST'] },
    { url: /^\/api\/admin\/users\/([^/]*)\/auth$/, methods: ['GET'] },
    { url: /^\/api\/admin\/signin$/, methods: ['POST'] },
    { url: /^\/api\/admin\/signout$/, methods: ['POST'] },
  ],
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressJwt(expressJwtOptions).unless(expressJwtUnless));

// import Router
const admin = require('./router/admin/index');
const adminUsers = require('./router/admin/users');
const adminUpload = require('./router/admin/upload');
const adminMail = require('./router/admin/mail');

app.use('/api/admin', admin);
app.use('/api/admin/users', adminUsers);
app.use('/api/admin/upload', adminUpload);
app.use('/api/admin/mail', adminMail);

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
  if (err.code === 'credentials_required') return res.send({ success: false, message: '未帶有訪問令牌' });
  if (err.code === 'invalid_token') return res.send({ success: false, message: '無效的訪問令牌' });
  return res.send({ success: false, message: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`開啟 port 為 ${port} 的 localhost`));

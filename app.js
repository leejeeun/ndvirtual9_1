const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser")
const passport = require("passport")
const session = require("express-session")
const flash = require("connect-flash")

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth')
const checkRouter = require("./routes/check")
const resultRouter = require("./routes/result")

const app = express();

// const multer = require("multer")
// const xlsx = require("read-excel-file/node")
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/")
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })
// const upload = multer({storage: storage})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use("/send")
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(session({
  secret: "차가운 바람이 이자릴 지나면 우리는 사라지나요?",
  resave: false,
  saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/auth", authRouter)
app.use("/check", checkRouter)
app.use("/result", resultRouter)

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8000, function(){
  console.log("server started at port : " + 8000)
})

module.exports = app;

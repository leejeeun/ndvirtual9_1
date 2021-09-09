const express = require('express');
const router = express.Router();
const http = require("http")
const url = require("url")
const nodemailer = require("nodemailer")
// const excel = require("excel4node")
const multer = require("multer")
const xlsx = require("read-excel-file/node")
const fs = require("fs")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "routes/uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})
// const upload = multer({dest: "upload/"})
// const upload = multer({dest: ""})
// const mailList = []

let transporter = nodemailer.createTransport({
    // host: "localhost",
    host: "mail.narangmarketing.com",
    port: 25,
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
})

router.get('/', function (req, res, next) {
    res.render('main', {title: 'Express'});
});

// router.get("/send", upload.single("excelFile"), function (req, res, next) {
router.get("/send",  function (req, res, next) {
    res.render("index")
})

// router.post("/send", upload.single("ef"), function (req, res, next) {
router.post("/send", upload.single("ef"), function (req, res, next) {
    let mailList = []
    // let mailList = ""
    console.log(req.file.originalname)
    console.log("dirname : " + __dirname)
    xlsx(__dirname + "/uploads/" + req.file.originalname).then((rows) => {
        for(let i in rows){
            console.log("row : " + rows[i][1])
            mailList.push(rows[i][1])
        }
    })
    // let from = req.body.from
    let from = "nd10@narangdesign.com"
    let title = req.body.title
    let today = "first"
    let html = req.body.html
    // mailList.push("yoloyolotangzinzam@gmail.com")
    // mailList.push("nd9@narangdesign.com")
    // mailList.push("tra_sh@naver.com")
    // mailList.push("batch402@hanmail.net")
    // mailList.push("nd6@narangdesign.com")
    // mailList.push("nd8@narangdesign.com")
    let mailno = 1
    for (let i = 0; i < mailList.length; i++){
        console.log("mailList : " + mailList)
        let message = {
            from: from,
            to: mailList[i],
            cc: "",
            subject: title,
            text: "",
            html: html +
                "<img src = \'https://www.narangmarketing.com/check?mailno=" +
                today +
                "&email=" +
                mailList[i] +
                "&count=" +
                mailList.length +
                "&title=" +
                title +
                "\' width='1' height='0'>"
        }
        transporter.sendMail(message, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log("================================================")
                console.log(info)
                console.log("================================================")
            }
        })
    }

    res.render("send")
})


module.exports = router;
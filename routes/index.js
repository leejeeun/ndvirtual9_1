const express = require('express');
const router = express.Router();
const http = require("http")
const url = require("url")
const nodemailer = require("nodemailer")
const multer = require("multer")
const xlsx = require("read-excel-file/node")
const fs = require("fs")
const path = require("path")
const storage = multer.diskStorage({
    destination: (req, file, done) => {
        done(null, "routes/uploads/");
    },
    //지정
    // convert a file name
    filename: (req, file, done) => {
        const ext = path.extname(file.originalname);
        done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
})
const upload = multer({storage: storage})

const transporter = nodemailer.createTransport({
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

router.get("/send",  function (req, res, next) {
    res.render("index")
})

router.post("/send", upload.single("ef"), function (req, res, next) {
    let mailList = []
    let from = "nd10@narangdesign.com"
    let title = req.body.title
    let today = "first"
    let html = req.body.html
    let mailno = 1

    console.log(__dirname + "/uploads/" + req.file.originalname)
    xlsx(__dirname + "/uploads/" + req.file.originalname).then((rows) => {
        for(let i in rows){
            console.log("row : " + rows[i][1])
            mailList.push(rows[i][1])
        }
    })

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
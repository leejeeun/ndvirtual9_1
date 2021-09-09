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
        done(null, path.basename(file.originalname, ext) + ext);
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

router.get("/send", function (req, res, next) {
    res.render("index")
})

router.post("/send", upload.single("ef"), function (req, res, next) {
    let from = "nd10@narangdesign.com"
    let title = req.body.title
    // let today = "first"
    let html = req.body.html
    let mailno = new Date()

    // dir = "E:\\ndvirtual9_1\\routes\\uploads\\통합 문서1.xlsx"
    dir = __dirname + "/uploads/" + req.file.originalname
    console.log("DIR : " + dir)
    excelParse(dir)

    function excelParse(dir) {
        xlsx(dir).then((rows) => {
            for (let i in rows) {
                // console.log("row : " + rows[i][0])
                let message = {
                    from: from,
                    to: rows[i][0],
                    cc: "",
                    subject: title,
                    text: "",
                    html: html +
                        "<img src = \'https://www.narangmarketing.com/check?mailno=" +
                        mailno +
                        "&email=" +
                        rows[i][0] +
                        "&count=" +
                        rows.length +
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
        })
    }
    res.render("send")
})




module.exports = router;
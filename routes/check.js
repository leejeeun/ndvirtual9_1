const express = require("express")
const requestIp = require("request-ip")
const router = express.Router()
const mysql = require("mysql")

const connection = mysql.createConnection(
    {
        // host: "localhost",
        host: "211.37.173.172",
        user: "root",
        password : "root1@34",
        database : "narangmarketing"
    }
)

// connection.connect()

router.get("/", function (req, res, next) {
    // let addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    // let ip = requestIp.getClientIp(req)
    let mailno = req.query.mailno
    let email = req.query.email
    let count = req.query.count
    let title = req.query.title
    console.log("email" + email)
    let sql = "insert into result (mail_no, email, count, title) values('" + mailno + "','" + email + "','"
        + count + "','" + title + "');"
    connection.query(sql, function(err, rst, flds){
        if(err){
            console.log("ERR : " + err)
        }
        console.log("rst : " + rst)
    })
    res.render("open")
})

// connection.end()
module.exports = router
const express = require("express")
const router = express.Router()
const mysql = require("mysql2/promise")
// important

const connection = mysql.createPool(
    {
        host: "211.37.173.172",
        user: "root",
        password: "root1@34",
        database: "narangmarketing"
    }
)

router.get("/", async function (req, res, next) {
    const sql1 = "select distinct mail_no from result"
    const sql2 = "select count, title from result where mail_no ='"
    const sql3 = "select count(distinct email) from result where mail_no = '"

    let resultArrayList = []

    let rst1 = await (await connection).execute(sql1)
    for(let i = 0; i < rst1[0].length; i++){
        let rst2 = await (await connection).execute(sql2 + rst1[0][i].mail_no + "' limit 1")
        let rst3 = await (await connection).execute(sql3 + rst1[0][i].mail_no + "'")
        resultArrayList.push({
            mailno : rst1[0][i].mail_no,
            count : rst2[0][0].count,
            title : rst2[0][0].title,
            recieved : rst3[0][0]['count(distinct email)'],
            percent : (rst3[0][0]['count(distinct email)'] / parseInt(rst2[0][0].count) * 100) + "%"
        })
    }

    for(let i = 0; i < resultArrayList.length; i++){
        console.log(resultArrayList[i])
    }

    res.render("result", {data : resultArrayList})
})

module.exports = router
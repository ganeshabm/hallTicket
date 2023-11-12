const fs = require("fs")
const http = require("http")
const url = require("url")
const express = require("express")
const app = express()
app.use(express.static(__dirname))
const PORT = process.env.PORT || 8080
let data = fs.readFileSync("./hallTicket.html", "utf-8")
let index = fs.readFileSync("./index.html", "utf-8")
let credentials = fs.readFileSync("./assets/logindetails.js", "utf-8")
let details = fs.readFileSync("./assets/details.js", "utf-8")
let currentDate = new Date()
const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true
}
const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
  currentDate
)
const sendHallticket = (req, res) => {
  res.set("Content-Type", "text/html")
  res.status(200)
  res.send(data) // Serve the HTML file
}
let output = ""
const renderHallTicket = (dataStr, resdetails, det) => {
  let i = 1
  const valDet = resdetails[`${det}`]
  let val = dataStr.replace(/%yearMonth%/g, valDet.year)
  val = val.replace(/%program%/g, valDet.Programme)
  val = val.replace(/%collegeCode%/g, valDet.College_Code)
  val = val.replace(/%studentName%/g, valDet.name)
  val = val.replace(/%photoPath%/g, valDet.image)
  val = val.replace(/%examCenter%/g, valDet.Exam_Center)
  val = val.replace(/%dateAndTime%/g, formattedDate)
  let usnNo = valDet.usn.split("").map((val) => {
    return `<th>${val}</th>`
  })
  let stdid = valDet.studentid.split("").map((val) => {
    return `<th>${val}</th>`
  })
  val = val.replace("%usn%", usnNo.join(""))
  val = val.replace("%studentId%", stdid.join(""))
  let tableVal = valDet.subject.map((val) => {
    tableval = `<tr>
      <td>${i}</td>
      <td>${val[0]}</td>
      <td>${val[1]}</td>
      <td>${val[2]}</td>
      <td>${val[3]}</td>
      <td></td>
      <td></td>
    </tr>`
    i += 1
    return tableval
  })
  val = val.replace("%table%", tableVal.join(" "))
  return val
}
const login = (req, res) => {
  ;({
    query: { username, password }
  } = url.parse(req.url, true))
  output = JSON.parse(credentials).filter((val) => {
    if (val[0] === username && val[1] === password) return val
  })
  if (output != "") {
    res.set("Content-Type", "text/html")
    res.status(200)
    const renderData = renderHallTicket(data, JSON.parse(details), username)
    res.send(renderData)
  } else {
    let errorData = index.replace(
      /%error%/g,
      "Login Failed!!! Credentials Are Wrong"
    )
    res.send(errorData)
  }
}
// Create HTTP server and listen on port 3000
app.get("/download", sendHallticket)
app.get("/login", login)
app.listen(PORT, () => {
  console.log(`initiating ${PORT}`)
})

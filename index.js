const fs = require('fs');
const http = require('http');
const url = require('url');
const express = require('express');
const app = express();
app.use(express.static(__dirname));
let data = fs.readFileSync('./hallTicket.html', 'utf-8');
const sendHallticket = (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200);
  res.send(data); // Serve the HTML file
};
app.get('/', sendHallticket);
app.get('/download', sendHallticket);
app.listen(8000, () => {
  console.log('initiating ' + 8000);
});

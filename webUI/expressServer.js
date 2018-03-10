const express = require('express')
const app = express()
const port = 3000

var path = require('path');
var appDir = path.dirname(require.main.filename);
console.log("running in : " +appDir)

app.get('/', (request, response) => {
    response.sendFile(appDir + "/index.html")
})

app.get('/*.*', (request, response) => {
    response.sendFile(appDir + request.url)
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
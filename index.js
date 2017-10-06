'use strict'

let http=require('http');
http.createServer(  (request, response)=>
{
  // 傳送HTTP header
  // HTTP Status: 200 : OK
  // Content Type: text/plain
  response.writeHead(200,
  { 'Content-Type': 'text/plain'  });

  //傳送回應內容
  response.end('Hello World!\n');

  console.log('request.headers:\n', request.headers)
}).listen(8088);

// log message to Console
console.log('伺服器啟動，連線rul: http://127.0.0.1:8088/')

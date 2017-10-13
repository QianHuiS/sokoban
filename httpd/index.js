/*相對路徑:
  "."表當前資料夾下方, ".."表上一層資料夾下方.
ex.
  ../../../A/C 表上層的上層的上層中的A中的C資料夾.

ps.
  不同於絕對路徑, 其優點為, 由當前資料夾為起點,
  而非綁定在特定路徑(磁碟等)下, 可通用於各個作業系統開啟.
*/

/*參數err, data:
  err表讀取錯誤, 如印蝶壞掉.檔案不存在...等, 發生錯誤時通知programmer.
  data表讀取成功, 將讀取的內容儲存在data.
  response.write(data)即寫入上面變數data讀取檔案後儲存的內容.
  目前沒有寫對err狀況的處理方式.
*/

'use strict'

let http=require('http');
http.createServer(  (request, response)=>
{
  //以下改動, 為js接受使用者要求, 回應啟動物件(html檔).
  let fs=require('fs')  //fs: field system.

  fs.readFile('../htdocs/index.html', (err, data)=>   //相對路徑讀取檔案
  {
    // 傳送HTTP header
    // HTTP Status: 200 : OK
    // Content Type: text/plain
    response.writeHead(200,
    { 'Content-Type': 'text/html'  });  //原為plain(一般文字), 現改為html.

    response.write(data);  //將資料回應給客戶端.

    response.end();  //告訴客戶端內容已經傳完.
  });
}).listen(8088);

// log message to Console
console.log('伺服器啟動，連線rul: http://127.0.0.1:8088/')

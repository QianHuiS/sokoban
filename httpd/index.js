//本檔案為, 用js程式讀取HTML檔.

//let:用途類似include/import, 載入函數庫.

/*相對路徑:
  "."表當前資料夾下方, ".."表上一層資料夾下方.
ex.
  ../../../A/C 表上層的上層的上層中的A中的C資料夾.

ps.
  不同於絕對路徑, 其優點為, 由當前資料夾為起點,
  而非綁定在特定路徑(磁碟等)下, 可通用於各個作業系統開啟.
*/

/*
  fs為node.js的Field System模組,
  readFile('檔案路徑', (err, data)){讀檔後執行內容}: 用來讀取檔案;
  參數err, 用來接收讀取錯誤的資訊, 如印蝶壞掉.檔案不存在...等, 發生錯誤時通知programmer.
  參數data, 用來儲存讀取成功後的檔案內容.
  本程式沒有寫對err狀況的處理方式.
  response.write(data): 即寫入上面變數data儲存的內容, 用來回應瀏覽器客戶端body.
*/

/*
  當客戶端連線後, 瀏覽器會送根目錄給伺服器.
  所以我們設定switch的case, 當讀取到跟目錄(/)時的處理方式.
  處理方式為: 讀取HTML檔(檔案中又連結去讀取CSS檔)

*/

'use strict'

let http=require('http');

http.createServer(  (request, response)=>
{
  //以下改動, 為js接受使用者要求, 回應啟動物件(html檔).
  let fs=require('fs')  //fs: field system.
  let postData='';  //POST資料  !!!

  // 利⽤ 'data' event 消耗掉 data chunk;  !!!
  // 'end' event 才會被 fired  !!!
  request.on('data', (chunk)=>
  {
    postData+=chunk;    //瀏覽器將文章分段成很多chunk, 將他們重新組合到postData這個變數中.
    console.log(' 接收的 POST data 片段 k: [' + chunk +'].');
  });

  request.on('end', ()=>
  {
    switch(request.url)
    {
      case '/':
        fs.readFile('../htdocs/index.html', (err, data)=>   //相對路徑讀取檔案
        {
          if(err)
            console.log(' 檔案讀取錯誤');

          else
          {
            // 傳送HTTP header
            // HTTP Status: 200 : OK
            // Content Type: text/plain
            response.writeHead(200,
            { 'Content-Type': 'text/html'  });  //原為plain(一般文字), 現改為html.
          }   //檔案本身雖然是HTML, 但是檔中連結還包含了CSS和PNG檔 !!!
          //'text/css', 'image/png'.

          response.write(data);  //將資料回應給客戶端.
          response.end();  //告訴客戶端內容已經傳完.
        });
        break;

      case '/assets/css/styles.css':
        fs.readFile('../htdocs/assets/css/styles.css', (err, data)=>
        {
          if(err)
            console.log(' 檔案讀取錯誤');

          else
          {
            // 傳送HTTP header
            // HTTP Status: 200 : OK
            // Content Type: text/plain
            response.writeHead(200,
            { 'Content-Type': 'text/css'  });
          }   //'image/png'.

          response.write(data);  //將資料回應給客戶端.
          response.end();  //告訴客戶端內容已經傳完.
        });
        break;

      case '/assets/png/SokobanClone_byVellidragon.png':
        fs.readFile('../htdocs/assets/png/SokobanClone_byVellidragon.png', (err, data)=>
        {
          if(err)
            console.log(' 檔案讀取錯誤');

          else
          {
            // 傳送HTTP header
            // HTTP Status: 200 : OK
            // Content Type: text/plain
            response.writeHead(200,
            { 'Content-Type': 'image/png'  });
          }

          response.write(data);  //將資料回應給客戶端.
          response.end();  //告訴客戶端內容已經傳完.
        });
        break;

//      case '/favicon.ico': 圖標沒有設定, 再看要不要做.

      default:
        console.log(' 未定義存取: ' +request.url);
        response.end();
        break;
    }
  });
}).listen(8088);

// log message to Console
console.log('伺服器啟動，連線rul: http://127.0.0.1:8088/')

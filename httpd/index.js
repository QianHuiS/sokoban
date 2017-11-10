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
/*瀏覽器錯誤!!!
  若是在開發網頁的測試時, 有可能因為網頁相同,
  所以瀏覽器快取覺得檔案沒有改變, 故沒有讀取重存的檔案.

  此時, chrome可以開啟開發者模式(一定會重新讀取); 或是對快取作設定,將它關閉.
*/
/*
  request.on( '事件名', 函數(引數); );:
  當事件發生時的處理方式.
    on, 當事件發生時.
    函數為, 事件發生時執行的動作.
    *網頁的函數通常為匿名函數, 故只有" ()"沒有名字,
     匿名函數為臨時定義, 故後面為定義.
     ex. ()=>{定義}
*/

/*
  所有函數都是物件, 所有物件不一定都是函數.
  javascript的物件宣告(函數物件)
  const objectName=
  {
    object1
    {
      key1: value,
      key2: value,
      ...
    },
    object2
    { ... },
    ...
  }

    key==property: 屬性.
*/


'use strict'

let http=require('http');

const routingTable=   //建立路由表(routing table), 用來查詢對應的request.url.
{
  '/':
  {
    url: '../htdocs/index.html',
    type: 'text/html'
  },
  '/styles.css':    //簡化/assets/css/styles.css
  {
    url: '../htdocs/assets/css/styles.css',
    type: 'text/css'
  },
  '/SokobanClone_byVellidragon.png':   //簡化/assets/png/SokobanClone_byVellidragon.png'
  {
    url: '../htdocs/assets/png/SokobanClone_byVellidragon.png',
    type: 'text/css'
  },
};

/*
  利⽤ http.ServerResponse 物件回傳檔案內容

  @name serve                                //物件名稱: serve
  @function                                  //物件類型: 函數
  @param response - http.ServerResponse 物件  //參數1: 瀏覽器回傳物件
  @param fname - 要回傳的檔案名                 //參數2: 回傳的檔名
  @param datatype - 回傳檔案內容的 Mine-Type    //參數3: 回傳內容的資料型別
  @returns {undefined}                        //函數回傳值為空.
*/
let serve=(response, fname, datatype)=>   //把switch重複的code改成函數.
{
  let fs=require('fs');

  fs.readFile(fname, (err, data)=>  //參數1用相對路徑讀取檔案; 參數2可能為err或data.
  {
    if(err) console.log('檔案讀取錯誤');  //若錯誤, 顯示在命令提示字元的日誌.
    else
    {
      // 傳送HTTP header
      // HTTP Status: 200 : OK
      // Content Type: 目前有'text/html', 'text/css', 'image/png' 3種.
      response.writeHead(200, { 'Content-Type': datatype  });

      response.write(data);  //將資料回應給客戶端.
      response.end();  //告訴客戶端內容已經傳完.
    }
  });
};

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
    if (request.url in routingTable)    //搜尋路由表, 如果有找到對應的存取.
    {
      let obj = routingTable[request.url];  //設obj為表中對應的物件路徑.
      serve(response, obj.url, obj.type); //呼叫serve函數填入表中的內容進行設定.
    }
    else
    {
      console.log(' 未定義的存取: ' + request.url);
      response.end();
    }
  });
}).listen(8088);

// log message to Console
console.log('伺服器啟動，連線rul: http://127.0.0.1:8088/')

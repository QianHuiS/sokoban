//require('檔案名'): 要求.
//function(使用者的要求動作, 回應的動作){回應物件}.
/*
  write Head(): HEAD, 用來規範定義後面的內容.
  write(): BODY, 可有可無.
  end(): END,
*/

/*
  require('模組'):
  載入模組, 類似include(C).import(java).
ex. require('http'): 處理符合HTTP協定的一個函式庫.
*/

//http.createServer(): 建立.啟動一個伺服器物件傳回.

//console: 命令提示字元.
//log: 日誌, 即事件紀錄, 給programmer看執行資訊.
//javascript的字串用雙/單引號皆可, 輸入內容含引號時可使用另一個引號. ex.' I say "Hi" '
/*
  .listen(8088)為串接的簡寫方式
*/

//伺服器: 當使用者客戶端送需求才回應.
//callback function: 當事件發生時, 由系統或程式自行呼叫進行回應. (programmer只需定義回應方式)
//request: 要求; response: 回應.
//function(request, response): 兩參數為建立一個符合HTTP協定類型的物件, 但具體內容尚未定義.


//建立伺服器
var http=require('http');   //產生網頁伺服器類別的物件.
http.createServer(  function(request, response)   //function為函式型態, 此處沒有名字為callback function匿名函數. (不需要呼叫故不須命名)
{
  //  Send the HTTP header
  //  HTTP Status: 200 : OK
  //  Content Type: text/plain

  //HEAD
  response.writeHead( 200,    //代號200為狀態碼, 表成功, 404表不存在.
  { 'Content-Type': 'text/plain'  });   //此處為MIME type(文件傳輸內容型別定義).

  //  Spend the response body

  //BODY&END結合
  response.end('Hello World!\n');  //不論要求, 一律回應.

  console.log('request.headers:\n', request.headers)    //在命令提示字元, 列出執行狀況.
}).listen(8088);  //伺服器位置.

//  log message to Consoje
console.log('Server running at http://127.0.0.1:8088/');    //在命令提示字元, 告知我們伺服器已啟動了.

//hello.js

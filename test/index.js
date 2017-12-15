/*
  本次重點: 用javascript產生html內容, 由html讀js檔形成網頁. (SPA基本)

  Single Page Application(SPA)
  >單一網頁應用程式; 以javascript產生html.
  >優點: 從html檔無法看出網頁原始碼.運作方式, 避免了html被隨便看的問題.

  Data Object Model(DOM)
  >樹結構; 把整個文件, 當成一樹狀結構的物件.
  >每個Element對應htmlTag.
  >每個Element相當於樹(圖)的節點.  *離散數學Graph
  ex. 文件document
      └─bodyTag
          ├─divElement
          │  └─pElement
          │      └─TextNode('Hello')
          └─footElement

*/

'use strict';

window.addEventListener('load', ()=>
{
  console.log("index.js loaded");

  //建立物件(節點)
  let h1=document.createElement('h1');  //建立htmlTag.
  let msg=document.createTextNode('這是 <h1> 的文字訊息');

  let h2=document.createElement('h2');  //建立htmlTag.
  let msg0=document.createTextNode('這是 <h2> 的文字訊息');

  let footer=document.createElement('footer');
  let small=document.createElement('small');
  let msg1=document.createTextNode('我是footer內容');

  //連接物件(節點+邊=樹結構.圖)
  h1.appendChild(msg);  //從葉往根連接.
  document.body.appendChild(h1);  //完整連接所有節點(成為connected graph).

  h2.appendChild(msg0);
  document.body.appendChild(h2);

  small.appendChild(msg1);
  footer.appendChild(small);
  document.body.appendChild(footer);
});

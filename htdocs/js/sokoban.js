/*
切圖: 把整張圖(sprite sheet)切割, 貼在要貼的位置.
  *沒有圖.完全ASCII碼的經典遊戲:矮人要塞.

bind():
類似Curry function概念,
f(x,y)=x+y
C(f,多個參數)=g  //產生新的函數
g(x)=x+固定參數

translate:
平移; 線性代數中移動座標的概念.
兩坐標系, 一座標系的原點在另一座標系的何處.

charAt(n):javascript取得字串第n個字的函數.

HTML檔中定義id="ID名",
  getElementById('ID名')取得HTML檔的ID.


*/

'use strict';

/**
* sokoban 關卡描述
*
* # 牆壁 (wall)
* @ 玩家 (player)
* $ 箱⼦ (box)
* . ⽬標點 (goal)
* + 玩家站在⽬標點上 (player on goal square)
* * 箱⼦在⽬標點上 (box on goal square)
* 空⽩ 地板 (floor)
*/

let levels =
{
  'level_0': [
    "############",
    "#         .#",
    "#          #",
    "#          #",
    "#   ####   #",
    "#          #",
    "#          #",
    "#    $     #",
    "#    @     #",
    "#          #",
    "#          #",
    "############"
  ],

  'level_1': [
    "------------",
    "------------",
    "--#######---",
    "--# ..$ #---",
    "--# # $ #---",
    "--# # # #---",
    "--# $@# #---",
    "--#.$   #---",
    "--#.#####---",
    "--###-------",
    "------------",
    "------------"
  ],
};

/**
* 準備繪圖⽤的 sprites。
*
* @returns sprites 集合物件。
*/

/*literal object:
  ((spriteSheet) =>{})('SokobanClone_byVellidragon.png');
  為IIFE(立即呼叫執行)函數, 定義完直接呼叫, 參數給png檔源.
*等同如下兩行*
  匿名函數(參數)=>{定義};
  匿名函數('SokobanClone_byVellidragon.png');   //呼叫函數.

  計算完後(sprites sheet切完後的圖)存在變數sprites中. */
let sprites = ((spriteSheet) =>
{ //定義切/貼圖的函數
  let baseX = 0;
  let baseY = 6 * 64;   //跳過png上半部64*64的圖.

  let tileset = new Image();  //新增一變數, 記憶體空間配置為圖.
  tileset.src = spriteSheet;  //.src函數: 尋找檔案源, 對應到spriteSheet函數尾的png檔.

  //切/貼圖的過程
  let tile = (tileset, sx, sy, ctx) =>
  {
    ctx.drawImage(    //ctx: conttext, 圖要貼的座標位置, 為系統定名稱.   //drawImage: 將圖貼到Canvas相對應的位置(9個參數),
      tileset,    //要切的圖.
      sx, sy, 32, 32,   //要切的位置; png圖的xy座標, 寬度, 高度(範圍).
      0, 0, 32, 32  //切完後的圖貼在(剪貼簿)位置(0,0).
    );
  };

  return {  //多個要回傳的物件, bind()回傳值為函數型態.
    box: tile.bind(null, tileset, baseX, baseY),
    boxOnGoal: tile.bind(null, tileset, baseX + 32, baseY),
    wall: tile.bind(null, tileset, baseX + 64, baseY),

    floor: tile.bind(null, tileset, baseX, baseY + 32),
    goal: tile.bind(null, tileset, baseX + 32, baseY + 32),
    grass: tile.bind(null, tileset, baseX + 64, baseY + 32),

    faceRight: tile.bind(null, tileset, baseX, baseY + 64),
    faceDown: tile.bind(null, tileset, baseX + 32, baseY + 64),

    faceUp: tile.bind(null, tileset, baseX, baseY + 96),
    faceLeft: tile.bind(null, tileset, baseX + 32, baseY + 96),
  };
})('SokobanClone_byVellidragon.png');

/**
* 依遊戲狀態，繪出盤⾯
*
* @param 'ctx' : 繪圖 context 物件
* @returns {undefined}
*/

let drawGameBoard = (ctx, gameState) =>  //gameState:關卡設定.
{
  let height = gameState.level.length;  //取地圖的長度(方形, 只看y軸""個數).

  for (let x = 0; x < height; x ++)
  {
    for (let y = 0; y < height; y ++)
    {
      ctx.save();   //保留原來的座標狀態(ctx位置==Canvas位置), 回到此狀態方式: 搭配ctx.restore().
      ctx.translate(32*x, 32*y);    //從原點移至要貼的位置(x,y).

      //符號貼的圖選擇.
      switch (gameState.level[y].charAt(x))
      {
        case '#':
          sprites.wall(ctx);
          break;

        case '$':
          sprites.box(ctx);
          break;

        case '@':
          sprites.floor(ctx);
          sprites.faceUp(ctx);
          break;

        case ' ':
          sprites.floor(ctx);
          break;

        case '.':
          sprites.goal(ctx);
          break;

        case'*':
          sprites.boxOnGoal(ctx);
          break;

        case'+':
          sprites.goal(ctx);
          sprites.faceUp(ctx);
          break;

        case'-':
          sprites.grass(ctx);
          break;

        default:
          console.log('Wrong map data');
      }

      ctx.restore();  //回到save的狀態.
    };
  };
};

/**
* sokoban 程式進⼊點
*
* @callback
* @param 'load' : DOM 事件名
* @returns {undefined}
*/

window.addEventListener('load', () =>
{
  console.log("Sokoban.js loaded");   //運作時log載入中.

  //以js設定HTML, 詳見text_index.
  let gameTitle = document.createElement('span');
  gameTitle.textContent = 'Sokoban';

  let gameHeader = document.createElement('header');
  gameHeader.className = 'card_header';

  gameHeader.appendChild(gameTitle);

//Canvas畫布元件
  let sokobanCanvas = document.createElement('canvas');
  let ctxPaint = sokobanCanvas.getContext('2d');  //得到繪圖筆(2d)

  // 設定繪圖圖紙的寬⾼
  sokobanCanvas.width = 32*12
  sokobanCanvas.height = 32*12;

  // 將圖紙埴滿背景⾊
  ctxPaint.fillStyle = 'mintcream';
  ctxPaint.fillRect(0, 0, sokobanCanvas.width, sokobanCanvas.height);

  // 準備⼀⽀可以畫 _ 斷續線 _ 的畫筆(不一定要斷續線)
  ctxPaint.strokeStyle = 'black';

  // 斷續線由連續 4px，再空⽩ 4px 構成
  ctxPaint.setLineDash([4, 4]);

  // 開始記録格線的 paths
  ctxPaint.beginPath();

  // 畫 12 條鉛直斷續線
  for (var c = 1; c < 12; c ++) {
    ctxPaint.moveTo(c * 32, 0);
    ctxPaint.lineTo(c * 32, 32*12);
  }

  // 畫 12 條⽔平斷續線
  for (var r = 1; r < 12; r ++) {
    ctxPaint.moveTo( 0, r * 32);
    ctxPaint.lineTo(640, r * 32);
  }

  // 繪出格線
  ctxPaint.stroke();

  let sokobanBoard = document.createElement('div');
  sokobanBoard.style.gridArea = '1 / 2 / 4 / 5';

  sokobanBoard.appendChild(sokobanCanvas);

  let gameBoard = document.createElement('article');
  gameBoard.className = 'card_content';

  gameBoard.appendChild(sokobanBoard);

  let gameDesktop = document.createElement('section');
  gameDesktop.className = 'card';

  gameDesktop.appendChild(gameHeader);
  gameDesktop.appendChild(gameBoard);

  let desktop = document.querySelector('.site_body')
  desktop.appendChild(gameDesktop);

  /**
  * 滑⿏游標移動追踪
  *
  * @callback
  * @param 'mousemove' : DOM 事件名
  * @param e : DOM event 物件
  * @returns {undefined}
  */

  desktop.addEventListener('mousemove', (e) => {  //取得HTML的物件ID.
    document.getElementById('cursor_x').textContent = e.clientX;
    document.getElementById('cursor_y').textContent = e.clientY;
  });

  drawGameBoard(ctxPaint, { level: levels.level_0 });   //把物件levels放進一個新物件level(把關卡傳給繪圖).
});

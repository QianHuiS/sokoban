/*
  css標籤<=>js的變數名
  格式:
  Aaaa-bbb<=>AaaaBbb

  alert()視窗

new:
  準備繪圖用的 sprites 資料
  依滑鼠事件 (click)，改變遊戲資料

*/

/**
 *  @file       index.js
 *  @brief      The entry file of Sokoban.
 *  @author     Yiwei Chiao (ywchiao@gmail.com)
 *  @date       11/17/2017 created.
 *  @date       01/05/2018 last modified.
 *  @version    0.1.0
 *  @since      0.1.0
 *  @copyright  MIT, © 2017-2018 Yiwei Chiao
 *  @details
 *
 *  The entry file of Sokoban.
 */
'use strict';

/**
 * Sokoban 符號常數
 *
 *  #    牆壁 (wall)
 *  @    玩家 (player)
 *  $    箱子 (box)
 *  .    目標點 (goal)
 *  +    玩家站在目標點上 (player on goal square)
 *  *    箱子在目標點上 (box on goal square)
 *  空白 地板 (floor)
 */
const SOKOBAN = {
  BOX: '$',
  BOX_ON_GOAL: '*',
  FLOOR: ' ',
  GOAL: '.',
  GROUND: '-',
  MAN: '@',
  MAN_ON_GOAL: '+',
  WALL: '#',
};

/**
 * Sokoban 關卡描述
 */
let levels = [
  [
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

  [
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
];

/**
 * 將 'str' 的第 'x' 字元換成 'ch'。
 *
 */
let replaceAt = (str, x, ch) => {
  let arrayOfChar = str.split('');

  arrayOfChar[x] = ch;

  return arrayOfChar.join('');
};

/**
 * 準備繪圖用的 sprites 資料。
 *
 * @returns sprites 集合物件。
 */
let tileset = {
  src: 'SokobanClone_byVellidragon.png',

  tile: {
    box: {
      x: 0,
      y: 0 ,
      width: 32,
      height: 32,
    },
    boxOnGoal: {
      x: 32,
      y: 0,
      width: 32,
      height: 32,
    },
    wall: {
      x: 64,
      y: 0,
      width: 32,
      height: 32,
    },

    floor: {
      x: 0,
      y: 32,
      width: 32,
      height: 32,
    },
    goal: {
      x: 32,
      y: 32,
      width: 32,
      height: 32,
    },
    ground: {
      x: 64,
      y: 32,
      width: 32,
      height: 32,
    },

    faceRight: {
      x: 0,
      y: 64,
      width: 32,
      height: 32,
    },
    faceDown: {
      x: 32,
      y: 64,
      width: 32,
      height: 32,
    },

    faceUp: {
      x: 0,
      y: 96,
      width: 32,
      height: 32,
    },
    faceLeft: {
      x: 32,
      y: 96,
      width: 32,
      height: 32,
    },
  },
};

/**
 * 貼地磚函式
 */
let tile = function (tileset, { x, y, width, height }) {
  this.brush.drawImage(
    tileset,
    x, y, width, height,
    0, 0, width, height
  );
};

/**
 * Sokoban 遊戲狀態物件的 prototype (原形)
 */
let prototypeGameState = {    //判斷給定的座標(x,y)是什麼
  isBox: function ({x, y}) {
    return (this.level[y].charAt(x) == SOKOBAN.BOX) ||
      (this.level[y].charAt(x) == SOKOBAN.BOX_ON_GOAL);
  },

  isBoxOnGoal: function ({x, y}) {
    return (this.level[y].charAt(x) == SOKOBAN.BOX_ON_GOAL);
  },

  isGoal: function ({x, y}) {
    return (this.level[y].charAt(x) == SOKOBAN.GOAL);
  },

  isMan: function ({x, y}) {
    return (this.level[y].charAt(x) == SOKOBAN.MAN) ||
      (this.level[y].charAt(x) == SOKOBAN.MAN_ON_GOAL);
  },

  isManOnGoal: function ({x, y}) {
    return (this.level[y].charAt(x) == SOKOBAN.MAN_ON_GOAL);
  },

  isVacant: function ({x, y}) {
    return (this.level[y].charAt(x) == SOKOBAN.FLOOR) ||
      (this.level[y].charAt(x) == SOKOBAN.GOAL) ||
      (this.level[y].charAt(x) == SOKOBAN.GROUND);
  },

//給我一個座標, 我告訴你其他四方的座標.
  cellDown: function ({x, y}) {
    return {
      x: x,
      y: ((y + 1) < this.level.length) ? (y + 1) : y
    };
  },

  cellLeft: function ({x, y}) {
    return {
      x: (x > 0) ? (x - 1) : x,
      y: y
    };
  },

  cellRight: function ({x, y}) {
    return {
      x: ((x + 1) < this.level.length) ? (x + 1) : x,
      y: y
    };
  },

  cellUp: function ({x, y}) {
    return {
      x: x,
      y: (y > 0) ? (y - 1) : y,
    };
  },

//物件原來的座標, 收回物件, 物件要移去的座標, 放上物件.(貼什麼圖)
  moveBox: function (oldCell, newCell) {
    return this
      .moveBoxOut(oldCell)
      .moveBoxIn(newCell);
  },

  moveBoxIn: function (cell) {
    if (this.isGoal(cell)) {
      this.putBoxOnGoal(cell);
    }
    else {
      this.putBox(cell);
    };

    return this;
  },

  moveBoxOut: function (cell) {
    if (this.isBoxOnGoal(cell)) {
      this.putGoal(cell);
    }
    else {
      this.putFloor(cell);
    };

    return this;
  },

  moveMan: function (oldCell, newCell) {
    return this
      .moveManOut(oldCell)
      .moveManIn(newCell);
  },

  moveManIn: function (cell) {
    if (this.isGoal(cell)) {
      this.putManOnGoal(cell);
    }
    else {
      this.putMan(cell);
    };

    return this;
  },

  moveManOut: function (cell) {
    if (this.isManOnGoal(cell)) {
      this.putGoal(cell);
    }
    else {
      this.putFloor(cell);
    };

    return this;
  },

  moveManDown: function (cell) {
    let manCell = this.cellUp(cell);
    let newCell = this.cellDown(cell);

    if (
      this.isBox(cell) &&
      this.isVacant(newCell)
    ) {
      return this.pushBoxDown(cell);
    }

    if (this.isVacant(cell)) {
      return this.moveMan(manCell, cell);
    }

    return this;
  },

  moveManLeft: function (cell) {
    let manCell = this.cellRight(cell);
    let newCell = this.cellLeft(cell);

    if (
      this.isBox(cell) &&
      this.isVacant(newCell)
    ) {
      return this.pushBoxLeft(cell);
    }

    if (this.isVacant(cell)) {
      return this.moveMan(manCell, cell);
    }

    return this;
  },

  moveManRight: function (cell) {
    let manCell = this.cellLeft(cell);
    let newCell = this.cellRight(cell);

    if (
      this.isBox(cell) &&
      this.isVacant(newCell)
    ) {
      return this.pushBoxRight(cell);
    }

    if (this.isVacant(cell)) {
      return this.moveMan(manCell, cell);
    }

    return this;
  },

  moveManUp: function (cell) {
    let manCell = this.cellDown(cell);
    let newCell = this.cellUp(cell);

    if (
      this.isBox(cell) &&
      this.isVacant(newCell)
    ) {
      return this.pushBoxUp(cell);
    }

    if (this.isVacant(cell)) {
      return this.moveMan(manCell, cell);
    }

    return this;
  },

  pushBoxDown: function (cell) {
    let manCell = this.cellUp(cell);
    let boxCell = this.cellDown(cell);

    return this
      .moveBox(cell, boxCell)
      .moveMan(manCell, cell);
  },

  pushBoxLeft: function (cell) {
    let manCell = this.cellRight(cell);
    let boxCell = this.cellLeft(cell);

    return this
      .moveBox(cell, boxCell)
      .moveMan(manCell, cell);
  },

  pushBoxRight: function (cell) {
    let manCell = this.cellLeft(cell);
    let boxCell = this.cellRight(cell);

    return this
      .moveBox(cell, boxCell)
      .moveMan(manCell, cell);
  },

  pushBoxUp: function (cell) {
    let manCell = this.cellDown(cell);
    let boxCell = this.cellUp(cell);

    return this
      .moveBox(cell, boxCell)
      .moveMan(manCell, cell);
  },

  putBox: function ({x, y}) {
    this.level[y] = replaceAt(this.level[y], x, SOKOBAN.BOX);

    return this;
  },

  putBoxOnGoal: function ({x, y}) {
    this.level[y] = replaceAt(this.level[y], x, SOKOBAN.BOX_ON_GOAL);

    return this;
  },

  putFloor: function ({x, y}) {
    this.level[y] = replaceAt(this.level[y], x, SOKOBAN.FLOOR);

    return this;
  },

  putGoal: function ({x, y}) {
    this.level[y] = replaceAt(this.level[y], x, SOKOBAN.GOAL);

    return this;
  },

  putMan: function ({x, y}) {
    this.level[y] = replaceAt(this.level[y], x, SOKOBAN.MAN);

    return this;
  },

  putManOnGoal: function ({x, y}) {
    this.level[y] = replaceAt(this.level[y], x, SOKOBAN.MAN_ON_GOAL);

    return this;
  }
};

/**
 * 繪出盤面上的格線
 *
 * @param 'ctx' : 繪圖 context 物件
 * @returns {undefined}
 */
let drawBoardGrid = (ctx) => {
  // 準備一支可以畫 _斷續線_ 的畫筆
  ctx.strokeStyle = 'black';
  // 斷續線由連續 4px，再空白 4px構成
  ctx.setLineDash([4, 4]);

  // 開始記録格線的 paths
  ctx.beginPath();

  // 畫 12 條鉛直斷續線
  for (var c = 1; c < 12; c ++) {
    ctx.moveTo(c * 32, 0);
    ctx.lineTo(c * 32, 32*12);
  }

  // 畫 12 條水平斷續線
  for (var r = 1; r < 12; r ++) {
    ctx.moveTo( 0, r * 32);
    ctx.lineTo(640, r * 32);
  }

  // 繪出格線
  ctx.stroke();
};

/**
 * Sokoban 遊戲物件
 */
let sokoban = {
  /**
   * 依滑鼠事件 (click)，改變遊戲資料     //drawGameBoard和ctx????
   *
   * @returns {undefined}
   */
  move: function (e) {
    let cell = {
      x: Math.floor(e.offsetX / 32),
      y: Math.floor(e.offsetY / 32),
    };

    if (this.isMan(this.cellDown(cell))) {
      this.man = this.faceUp;
      this.moveManUp(cell);
    }

    if (this.isMan(this.cellLeft(cell))) {
      this.man = this.faceRight;
      this.moveManRight(cell);
    }

    if (this.isMan(this.cellRight(cell))) {
      this.man = this.faceLeft;
      this.moveManLeft(cell);
    }

    if (this.isMan(this.cellUp(cell))) {
      this.man = this.faceDown;
      this.moveManDown(cell);
    }
  },

  /**
   * 依遊戲狀態，繪出盤面
   *
   * @returns {undefined}
   */
  paint: function () {
    let height = this.level.length;

    for (let x = 0; x < height; x ++) {
      for (let y = 0; y < height; y ++) {
        this.brush.save();
        this.brush.translate(32*x, 32*y);

        Object.entries(SOKOBAN).some(([key, value]) => {    //js新的寫法Object.entries()!!
          if (value == this.level[y].charAt(x)) {
            switch (value) {
              case SOKOBAN.MAN:
                this.floor();

                break;

              case SOKOBAN.MAN_ON_GOAL:
                this.goal();

                break;
            };

            this[this.tiling[key]]();

            return true;
          };
        });

        this.brush.restore();
      };
    };
  },

  /**
   * 依傳入的遊戲關卡編號，初始遊戲
   *
   * @returns {undefined}
   */
  start: function (level) {
    this.level = JSON.parse(JSON.stringify(levels[level]));
    this.paint();
  },

  /**
   * 貼圖函式和指令的對應表
   */
  tiling: {
    BOX: 'box',
    BOX_ON_GOAL: 'boxOnGoal',
    FLOOR: 'floor',
    GOAL: 'goal',
    GROUND: 'ground',
    MAN: 'man',
    MAN_ON_GOAL: 'man',
    WALL: 'wall',
  },

  /**
   * 遊戲更新介面函式
   *
   * @returns {undefined}
   */
  update: function (e) {
    this.move(e);
    this.paint();
    //檢查遊戲是否結束...
  /*  if (檢查) {
      alerr('You Win');
    }*/
  },
};

/**
 * 設定關卡按鈕
 *
 * @param 'sokoban' : 遊戲物件
 * @returns HTML 'section' 物件，含有關卡選擇按鈕
 */
let controlPane = (sokoban) => {
  let choices = [ '第一關', '第二關', '第三關' ];

  let section = document.createElement('section');   //格線的css.
  section.style.gridArea = '5 / 2 / 6 / 5';

  choices.forEach((text, level) => {    //forEach= 用for()跑array.
    let btn = document.createElement('button');   //css的

    //對應css
    btn.style.backgroundColor = '#007fff5f';
    btn.style.color = '#051268cf';
    btn.style.fontSize = '2rem';

    //對應html
    btn.textContent = text;
    btn.value = level;  //按鈕的值; 第一關值為1

    //當按按鈕時, 開始關卡.
    btn.addEventListener('click', e => {  //滑鼠的click事件, 事件e.
      sokoban.start(e.target.value);  //target:使用者和哪個HTML(Button)互動產生的事件
    });

    section.appendChild(btn);   //親節點section, 增加一子節點(btn).
  });

  return section;   //傳回根結點section, 至gameBoard
}

/**
 * 初始化遊戲物件
 *
 * @param 'ctx' : 繪圖用的 context 物件
 * @param 'tileset': 貼圖用的 tileset 物件
 *
 * @returns Game 物件
 */
let newGame = (ctx, tileset) => {
  let game = Object.create(sokoban);
  Object.setPrototypeOf(sokoban, prototypeGameState);

  let spriteSheet = new Image();
  spriteSheet.src = tileset.src;

  Object.keys(tileset.tile).forEach(key => {
    tileset.tile[key].y += 6 * 64;

    game[key] = tile.bind(
      game, spriteSheet, tileset.tile[key]
    );
  });

  game.brush = ctx;
  game.man = game.faceUp;

  return game;
};

/**
 * sokoban 程式進入點
 *
 * @callback
 * @param 'load' : DOM 事件名
 * @returns {undefined}
 */
window.addEventListener('load', () => {
  console.log("Sokoban.js loaded");

  let gameTitle = document.createElement('span');
  gameTitle.textContent = 'Sokoban';

  let gameHeader = document.createElement('header');
  gameHeader.className = 'card_header';

  gameHeader.appendChild(gameTitle);

  let sokobanCanvas = document.createElement('canvas');
  let ctxPaint = sokobanCanvas.getContext('2d');

  // 設定繪圖圖紙的寬高
  sokobanCanvas.width = 32*12
  sokobanCanvas.height = 32*12;

  // 將圖紙埴滿背景色
  ctxPaint.fillStyle = 'mintcream';
  ctxPaint.fillRect(0, 0, sokobanCanvas.width, sokobanCanvas.height);

  // 繪出遊戲盤面上的格線
  drawBoardGrid(ctxPaint);

  let sokobanBoard = document.createElement('div');
  sokobanBoard.style.gridArea = '1 / 2 / 4 / 5';

  sokobanBoard.appendChild(sokobanCanvas);

  let gameBoard = document.createElement('article');
  gameBoard.className = 'card_content';

  gameBoard.appendChild(sokobanBoard);

  let sokoban = newGame(ctxPaint, tileset);

  gameBoard.appendChild(controlPane(sokoban));

  sokobanBoard.addEventListener(
    'click',
    sokoban.update.bind(sokoban)
  );

  let gameDesktop = document.createElement('section');
  gameDesktop.className = 'card';

  gameDesktop.appendChild(gameHeader);
  gameDesktop.appendChild(gameBoard);

  let desktop = document.querySelector('.site_body')
  desktop.appendChild(gameDesktop);

  /**
   * 滑鼠游標移動追踪
   *
   * @callback
   * @param 'mousemove' : DOM 事件名
   * @param e : DOM event 物件
   * @returns {undefined}
   */
  desktop.addEventListener('mousemove', (e) => {
    document.getElementById('cursor_x').textContent = e.clientX;
    document.getElementById('cursor_y').textContent = e.clientY;
  });
});

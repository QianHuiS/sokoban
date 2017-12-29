/**
 *  @file       index.js
 *  @brief      The entry file of Sokoban.
 *  @author     Yiwei Chiao (ywchiao@gmail.com)
 *  @date       11/17/2017 created.
 *  @date       12/29/2017 last modified.
 *  @since      0.1.0
 *  @copyright  MIT, (C) 2017 Yiwei Chiao
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
 * Sokoban 遊戲狀態物件的 prototype (原形)
 */
let prototypeGameState = {
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
  },

};

/**
 * 準備繪圖用的 sprites。
 *
 * @returns sprites 集合物件。
 */
let sprites = ((spriteSheet) => {
  let baseX = 0;
  let baseY = 6 * 64;

  let tileset = new Image();
  tileset.src = spriteSheet;

  let tile = (tileset, sx, sy, ctx) => {
    ctx.drawImage(
      tileset,
      sx, sy, 32, 32,
      0, 0, 32, 32
    );
  };

  return {
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
 * 依遊戲狀態，繪出盤面
 *
 * @param 'ctx' : 繪圖 context 物件
 * @returns {undefined}
 */
let drawGameBoard = (ctx, gameState) => {
  let height = gameState.level.length;

  for (let x = 0; x < height; x ++) {
    for (let y = 0; y < height; y ++) {
      ctx.save();
      ctx.translate(32*x, 32*y);

      switch (gameState.level[y].charAt(x)) {
        case SOKOBAN.WALL:
          sprites.wall(ctx);

          break;

        case SOKOBAN.BOX:
          sprites.box(ctx);

          break;

        case SOKOBAN.MAN:
          sprites.floor(ctx);
          sprites.faceUp(ctx);

          break;

        case SOKOBAN.FLOOR:
          sprites.floor(ctx);

          break;

        case SOKOBAN.GOAL:
          sprites.goal(ctx);

          break;

        case SOKOBAN.BOX_ON_GOAL:
          sprites.boxOnGoal(ctx);

          break;

        case SOKOBAN.MAN_ON_GOAL:
          sprites.goal(ctx);
          sprites.faceUp(ctx);

          break;

        case SOKOBAN.GROUND:
          sprites.grass(ctx);

          break;

        default:
          console.log('Wrong map data');
      }

      ctx.restore();
    };
  };
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
 * 依據輸入的 'level' 產生相應的 GameState 物件。
 *
 * @param 'level' : 關卡編號
 * @returns GameState 物件
 */
let newGame = (level) => {
  let gameState = Object.create(prototypeGameState);

  gameState.level = levels[level];

//  gameState.initGame();

  return gameState;
};

let gameLoop = function (ctx, e) {
  let cell = {
    x: Math.floor(e.offsetX / 32),
    y: Math.floor(e.offsetY / 32),
  };

  if (this.isMan(this.cellDown(cell))) {
    this.moveManUp(cell);
  }

  if (this.isMan(this.cellLeft(cell))) {
    this.moveManRight(cell);
  }

  if (this.isMan(this.cellRight(cell))) {
    this.moveManLeft(cell);
  }

  if (this.isMan(this.cellUp(cell))) {
    this.moveManDown(cell);
  }

  drawGameBoard(ctx, this);
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

  let gameState = newGame(0);

  sokobanBoard.addEventListener(
    'click',
    gameLoop.bind(gameState, ctxPaint)
  );

  drawGameBoard(ctxPaint, gameState);
});

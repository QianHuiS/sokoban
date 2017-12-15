/**
 *  @file       index.js
 *  @brief      The entry file of Sokoban.
 *  @author     Yiwei Chiao (ywchiao@gmail.com)
 *  @date       11/17/2017 created.
 *  @date       12/07/2017 last modified.
 *  @version    0.1.0
 *  @copyright  MIT, (C) 2017 Yiwei Chiao
 *  @details
 *
 *  The entry file of Sokoban.
 */
'use strict';

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

  //Canvas畫布元件
  let ctxPaint = sokobanCanvas.getContext('2d');  //得到繪圖筆(2d)

    // 設定繪圖圖紙的寬高
    sokobanCanvas.width = 256;
    sokobanCanvas.height = 256;

    // 將圖紙埴滿背景色
    ctxPaint.fillStyle = 'mintcream';
    ctxPaint.fillRect(0, 0, sokobanCanvas.width, sokobanCanvas.height);

    // 準備一支可以畫 _斷續線_ 的畫筆
    ctxPaint.strokeStyle = 'black';
    // 斷續線由連續 4px，再空白 4px構成
    ctxPaint.setLineDash([4, 4]);

    // 開始記録格線的 paths
    ctxPaint.beginPath();

    // 畫 8 條鉛直斷續線
    for (var c = 1; c < 8; c ++) {
      ctxPaint.moveTo(c * 32, 0);
      ctxPaint.lineTo(c * 32, 320);
    }

    // 畫 8 條水平斷續線
    for (var r = 1; r < 8; r ++) {
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

// index.js

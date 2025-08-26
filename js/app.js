/*-------------------------------- Constants --------------------------------*/
/*---------------------------- Variables (state) ----------------------------*/

let grid;
let score = 0;
const rows = 4;
const columns = 4; // 4x4 grid
let hasWon = false; // this will prevent from the winning popup from always showing over and over again with every move
/*------------------------ Cached Element References ------------------------*/



/*-------------------------------- Functions --------------------------------*/
window.onload = function() {
    document.getElementById("startBtn").addEventListener("click", function() {
        setGame();
        this.disabled = true; // This is so the button is disabled when playing the game
    });
};
function setGame() {
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
// r = rows c = columns 
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++ /* not the language!*/) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = grid[r][c];
            updateTile(tile, num);
            document.getElementById("grid").append(tile);
        }
    }
    //creates 2 (two tiles) at the start of the game
    setTwo();
    setTwo();

}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //This clears the classlist so that if you merge 2 and 2 together, it bcomes a clean 4 class
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("num"+num.toString());
        } else {
            tile.classList.add("num8192");
        }                
    }
}
/* more context (not that you don't know) on the classList.value above:
Basically, it's to avoid one tile having two classes. So when we merge, one tile wouldn't have the classes of both the numbers 2 and 4 (2 being the old tiles and 4 the new)
This also required some reaserach, also thanks to Khalil for letting me know about classList!
*/
function filterZero(row){
    return row.filter(num => num != 0); //creates a new array of numbers not = to 0
} // win condition
function checkWin() {
    if (hasWon) return false; // Again so that the winning popup box doesn't show repeatedly

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (grid[r][c] === 2048) {
                hasWon = true; // just to mark it as a win
                document.getElementById("winBox").classList.remove("hidden");
                return true;
            }
        }
    }
    return false;
}


// Loss Condition / check 
function gameOver() {
    document.getElementById("gameOverBox").classList.remove("hidden");
}

function canMove() {
    if (hasEmptyTile()) return true;

    // This will check if there are any possible horizontal movements
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (grid[r][c] === grid[r][c+1]) return true;
        }
    }

    // This will check if there are any vertical movements possible
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 1; r++) {
            if (grid[r][c] === grid[r+1][c]) return true;
        }
    }

    return false;
}
function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i]; // score updater! It adds up the added up tiles to the score
        }
    } 
    row = filterZero(row); 
    while (row.length < columns) {
        row.push(0);
    } 
    return row;
}
function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
} //without this, it would add a new tile after each keypress, rather than the actual tiles moving.

// movement functions
function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = grid[r];
        let originalRow = [...row];
        row = slide(row);
        grid[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = grid[r][c];
            updateTile(tile, num);
        }

        if (!arraysEqual(originalRow, row)) {
            moved = true; // This is the one I mentioned on line 132. Without it, tiles would come without actual movement.
        }
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = grid[r];
        let originalRow = [...row];
        row.reverse();
        row = slide(row);
        row.reverse();
        grid[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = grid[r][c];
            updateTile(tile, num);
        }

        if (!arraysEqual(originalRow, row)) {
            moved = true;
        }
    }
    return moved;
}
// Sliding up was less straight forward than right or left. I basically turn the vertical into horizontal (but not raelly)
function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
        let originalCol = [...col];
        col = slide(col);

        for (let r = 0; r < rows; r++) {
            grid[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = grid[r][c];
            updateTile(tile, num);
        }

        if (!arraysEqual(originalCol, col)) {
            moved = true;
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) { // similar to slideUp
        let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]]; // This didn't work at first! I copied and pasted the Up function thinking it would work like left / right but it didn't.

        let originalCol = [...col];
        col.reverse();// Then I learned about this and it worked (after some research) 
        col = slide(col);
        col.reverse();

        for (let r = 0; r < rows; r++) {
            grid[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = grid[r][c];
            updateTile(tile, num);
        }

        if (!arraysEqual(originalCol, col)) {
            moved = true;
        }
    }
    return moved;
}

function setTwo() { 
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //This finds a random row and column to place a 2 tile in it
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (grid[r][c] == 0) {
            grid[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("num2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (grid[r][c] == 0) { 
                return true;
            }
        }
    }
    return false;
}
/*----------------------------- Event Listeners -----------------------------*/
document.addEventListener('keyup', (e) => {
    let moved = false;
    if (e.code === "ArrowLeft") {
        moved = slideLeft();
    }
    else if (e.code === "ArrowRight") {
        moved = slideRight();
    }
    else if (e.code === "ArrowUp") {
        moved = slideUp();
    }
    else if (e.code === "ArrowDown") {
        moved = slideDown();
    }
    if (moved) {
        setTwo();
        document.getElementById("score").innerText = score;
        checkWin(); // 
    }
    if (!canMove()) {
        gameOver();
    }

});

// restart the game button. (this was a struggle)
document.getElementById("restartBtn").addEventListener("click", () => {
    score = 0;
    hasWon = false;
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    document.getElementById("score").innerText = score;

    document.getElementById("gameOverBox").classList.add("hidden");
    document.getElementById("winBox").classList.add("hidden");
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r + "-" + c);
            updateTile(tile, 0);
        }
    }
    // shoutout to Khalil for helping with this, it wasn't working at all

    // start fresh game with two tiles
    setTwo();
    setTwo();
});
// ending the game button
document.getElementById("endBtn").addEventListener("click", () => {
    document.getElementById("winBox").classList.add("hidden");
    gameOver(); 
});
// continuing the game box
document.getElementById("continueBtn").addEventListener("click", () => {
    document.getElementById("winBox").classList.add("hidden");
});


/*----------------------------- Animation -----------------------------*/ 
// I added this section to not be confused and track it easily

(function () {
  function readVal(r, c) {
    const el = document.getElementById(r + "-" + c);
    const n = parseInt(el && el.innerText ? el.innerText.trim() : "", 10);
    return Number.isFinite(n) ? n : 0;
  }
  function snapshot() {
    const snap = [];
    for (let r = 0; r < rows; r++) {
      snap[r] = [];
      for (let c = 0; c < columns; c++) snap[r][c] = readVal(r, c);
    }
    return snap;
  }

  function animatePop(el) {
    if (!el) return;
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }

 
  let prevSnap = snapshot();

  // when merging, the merged tile will popup
  function popMergesIfMoved(moved) {
    if (!moved) return; // I faced an issue where the tiles would popup even if they didn't actually move, this fixed it. Similar idea used before as well
    requestAnimationFrame(() => {
      const cur = snapshot();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          const before = prevSnap[r][c];
          const after  = cur[r][c];
          const isIncrease = after > before;
          const isSpawn = before === 0 && (after === 2 || after === 4);
          if (isIncrease && !isSpawn) {
            animatePop(document.getElementById(r + "-" + c));
          }
        }
      }
      prevSnap = cur;
    });
  }

  if (typeof window.slideLeft === "function") {
    const _slideLeft = window.slideLeft;
    window.slideLeft = function () {
      const moved = _slideLeft();
      popMergesIfMoved(moved);
      return moved;
    };
  }
  if (typeof window.slideRight === "function") {
    const _slideRight = window.slideRight;
    window.slideRight = function () {
      const moved = _slideRight();
      popMergesIfMoved(moved);
      return moved;
    };
  }
  if (typeof window.slideUp === "function") {
    const _slideUp = window.slideUp;
    window.slideUp = function () {
      const moved = _slideUp();
      popMergesIfMoved(moved);
      return moved;
    };
  }
  if (typeof window.slideDown === "function") {
    const _slideDown = window.slideDown;
    window.slideDown = function () {
      const moved = _slideDown();
      popMergesIfMoved(moved);
      return moved;
    };
  }


  if (typeof window.setTwo === "function") {
    const _setTwo = window.setTwo;
    window.setTwo = function () {
      const before = snapshot();       
      _setTwo();                       
    
      outer: for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          const was = before[r][c];
          const now = readVal(r, c);
          if (was === 0 && (now === 2 || now === 4)) {
            animatePop(document.getElementById(r + "-" + c));
            break outer;
          }
        }
      }
      prevSnap = snapshot();
    };
  }

  const startBtn = document.getElementById("startBtn");
  if (startBtn) startBtn.addEventListener("click", () => { requestAnimationFrame(() => { prevSnap = snapshot(); }); });

  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) restartBtn.addEventListener("click", () => { requestAnimationFrame(() => { prevSnap = snapshot(); }); });
})();
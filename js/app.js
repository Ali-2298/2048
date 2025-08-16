/*-------------------------------- Constants --------------------------------*/



/*---------------------------- Variables (state) ----------------------------*/

var grid;
var score = 0;
var rows = 4;
var columns = 4; //4x4 grid

/*------------------------ Cached Element References ------------------------*/



/*-------------------------------- Functions --------------------------------*/
window.onload = function() {
    document.getElementById("startBtn").addEventListener("click", function() {
        setGame();
        this.disabled = true; // This is so the button is disabled when playing the game
    });
};
// window.onload = function() {
//     setGame();
// } // starts the game when the window loads, might change this to a start button. 

function setGame() {
    // grid = [ 
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [0, 0, 0, 0],
    //     [0, 0, 0, 0]
    // ];
    // I added this grid to test out the merges intially, commented it out eventually

    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
// r = rows c = columns (for me)
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
/* more context on the vlassList.value above:
Basically, it's to avoid one tile having two classes. So when we merge, one tile wouldn't have the classes of both the numbers 2 and 4 (2 being the old tiles and 4 the new)
This also required some reaserach, also thanks to Khalil for letting me know about classList!
*/
function filterZero(row){
    return row.filter(num => num != 0); //creates a new array of numbers not = to 0
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
// movement functions
function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = grid[r];
        row = slide(row);
        grid[r] = row;
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = grid[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = grid[r];         
        row.reverse();              
        row = slide(row)            
        grid[r] = row.reverse();   
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = grid[r][c];
            updateTile(tile, num);
        }
    }
}
// Sliding up was less straight forward than right or left. I basically turn the vertical into horizontal (but not raelly)
function slideUp() {
    for (let c = 0; c < columns; c++){ // Had to change the r to c from the right/left codes
        let row = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]]; // grid 0 1 2 3 is basically from down to up. So the top one is 0, second one is 1, etc.
        row = slide(row);
        for (let r = 0; r < rows; r++){
            grid[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = grid[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) { // similar to slideUp
        let row = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]]; // This didn't work at first! I copied and pasted the Up function thinking it would work like left / right but it didn't.
        row.reverse(); // Then I learned about this and it worked (after some research) 
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++){
            grid[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = grid[r][c];
            updateTile(tile, num);
        }
    }
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
// same setTwo idea at the start of the game but this is done after every move. It finds an empty tile and then places one there
document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();

    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;
})
Game title: 2048

Merge the tiles that have the same numbers together until you reach the number 2048. Any movement made will spawn a block, numbered 2 or 4 by random and in a random place. All the movements will move the blocks to the edge / max of the grid in that chosen direction. The two numbers that are the same will merge, and the numbers that are different will collide. If there are no empty grids and no possible move possible, you will lose and the game will be over.

User Stories:
1. As a user, I want to be able to move the blocks to the desired direction.

2. As a user, I want to be able to merge same number blocks and add to my score. 

3. As a user, I want a new block to spawn in an empty tile with every move I make. 

4. As a user, I want my score to update every time I merge the tiles. 

5. As a user, I want the numbers to be visually color coded so that I know which colors go together rather than just the number. 

6. As a user, I want a "You win" screen or a "game over" screen whether I win or lose respectively. 

7. As a user, I want to have my high score saved so I can beat it in the future. 

Pseudocode: 

1. Declare variables and create a 4x4 grid for the blocks to go in. Create a variable for score. 

2. Create divs for the score, individual tiles, and the game over screen.

3. initialize the game by placing random 2 or 4 tiles in empty spots on the grid. 

4. Event listeners for up, down, left, and 
right for block movement.

5. If the grid changes (moves), add a random 2 or 4 block in an empty spot. 
 
6. Update the score after each merge. The score is the total number of the merged blocks

7. Check for game over. If no empty cells are left and no merges are possible. 

8. Optional restart game button, else it would ask the user to refresh to start a new game. 
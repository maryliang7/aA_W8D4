let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let board = [];
  for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
      board[i][j] = undefined;
    }
  }
  board[3][4] = new Piece("black");
  board[4][3] = new Piece("black");
  board[3][3] = new Piece("white");
  board[4][4] = new Piece("white");
  return board;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  pos1 = pos[0];
  pos2 = pos[1];
  if(pos1 > 7 || pos2 > 7 || pos1 < 0 || pos2 < 0){
    throw new CustomError ("Not valid pos!");
  }
  return this.grid[pos1][pos2];
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let piece1 = this.getPiece(pos);
  if(piece1 === undefined) {
    return undefined;
  } else {
    return piece1.color === color;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return this.getPiece(pos) !== undefined;
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if (this.hasMove("black") && this.hasMove("white")) {
    return true;
  }
  return false;
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  pos1 = pos[0];
  pos2 = pos[1];
  if (pos1 > 7 || pos2 > 7 || pos1 < 0 || pos2 < 0) {
    return false;
  }
  return true;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {
  // let nextPosX = pos[0] + dir[0];
  // let nextPosY = pos[1] + dir[1];
  // if (piecesToFlip.length === 0) {
    
  //   if (board.grid[nextPosX][nextPosY] === undefined) return null;
  //   if (board.grid[nextPosX][nextPosY].color === color) {
  //     return null;
  //   } else {
  //     piecesToFlip.push(board.grid[nextPosX][nextPosY]);

  //     _positionsToFlip(board, [nextPosX, nextPosY], color,dir, piecesToFlip);
  //   }
  // } 

  // if (board.isValidPos([nextPosX,nextPosY])) {
  //   return null;
  // } else {
  //   if (board.grid[nextPosX][nextPosY].color === color) {
  //     return piecesToFlip;
  //   } else { 
  //     piecesToFlip.push(board.grid[nextPosX][nextPosY]);

  //     _positionsToFlip(board, [nextPosX, nextPosY], color, dir, piecesToFlip);
  //   }
  // }
  let nextPos = [pos[0] + dir[0], pos[1] + dir[1]];
  // if there is nothing in the square, there is nothing to flip so we return null
  debugger;
  if (!board.isValidPos(nextPos)) {
   
    return null;
  // if there is something in the square, we check what is in the square
  } else if (board.isOccupied(nextPos) && piecesToFlip.length === 0) {

    // if the square has the same color as our initial piece, there is nothing to flip and we return null
    if (board.isMine(nextPos)) {
      return null;
    } else {
      // if the square is a different color, it is a flippable piece and we push it into our array
      piecesToFlip.push(nextPos);
      return _positionsToFlip (board, nextPos, color, dir, piecesToFlip);
    }
  } else {
    // else, saying that we have at least one flippable piece in our array, and we encounter another piece that we own (same color piece), the move is valid and we will return all the pieces that we will flip
    if (board.isMine(nextPos)) {
      return piecesToFlip;
    } else {
      piecesToFlip.push(nextPos);
      return _positionsToFlip (board, nextPos, color, dir, piecesToFlip);
    }
  }
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {

};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  for (let i = 0; i < this.grid.length; i++){
    let row = "";
    for (let j = 0; j < i.length; j++){
      row.push(this.grid[i][j]);
    }
    console.log(row);
  }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isValidPos(pos)) {
    if (!this.isOccupied(pos)) {
      for (let i = 0; i < 8; i++) {
        let pieces = _positionsToFlip(this, pos, color, Board.DIRS[i], []);
        console.log(pieces);
        if (pieces !== null) {
        return true;
        }
      }
    }
  }
  return false;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let validMoves = [];

  for (let i = 0; i < this.length; i++) {
    for(let j = 0; j < this.length; j++) {
      if (this.ValidMove([i,j])) {
        validMoves.push([i,j]);
      }
    }
  }
  return validMoves;
};

module.exports = Board;

let board = new Board();
board.validMove([2,3], "black");
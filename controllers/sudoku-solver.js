const { createSudokuObject } = require("./createSudokuObject.js");
const checkPuzzleChars = require("./validators/checkPuzzleChars.js");
const checkPuzzleLength = require("./validators/checkPuzzleLength.js");
const checkAllGroupDuplicates = require("./validators/checkAllGroupDuplicates.js");
const checkAllGroupsSolvable = require("./validators/checkAllGroupsSolvable.js");

const solvePuzzle = require("./solvers/solvePuzzle.js");
const rowTest = require("./validators/rowTest.js");
const columnTest = require("./validators/columnTest.js");
const regionTest = require("./validators/regionTest.js");

class SudokuSolver {
  validate(puzzleString) {
    // ensure that puzzleString is valid,
    // and that suduku object can be created.
    if (!checkPuzzleChars(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    } else if (!checkPuzzleLength(puzzleString)) {
      return { error: "Expected puzzle to be 81 characters long" };
    }

    const sudokuGrid = createSudokuObject(puzzleString);

    if (
      !checkAllGroupDuplicates(sudokuGrid) ||
      !checkAllGroupsSolvable(sudokuGrid)
    ) {
      return { error: "Puzzle cannot be solved" };
    } else return { success: "Puzzle String validated" };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const validationResult = this.validate(puzzleString);
    if (validationResult.error) {
      return validationResult;
    }
    // create grid from which to work
    const sudokuGrid = createSudokuObject(puzzleString);
    // find testSquare (i.e. if row/column coordinates match)
    let testSquare;
    for (let square of sudokuGrid) {
      if (square.row == row && square.column == column) {
        testSquare = square;
        testSquare.currentTestValue = value;
      }
    }
    return rowTest(testSquare, sudokuGrid);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const validationResult = this.validate(puzzleString);
    if (validationResult.error) {
      return validationResult;
    }
    // create grid from which to work
    const sudokuGrid = createSudokuObject(puzzleString);
    // find testSquare (i.e. if row/column coordinates match)
    let testSquare;
    for (let square of sudokuGrid) {
      if (square.row == row && square.column == column) {
        testSquare = square;
        testSquare.currentTestValue = value;
      }
    }
    return columnTest(testSquare, sudokuGrid);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const validationResult = this.validate(puzzleString);
    if (validationResult.error) {
      return validationResult;
    }
    // create grid from which to work
    const sudokuGrid = createSudokuObject(puzzleString);
    // find testSquare (i.e. if row/column coordinates match)
    let testSquare;
    for (let square of sudokuGrid) {
      if (square.row == row && square.column == column) {
        testSquare = square;
        testSquare.currentTestValue = value;
      }
    }
    return regionTest(testSquare, sudokuGrid);
  }

  solve(puzzleString) {
    const validationResult = this.validate(puzzleString);
    if (validationResult.error) {
      return validationResult;
    } else {
      const sudokuGrid = createSudokuObject(puzzleString);
      return solvePuzzle(sudokuGrid);
    }
  }
}

module.exports = SudokuSolver;

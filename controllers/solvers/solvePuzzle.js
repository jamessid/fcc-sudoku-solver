const regionTest = require("../validators/regionTest.js");
const columnTest = require("../validators/columnTest.js");
const rowTest = require("../validators/rowTest.js");

const { testOptions } = require("../createSudokuObject.js");

//console.log(testOptions);

function findPreviousRequiredSquare(currentIndex, grid) {
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (!grid[i].inputValue) {
      return i;
    }
  }
  return -1;
}

function solvePuzzle(sudokuGrid) {
  // move through sudukoGrid
  // this loop will step forwards and backwards, so increment/decrement is included within the loop.
  for (let i = 0; i < sudokuGrid.length; ) {
    // only test and find correct values if square has inputValue
    if (!sudokuGrid[i].inputValue) {
      // if current square has no options remaining, backtrack to previous
      // square that needs value found
      if (sudokuGrid[i].testOptions.length === 0) {
        // reset test options
        sudokuGrid[i].testOptions = [...testOptions];
        // remove currentTestValue
        sudokuGrid[i].currentTestValue = null;
        i = findPreviousRequiredSquare(i, sudokuGrid);
        // skip over looping through options
        continue;
      }

      const optionsLength = sudokuGrid[i].testOptions.length;
      // loop through available options for square
      for (let j = 0; j < optionsLength; j++) {
        sudokuGrid[i].currentTestValue = sudokuGrid[i].testOptions[0];
        // console.log(`Current test value is ${sudokuGrid[i].currentTestValue}`);

        if (
          columnTest(sudokuGrid[i], sudokuGrid) &&
          rowTest(sudokuGrid[i], sudokuGrid) &&
          regionTest(sudokuGrid[i], sudokuGrid)
        ) {
          sudokuGrid[i].testOptions.splice(0, 1);
          i++;
          break;
        } else {
          sudokuGrid[i].testOptions.splice(0, 1);
          if (sudokuGrid[i].testOptions.length === 0) {
            sudokuGrid[i].testOptions = [...testOptions];
            sudokuGrid[i].currentTestValue = null;
            i = findPreviousRequiredSquare(i, sudokuGrid);
            break;
          }
        }
      }
      // if square has input value, increment and continue.
    } else {
      i++;
      continue;
    }
  }

  let solutionString = "";

  for (const square of sudokuGrid) {
    const char = square.inputValue
      ? square.inputValue
      : square.currentTestValue;
    solutionString = solutionString + char;
  }

  return { solution: solutionString };
}

module.exports = solvePuzzle;

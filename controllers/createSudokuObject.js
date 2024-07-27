const testOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function createSudokuObject(puzzleString) {
  // SUDOKU GRID CREATION

  // sudokuGrid will contain array of "square" objects
  const sudokuGrid = [];

  // possible valid options for Sudoku square
  const testOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // columns, in order
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // rows, in order
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  // sudoku region definition
  const regions = [
    { name: "TL", rows: ["A", "B", "C"], columns: [1, 2, 3] },
    { name: "TC", rows: ["D", "E", "F"], columns: [1, 2, 3] },
    { name: "TR", rows: ["G", "H", "I"], columns: [1, 2, 3] },
    { name: "CL", rows: ["A", "B", "C"], columns: [4, 5, 6] },
    { name: "CC", rows: ["D", "E", "F"], columns: [4, 5, 6] },
    { name: "CR", rows: ["G", "H", "I"], columns: [4, 5, 6] },
    { name: "BL", rows: ["A", "B", "C"], columns: [7, 8, 9] },
    { name: "BC", rows: ["D", "E", "F"], columns: [7, 8, 9] },
    { name: "BR", rows: ["G", "H", "I"], columns: [7, 8, 9] },
  ];

  // create square object, and push to sudokuGrid
  for (let i = 0; i < puzzleString.length; i++) {
    // create object for each square
    const square = {};
    // if square contains an input value, set value.
    square.inputValue = !isNaN(puzzleString[i])
      ? Number(puzzleString[i])
      : null;
    // test values will be the values to try as backtrack algo completes;
    square.currentTestValue = null;
    square.testOptions = [...testOptions];
    square.index = i;
    sudokuGrid.push(square);
  }

  // add column data. Iterate 1 through 9, 9 times.
  let squareIndex = 0;
  for (let i = 1; i < 10; i++) {
    for (const column of columns) {
      sudokuGrid[squareIndex].column = column;
      squareIndex++;
    }
  }

  // TODO: This will need to iterate through NEW row array!! Now letters!
  // add row data. Increase row number after every 9 squares
  let rowIndex = 0;
  for (let i = 0; i < 81; i++) {
    if (i % 9 == 0 && i > 0) {
      rowIndex++;
    }
    sudokuGrid[i].row = rows[rowIndex];
  }

  // add area data
  for (const square of sudokuGrid) {
    for (const region of regions) {
      if (
        region.columns.indexOf(square.column) >= 0 &&
        region.rows.indexOf(square.row) >= 0
      ) {
        square.region = region.name;
      }
    }
  }
  return sudokuGrid;
}

module.exports = { createSudokuObject, testOptions };

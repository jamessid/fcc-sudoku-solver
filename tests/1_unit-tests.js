const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  test("valid puzzle string", function () {
    const validString =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const validityMessage = solver.validate(validString);
    assert.property(validityMessage, "success");
  });
  test("puzzleString with invalid chars", function () {
    const invalidString =
      "1.5.x2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const validityMessage = solver.validate(invalidString);
    assert.propertyVal(
      validityMessage,
      "error",
      "Invalid characters in puzzle"
    );
  });
  test("short string", function () {
    const shortString =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37";
    const validityMessage = solver.validate(shortString);
    assert.propertyVal(
      validityMessage,
      "error",
      "Expected puzzle to be 81 characters long"
    );
  });
  test("valid row placement", function () {
    const puzzleString =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const row = "A";
    const column = 2;
    const value = 3;
    const rowPlacement = solver.checkRowPlacement(
      puzzleString,
      row,
      column,
      value
    );
    assert.isTrue(rowPlacement);
  });
  test("invalid row placement", function () {
    const puzzleString =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const row = "A";
    const column = 2;
    const value = 1;
    const rowPlacement = solver.checkRowPlacement(
      puzzleString,
      row,
      column,
      value
    );
    assert.isNotTrue(rowPlacement);
  });
  test("valid column placement", function () {
    const puzzleString =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const row = "A";
    const column = 2;
    const value = 1;
    const colPlacement = solver.checkColPlacement(
      puzzleString,
      row,
      column,
      value
    );
    assert.isTrue(colPlacement);
  });
  test("invalid column placement", function () {
    const puzzleString =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const row = "A";
    const column = 2;
    const value = 2;
    const colPlacement = solver.checkColPlacement(
      puzzleString,
      row,
      column,
      value
    );
    assert.isNotTrue(colPlacement);
  });
  test("valid region placement", function () {
    const puzzleString =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const row = "A";
    const column = 2;
    const value = 3;
    const regionPlacement = solver.checkRegionPlacement(
      puzzleString,
      row,
      column,
      value
    );
    assert.isTrue(regionPlacement);
  });
  test("invalid region placement", function () {
    const puzzleString =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const row = "A";
    const column = 2;
    const value = 1;
    const regionPlacement = solver.checkRegionPlacement(
      puzzleString,
      row,
      column,
      value
    );
    assert.isNotTrue(regionPlacement);
  });
  test("valid puzzle passing solver", function () {
    const puzzleString =
      "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51";
    const result = solver.solve(puzzleString);
    assert.property(result, "solution");
  });
  test("invalid puzzle failing solver", function () {
    // E1 is unsolvable - no possible candidates
    const puzzleString =
      "..9.287..8.6..4..5..3.....46.........2.71345.........23.....5..9..4..8.7..125.3..";
    const result = solver.solve(puzzleString);
    assert.property(result, "error");
  });
  test("valid puzzle returning correct solution", function () {
    const puzzleString =
      "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51";
    const result = solver.solve(puzzleString);
    assert.propertyVal(
      result,
      "solution",
      "827549163531672894649831527496157382218396475753284916962415738185763249374928651"
    );
  });
});

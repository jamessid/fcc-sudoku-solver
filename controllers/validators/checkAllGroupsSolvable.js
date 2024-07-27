const regionTest = require("./regionTest.js");
const columnTest = require("./columnTest.js");
const rowTest = require("./rowTest.js");

function checkAllGroupsSolvable(grid) {
  return (
    checkSquaresSolvable(grid) &&
    checkRegionSolvable(grid) &&
    checkColumnSolvable(grid) &&
    checkRowSolvable(grid)
  );
}

// 1) Check that every square has at least one candidate

function checkSquaresSolvable(grid) {
  // every square needs to tested.
  for (let testSquare of grid) {
    // we only care about those squares we are looking for solutions for.
    if (!testSquare.inputValue) {
      // start with full options for testSquare
      let candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      // loop through entire grid for every test square
      for (let square of grid) {
        if (
          // if:
          /// a) the input value of the current square can be found in the candidates array
          /// b) AND the area, row, or column matches
          /// c) AND testSquare is not testing against itself
          candidates.indexOf(square.inputValue) > -1 &&
          (testSquare.row === square.row ||
            testSquare.column === square.column ||
            testSquare.region === square.region) &&
          testSquare.index != square.index
        ) {
          // then remove inputValue from candidates array
          let index = candidates.indexOf(square.inputValue);
          candidates.splice(index, 1);
          // if there are no candidates left, fail test
          if (candidates.length === 0) {
            console.log(
              `Error: square R${testSquare.row}, C${testSquare.column} has no candidates`
            );
            return false;
          }
        }
      }
    }
  }
  // if we get to end of grid and all squares have at least one candidate..
  return true;
}

// 2) Check that each group is solvable
// i.e. work out a region/row/column's required values, then work out valid candidates, and compare.

// a) get all required values to complete a row/area/column
// this function will create an object: { 1: [1, 5, 6], 2: [7, 8, 9] } etc.
// [square[groupName]] accesses the appropriate value of the square we are considering.
function getGroupRequiredValues(grid, groupName) {
  let requiredGroupValues = {};
  let options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let square of grid) {
    // if component (reference of row/area/column) does not exist in object, create with array with all options
    if (!requiredGroupValues[square[groupName]]) {
      requiredGroupValues[square[groupName]] = [...options];
    }
    if (square.inputValue) {
      let index = requiredGroupValues[square[groupName]].indexOf(
        square.inputValue
      );
      // if inputValue can be found in options array for that row/column/area
      if (index > -1) {
        // then remove that inputValue from the required row/column/area values
        requiredGroupValues[square[groupName]].splice(index, 1);
      }
    }
  }
  return requiredGroupValues;
}

// b) find all valid candidates for a group
// in this instance, any inputValues within a group will count as a candidate, as these can be used to "fulfill" a requirement
// for

// finds all candidates (all possible values from starting grid arrangement) for a row/area/column as a whole.
// this function will create an object: { 1: [1, 5, 6], 2: [7, 8, 9] } etc.
// [square[groupName]] accesses the appropriate value of the square we are considering.
function getGroupCandidates(grid, groupName) {
  const groupCandidates = {};
  for (let square of grid) {
    // if row/area/column does not exist in object, create with empty array
    if (!groupCandidates[square[groupName]]) {
      groupCandidates[square[groupName]] = [];
    }

    // we are only going to have candidates for empty squares
    if (!square.inputValue) {
      for (let i = 1; i < 10; i++) {
        square.currentTestValue = i;
        if (
          regionTest(square, grid) &&
          columnTest(square, grid) &&
          rowTest(square, grid)
        ) {
          // if passing test value doesn't yet exist in the group's candidates, push to candidates array
          if (groupCandidates[square[groupName]].indexOf(i) === -1) {
            groupCandidates[square[groupName]].push(i);
          }
        }
      }
    }
    // reset test value to null
    square.currentTestValue = null;
  }
  return groupCandidates;
}

// c) compare the group's required values to the candidates available

// check that all required values for each component can be found in component candidates
function checkGroupSolvable(required, candidates) {
  // loop through each component reference (A, B, C for columns, for example)
  for (let group in required) {
    const requiredValues = required[group];
    // then loop through each array of required values
    for (let value of requiredValues) {
      // if required value NOT found in appropriate candidates array
      // console.log(candidates);
      if (candidates[group].indexOf(value) === -1) {
        console.log(`Error: fail on ${group} (value of ${value})`);
        return false;
      }
    }
  }
  // if all loops complete
  return true;
}

function checkRegionSolvable(grid) {
  const region = "region";
  const requiredValues = getGroupRequiredValues(grid, region);
  const candidates = getGroupCandidates(grid, region);
  return checkGroupSolvable(requiredValues, candidates);
}

function checkColumnSolvable(grid) {
  const column = "column";
  const requiredValues = getGroupRequiredValues(grid, column);
  const candidates = getGroupCandidates(grid, column);
  return checkGroupSolvable(requiredValues, candidates);
}

function checkRowSolvable(grid) {
  const row = "row";
  const requiredValues = getGroupRequiredValues(grid, row);
  const candidates = getGroupCandidates(grid, row);
  return checkGroupSolvable(requiredValues, candidates);
}

module.exports = checkAllGroupsSolvable;

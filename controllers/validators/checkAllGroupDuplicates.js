function checkAllGroupDuplicates(grid) {
  return (
    checkRegionDuplicates(grid) &&
    checkColumnDuplicates(grid) &&
    checkRowDuplicates(grid)
  );
}

// get all row/column/area values, on which we can then check for duplicates
// will return { TL: [1, 2, 3], TC: [8, 9] ... } / { A: [2, 5], B: [4, 7] ... } / { 1: [6, 7] ... } etc.
function groupValues(grid, groupName) {
  // create object in which to hold "group" (row/area/column) keys
  let groupValues = {};
  for (let square of grid) {
    //console.log(grid);
    // if group does not exist in object, create with empty array
    if (!groupValues[square[groupName]]) {
      groupValues[square[groupName]] = [];
    }
    // push every inputValue to applicable row/area/column
    if (square.inputValue) {
      groupValues[square[groupName]].push(square.inputValue);
    }
  }
  return groupValues;
}

// check for duplicates in the rows/columns/arrays (groups)
// maxOption is the maximum option for a square
// in Sudoku's case, 9.
function checkGroupDuplicates(groupValues, groupName, maxOption) {
  for (let group in groupValues) {
    for (let i = 1; i <= maxOption; i++) {
      // to hold instances of current test number (i)
      let instances = [];
      // find the index of the current test number in the group's values
      let index = groupValues[group].indexOf(i);
      // if the test value appears in the group value...
      while (index != -1) {
        // ... add to the instances array.
        instances.push(index);
        // reset index (where test value is found, to next instance in array)
        index = groupValues[group].indexOf(i, index + 1);
        // if another instance of the test number is found, it will push to instances array, triggering this if statement to execute
        if (instances.length > 1) {
          console.error(`Error: duplicates in ${groupName} ${group} found`);
          return false;
        }
      }
    }
  }
  return true;
}

function checkRegionDuplicates(grid) {
  const region = "region";
  const regionValues = groupValues(grid, region);
  return checkGroupDuplicates(regionValues, region, 9);
}

function checkColumnDuplicates(grid) {
  const column = "column";
  const columnValues = groupValues(grid, column);
  return checkGroupDuplicates(columnValues, column, 9);
}

function checkRowDuplicates(grid) {
  const row = "row";
  const rowValues = groupValues(grid, row);
  return checkGroupDuplicates(rowValues, row, 9);
}

module.exports = checkAllGroupDuplicates;

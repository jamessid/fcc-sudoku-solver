function rowTest(testSquare, grid) {
  for (const square of grid) {
    let comparisonValue;
    if (square.inputValue) {
      comparisonValue = square.inputValue;
    } else if (square.currentTestValue) {
      comparisonValue = square.currentTestValue;
    } else comparisonValue = null;

    if (
      testSquare.row == square.row &&
      testSquare.index != square.index &&
      testSquare.currentTestValue == comparisonValue
    ) {
      return false;
    }
  }

  return true;
}

module.exports = rowTest;

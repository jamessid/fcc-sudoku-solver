function checkPuzzleChars(puzzleString) {
  const validCharRegex = new RegExp("[0-9]|[.]");
  for (let char of puzzleString) {
    if (!validCharRegex.test(char)) {
      return false;
    }
  }
  return true;
}

module.exports = checkPuzzleChars;

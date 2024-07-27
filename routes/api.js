"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res, next) => {
    // ensure that all fields we need are in body
    if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
      res.json({ error: "Required field(s) missing" });
      return;
    }

    // define regex for valid coords and value
    const validCoordinate = /^[A-I][1-9]$/;
    const validValue = /^[1-9]$/;
    // set coords and value
    const coordinate = req.body.coordinate;
    const value = req.body.value;

    // check that coordinate is valid
    if (!validCoordinate.test(coordinate)) {
      res.json({ error: "Invalid coordinate" });
      return;
    }

    // check that value is valid
    if (!validValue.test(value)) {
      res.json({ error: "Invalid value" });
      return;
    }

    const puzzle = req.body.puzzle;

    // check that puzzle is valid
    const puzzleValidationResult = solver.validate(puzzle);

    if (puzzleValidationResult.error) {
      res.send(puzzleValidationResult);
      return;
    }

    // otherwise, check placement and return result.
    const row = req.body.coordinate[0];
    const column = req.body.coordinate[1];

    // determine results and save in array to allow us to loop through later
    const groupResults = [
      {
        name: "row",
        result: solver.checkRowPlacement(puzzle, row, column, value),
      },
      {
        name: "column",
        result: solver.checkColPlacement(puzzle, row, column, value),
      },
      {
        name: "region",
        result: solver.checkRegionPlacement(puzzle, row, column, value),
      },
    ];

    const result = { valid: true };

    for (let group of groupResults) {
      if (!group.result) {
        result.valid = false;
        result.conflict = result.conflict
          ? [...result.conflict, group.name]
          : [group.name];
      }
    }

    res.json(result);
    return;
  });

  app.route("/api/solve").post((req, res) => {
    // check that a puzzle is being requested
    if (!req.body.puzzle) {
      res.json({ error: "Required field missing" });
      return;
    }

    // if we have a puzzle, validate
    const puzzleValidation = solver.validate(req.body.puzzle);
    // if an error is returned, respond with that error.
    if (puzzleValidation.error) {
      res.json(puzzleValidation);
      return;
    }

    if (puzzleValidation.success) {
      const solution = solver.solve(req.body.puzzle);
      res.json(solution);
      return;
    }
  });
};

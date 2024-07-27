const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  test("POST valid puzzle to /api/solve", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle:
          "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
      })
      .end(function (err, res) {
        assert.propertyVal(
          res.body,
          "solution",
          "568913724342687519197254386685479231219538467734162895926345178473891652851726943"
        );
        done();
      });
  });
  test("POST missing puzzle to /api/solve", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({})
      .end(function (err, res) {
        assert.propertyVal(res.body, "error", "Required field missing");
        done();
      });
  });
  test("POST puzzle with invalid chars to /api/solve", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle:
          ".7y89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
      })
      .end(function (err, res) {
        assert.propertyVal(res.body, "error", "Invalid characters in puzzle");
        done();
      });
  });
  test("POST puzzle with incorrect length to /api/solve", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle:
          ".789.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
      })
      .end(function (err, res) {
        assert.propertyVal(
          res.body,
          "error",
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });
  test("POST puzzle unsolvable puzzle to /api/solve", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      // row 5 in puzzle below is unsolvable
      .send({
        puzzle:
          "9..1....4.14.3.8....3....9....7.8..18....3..........3..21....7...9.4.5..5...16..3",
      })
      .end(function (err, res) {
        assert.propertyVal(res.body, "error", "Puzzle cannot be solved");
        done();
      });
  });
  test("POST valid puzzle placement to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
        value: 7,
      })
      .end(function (err, res) {
        assert.propertyVal(res.body, "valid", true);
        done();
      });
  });
  test("POST puzzle placement with 1x conflict to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
        value: 2,
      })
      .end(function (err, res) {
        assert.hasAllKeys(res.body, ["valid", "conflict"]);
        assert.isNotTrue(res.body.valid);
        assert.isArray(res.body.conflict);
        assert.sameMembers(res.body.conflict, ["region"]);
        done();
      });
  });
  test("POST puzzle placement with 2x conflict to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
        value: 1,
      })
      .end(function (err, res) {
        assert.hasAllKeys(res.body, ["valid", "conflict"]);
        assert.isNotTrue(res.body.valid);
        assert.isArray(res.body.conflict);
        assert.sameMembers(res.body.conflict, ["row", "column"]);
        done();
      });
  });
  test("POST puzzle placement with 3x (all) conflict to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "B3",
        value: 2,
      })
      .end(function (err, res) {
        assert.hasAllKeys(res.body, ["valid", "conflict"]);
        assert.isNotTrue(res.body.valid);
        assert.isArray(res.body.conflict);
        assert.sameMembers(res.body.conflict, ["row", "column", "region"]);
        done();
      });
  });
  test("POST missing fields /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({})
      .end(function (err, res) {
        assert.propertyVal(res.body, "error", "Required field(s) missing");
        done();
      });
  });
  test("POST puzzle string with invalid chars to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "xy9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "B3",
        value: 2,
      })
      .end(function (err, res) {
        assert.propertyVal(res.body, "error", "Invalid characters in puzzle");
        done();
      });
  });
  test("POST puzzle string with invalid length to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492",
        coordinate: "B3",
        value: 2,
      })
      .end(function (err, res) {
        assert.propertyVal(
          res.body,
          "error",
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });
  test("POST puzzle string with invalid coordinate to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
        coordinate: "Z3",
        value: 2,
      })
      .end(function (err, res) {
        assert.propertyVal(res.body, "error", "Invalid coordinate");
        done();
      });
  });
  test("POST puzzle string with invalid value to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
        coordinate: "A2",
        value: 23,
      })
      .end(function (err, res) {
        assert.propertyVal(res.body, "error", "Invalid value");
        done();
      });
  });
});

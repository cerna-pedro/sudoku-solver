const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
  test('Logic handles a valid puzzle string of 81 characters', (done) => {
    let input =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.validate(input), false);
    done();
  });
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
    let input =
      '1a5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.validate(input), true);
    done();
  });
  test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
    let input = '123';
    assert.equal(solver.checkLength(input), true);
    done();
  });
  test('Logic handles a valid row placement', (done) => {
    let input = 'A';
    assert.equal(solver.checkRow(input), false);
    done();
  });
  test('Logic handles an invalid row placement', (done) => {
    let input = 'j';
    assert.equal(solver.checkRow(input), true);
    done();
  });
  test('Logic handles a valid column placement', (done) => {
    let input = '1';
    assert.equal(solver.checkColumn(input), false);
    done();
  });
  test('Logic handles an invalid column placement', (done) => {
    let input = '0';
    assert.equal(solver.checkColumn(input), true);
    done();
  });
  test('Logic handles a valid region (3x3 grid) placement', (done) => {
    let puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    let row = 'A';
    let column = '2';
    let value = '3';
    assert.equal(
      solver.checkRegionPlacement(puzzleString, row, column, value),
      undefined
    );
    done();
  });
  test('Logic handles an invalid region (3x3 grid) placement', (done) => {
    let puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    let row = 'A';
    let column = '2';
    let value = '5';
    assert.equal(
      solver.checkRegionPlacement(puzzleString, row, column, value),
      'region'
    );
    done();
  });
  test('Valid puzzle strings pass the solver', (done) => {
    let input =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(
      solver.solve(input),
      '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
    );
    done();
  });
  test('Invalid puzzle strings fail the solver', (done) => {
    let input =
      '155..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.solve(input), 'No Solution');
    done();
  });
  test('Solver returns the the expected solution for an incomplete puzzzle', (done) => {
    let input =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(
      solver.solve(input),
      '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
    );
    done();
  });
});

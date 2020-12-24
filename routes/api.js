'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }
    const row = coordinate[0].toUpperCase();
    const column = coordinate[1];
    const isInvalid = solver.validate(puzzle);
    if (isInvalid) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }
    const isWrongLength = solver.checkLength(puzzle);
    if (isWrongLength) {
      return res.json({
        error: 'Expected puzzle to be 81 characters long',
      });
    }
    const isInvalidRow = solver.checkRow(row);
    if (isInvalidRow) {
      return res.json({ error: 'Invalid coordinate' });
    }
    const isInvalidColumn = solver.checkColumn(column);
    if (isInvalidColumn) {
      return res.json({ error: 'Invalid coordinate' });
    }
    const isInvalidValue = solver.checkValue(value);
    if (isInvalidValue) {
      return res.json({ error: 'Invalid value' });
    }
    const gridObject = solver.mapGrid(puzzle);
    const rowConflict = solver.checkRowPlacement(puzzle, row, column, value);
    const columnConflict = solver.checkColPlacement(puzzle, row, column, value);
    const regionConflict = solver.checkRegionPlacement(
      puzzle,
      row,
      column,
      value
    );
    const conflict = [rowConflict, columnConflict, regionConflict].filter(
      Boolean
    );
    if (conflict.length) {
      return res.json({ valid: false, conflict });
    }
    return res.json({ valid: true });
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) {
      return res.json({ error: 'Required field missing' });
    }
    const isInvalid = solver.validate(puzzle);
    if (isInvalid) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }
    const isWrongLength = solver.checkLength(puzzle);
    if (isWrongLength) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }
    const solution = solver.solve(puzzle);
    if (solution === 'No Solution') {
      return res.json({ error: 'Puzzle cannot be solved' });
    }
    return res.json({ solution });
  });
};

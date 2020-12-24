class SudokuSolver {
  validate(puzzleString) {
    const regex = /[1-9.]/;
    for (const character of puzzleString) {
      if (!regex.test(character)) {
        return true;
      }
    }
    return false
  }

  checkLength(puzzleString) {
    if (puzzleString.length !== 81) {
      return true;
    }
    return false
  }

  checkRow(row) {
    const regex = /[A-Ia-i]/;
    return !regex.test(row);
  }

  checkColumn(column) {
    const regex = /[1-9]/;
    return !regex.test(column);
  }

  checkValue(value) {
    const regex = /[1-9]/;
    return !regex.test(value);
  }

  mapGrid(puzzleString) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const columns = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const regionKey = {
      0: { top: ['1', '2', '3'], side: ['A', 'B', 'C'] },
      1: { top: ['4', '5', '6'], side: ['A', 'B', 'C'] },
      2: { top: ['7', '8', '9'], side: ['A', 'B', 'C'] },
      3: { top: ['1', '2', '3'], side: ['D', 'E', 'F'] },
      4: { top: ['4', '5', '6'], side: ['D', 'E', 'F'] },
      5: { top: ['7', '8', '9'], side: ['D', 'E', 'F'] },
      6: { top: ['1', '2', '3'], side: ['G', 'H', 'I'] },
      7: { top: ['4', '5', '6'], side: ['G', 'H', 'I'] },
      8: { top: ['7', '8', '9'], side: ['G', 'H', 'I'] },
    };
    const grid = {};
    let i = 0;
    let j = 0;
    for (let value of puzzleString) {
      if (j > 8) {
        j = 0;
        i++;
      }
      grid[rows[i] + columns[j]] = { value };
      j++;
    }
    let rowNumber = 0;
    let regionRowNumber = 0;
    Object.entries(grid).forEach((entry, i, arr) => {
      const region = [];
      rowNumber = Math.floor(i / 9);
      regionRowNumber = Math.floor(i / 27);
      const key = Math.floor((i - rowNumber * 9) / 3 + 3 * regionRowNumber);
      const regionKeyArr = Object.values(regionKey[key]);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          region.push(grid[regionKeyArr[1][i] + regionKeyArr[0][j]].value);
        }
      }
      const row = arr
        .filter((x) => x[0].includes(entry[0][0]))
        .map((y) => y[1].value);
      const column = arr
        .filter((x) => x[0].includes(entry[0][1]))
        .map((y) => y[1].value);
      grid[entry[0]] = { ...grid[entry[0]], row, column, region };
    });
    return grid;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.mapGrid(puzzleString);
    const conflict = grid[row + column].row.find((x) => x === value);
    if (conflict) {
      return 'row';
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.mapGrid(puzzleString);
    const conflict = grid[row + column].column.find((x) => x === value);
    if (conflict) {
      return 'column';
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.mapGrid(puzzleString);
    const conflict = grid[row + column].region.find((x) => x === value);
    if (conflict) {
      return 'region';
    }
  }

  solve(puzzleString) {
    const time = Date.now()
    const possibleValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let grid = this.mapGrid(puzzleString);
    const innerSolve = (updatedString, row, col) => {
      updatedString = Object.values(grid)
        .map((x) => x.value)
        .join('');
      let newTime = Date.now()
      if (newTime - time > 4900) {
        return updatedString
      }
      if (col === '10') {
        col = '1';
        row = String.fromCharCode(row.charCodeAt(0) + 1);
      }
      if (row === 'J') {
        return updatedString;
      }
      if (grid[row + col].value !== '.') {
        return innerSolve(updatedString, row, (parseInt(col) + 1).toString());
      }
      for (const num of possibleValues) {
        const rowError = this.checkRowPlacement(updatedString, row, col, num);

        const columnError = this.checkColPlacement(
          updatedString,
          row,
          col,
          num
        );

        const regionError = this.checkRegionPlacement(
          updatedString,
          row,
          col,
          num
        );

        if (rowError || columnError || regionError) {
          continue;
        }
        grid[row + col] = { value: num };
        if (innerSolve(updatedString, row, (parseInt(col) + 1).toString())) {
          return innerSolve(updatedString, row, (parseInt(col) + 1).toString());
        } else {
          grid[row + col] = { value: '.' };
        }
      }
      return false;
    };
    innerSolve(puzzleString, 'A', '1');
    if (
      Object.values(grid)
        .map((x) => x.value)
        .join('')
        .includes('.')
    ) {
      return 'No Solution';
    } else {
      return Object.values(grid)
        .map((x) => x.value)
        .join('');
    }
  }
}

module.exports = SudokuSolver;

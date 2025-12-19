import type { Grid, Position } from '../types/game';

export const checkForMatches = (grid: Grid): Position[] => {
    const matchedPositions: Position[] = [];
    const rows = grid.length;
    const cols = grid[0].length;

    // Horizontal matches
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 2; c++) {
            const candy1 = grid[r][c];
            const candy2 = grid[r][c + 1];
            const candy3 = grid[r][c + 2];

            if (candy1 && candy2 && candy3 && candy1.color === candy2.color && candy1.color === candy3.color) {
                matchedPositions.push({ row: r, col: c });
                matchedPositions.push({ row: r, col: c + 1 });
                matchedPositions.push({ row: r, col: c + 2 });
                // Check for more than 3
                let k = c + 3;
                while (k < cols) {
                    const nextCandy = grid[r][k];
                    if (nextCandy && nextCandy.color === candy1.color) {
                        matchedPositions.push({ row: r, col: k });
                        k++;
                    } else {
                        break;
                    }
                }
            }
        }
    }

    // Vertical matches
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 2; r++) {
            const candy1 = grid[r][c];
            const candy2 = grid[r + 1][c];
            const candy3 = grid[r + 2][c];

            if (candy1 && candy2 && candy3 && candy1.color === candy2.color && candy1.color === candy3.color) {
                matchedPositions.push({ row: r, col: c });
                matchedPositions.push({ row: r + 1, col: c });
                matchedPositions.push({ row: r + 2, col: c });
                // Check for more than 3
                let k = r + 3;
                while (k < rows) {
                    const nextCandy = grid[k][c];
                    if (nextCandy && nextCandy.color === candy1.color) {
                        matchedPositions.push({ row: k, col: c });
                        k++;
                    } else {
                        break;
                    }
                }
            }
        }
    }

    // Remove duplicates
    const uniquePositions = matchedPositions.filter((pos, index, self) =>
        index === self.findIndex((p) => p.row === pos.row && p.col === pos.col)
    );

    return uniquePositions;
};

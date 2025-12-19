import type { Candy, CandyColor, Grid } from '../types/game';
import { v4 as uuidv4 } from 'uuid';

const COLORS: CandyColor[] = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];

export const generateGrid = (rows: number, cols: number): Grid => {
    const grid: Grid = [];
    for (let r = 0; r < rows; r++) {
        const row: (Candy | null)[] = [];
        for (let c = 0; c < cols; c++) {
            row.push(createRandomCandy());
        }
        grid.push(row);
    }
    return grid;
};

export const createRandomCandy = (): Candy => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
        id: uuidv4(),
        color,
        type: 'Normal',
    };
};

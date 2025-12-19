import React from 'react';
import type { Grid, Position } from '../types/game';
import { Candy } from './Candy';

// ... (imports remain)
interface BoardProps {
    grid: Grid;
    onCandyClick: (pos: Position) => void;
    onCandySwipe: (from: Position, to: Position) => void;
    selectedPos: Position | null;
}

export const Board: React.FC<BoardProps> = ({ grid, onCandyClick, onCandySwipe, selectedPos }) => {
    return (
        <div className="grid grid-cols-8 gap-1 bg-gray-800 p-2 rounded-lg shadow-2xl w-fit mx-auto">
            {grid.map((row, r) =>
                row.map((candy, c) => {
                    const isSelected = selectedPos?.row === r && selectedPos?.col === c;
                    return (
                        <div key={`${r}-${c}`} className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14">
                            <Candy
                                candy={candy}
                                onClick={() => onCandyClick({ row: r, col: c })}
                                isSelected={isSelected}
                                onSwipe={(dir) => {
                                    let targetRow = r;
                                    let targetCol = c;
                                    if (dir === 'UP') targetRow--;
                                    if (dir === 'DOWN') targetRow++;
                                    if (dir === 'LEFT') targetCol--;
                                    if (dir === 'RIGHT') targetCol++;

                                    onCandySwipe({ row: r, col: c }, { row: targetRow, col: targetCol });
                                }}
                            />
                        </div>
                    );
                })
            )}
        </div>
    );
};

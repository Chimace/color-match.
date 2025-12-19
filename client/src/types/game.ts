export type CandyColor = 'Red' | 'Blue' | 'Green' | 'Yellow' | 'Purple' | 'Orange';

export interface Candy {
    id: string;
    color: CandyColor;
    type: 'Normal' | 'Striped' | 'Wrapped' | 'Bomb';
}

export type Grid = (Candy | null)[][];

export interface Position {
    row: number;
    col: number;
}

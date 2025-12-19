export interface Level {
    id: number;
    targetScore: number;
    moves: number;
}

export const generateLevel = (levelId: number): Level => {
    // Difficulty scaling
    const targetScore = 1000 + (levelId - 1) * 500;
    // Moves decrease slightly every 10 levels, but minimum 15
    const moves = Math.max(15, 30 - Math.floor((levelId - 1) / 5));

    return {
        id: levelId,
        targetScore,
        moves,
    };
};

export const TOTAL_LEVELS = 100;

import { useState, useEffect, useCallback } from 'react';
import { Board } from './components/Board';
import { Login } from './components/Login';
import { generateGrid, createRandomCandy } from './utils/grid';
import { checkForMatches } from './utils/gameLogic';
import { generateLevel, TOTAL_LEVELS } from './utils/levels';
import type { Level } from './utils/levels';
import type { Grid, Position } from './types/game';

interface User {
  id: string;
  username: string;
}

function App() {
  console.log("App rendering...");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [grid, setGrid] = useState<Grid>([]);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState<Level>(generateLevel(1));
  const [movesLeft, setMovesLeft] = useState(level.moves);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [isProcessing, setIsProcessing] = useState(false);

  const startLevel = useCallback((levelId: number) => {
    const newLevel = generateLevel(levelId);
    setLevel(newLevel);
    setMovesLeft(newLevel.moves);
    setScore(0);
    setGameState('playing');
    setGrid(generateGrid(8, 8));
  }, []);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line
      startLevel(1);
    }
  }, [user, startLevel]);

  const handleLogin = (token: string, userData: { id: string; username: string }) => {
    setToken(token);
    setUser(userData);
  };


  const handleCandyClick = (pos: Position) => {
    if (gameState !== 'playing' || isProcessing) return;

    if (!selectedPos) {
      setSelectedPos(pos);
    } else {
      if (selectedPos.row === pos.row && selectedPos.col === pos.col) {
        setSelectedPos(null);
        return;
      }

      const isAdjacent =
        (Math.abs(selectedPos.row - pos.row) === 1 && selectedPos.col === pos.col) ||
        (Math.abs(selectedPos.col - pos.col) === 1 && selectedPos.row === pos.row);

      if (isAdjacent) {
        swapCandies(selectedPos, pos);
        setSelectedPos(null);
      } else {
        setSelectedPos(pos);
      }
    }
  };

  const handleCandySwipe = (from: Position, to: Position) => {
    if (gameState !== 'playing' || isProcessing) return;

    // Check bounds
    if (to.row < 0 || to.row >= 8 || to.col < 0 || to.col >= 8) return;

    swapCandies(from, to);
    setSelectedPos(null);
  };

  const swapCandies = (pos1: Position, pos2: Position) => {
    setIsProcessing(true);
    const newGrid = [...grid.map(row => [...row])];
    const temp = newGrid[pos1.row][pos1.col];
    newGrid[pos1.row][pos1.col] = newGrid[pos2.row][pos2.col];
    newGrid[pos2.row][pos2.col] = temp;

    setGrid(newGrid);
    setMovesLeft(prev => prev - 1);

    setTimeout(() => {
      const matches = checkForMatches(newGrid);
      if (matches.length > 0) {
        removeMatches(newGrid, matches, score); // Pass current score state
      } else {
        // Ideally swap back here if no match
        // For simplicity, we count it as a move even if no match (or implement swap back)
        checkGameStatus(score, movesLeft - 1);
        setIsProcessing(false);
      }
    }, 300);
  };

  const removeMatches = (currentGrid: Grid, matches: Position[], currentScore: number) => {
    const newGrid = [...currentGrid.map(row => [...row])];
    matches.forEach(pos => {
      newGrid[pos.row][pos.col] = null;
    });

    const points = matches.length * 10;
    const newScore = currentScore + points; // Use passed score
    setScore(newScore);
    setGrid(newGrid);

    checkGameStatus(newScore, movesLeft - 1);

    setTimeout(() => {
      applyGravity(newGrid, newScore); // Pass accumulated score
    }, 300);
  };

  const applyGravity = (currentGrid: Grid, currentScore: number) => {
    const newGrid = [...currentGrid.map(row => [...row])];
    const rows = newGrid.length;
    const cols = newGrid[0].length;

    for (let c = 0; c < cols; c++) {
      let emptySlots = 0;
      for (let r = rows - 1; r >= 0; r--) {
        if (newGrid[r][c] === null) {
          emptySlots++;
        } else if (emptySlots > 0) {
          newGrid[r + emptySlots][c] = newGrid[r][c];
          newGrid[r][c] = null;
        }
      }
      for (let r = 0; r < emptySlots; r++) {
        newGrid[r][c] = createRandomCandy();
      }
    }
    setGrid(newGrid);

    setTimeout(() => {
      const matches = checkForMatches(newGrid);
      if (matches.length > 0) {
        removeMatches(newGrid, matches, currentScore); // Pass accumulated score again
      } else {
        checkGameStatus(currentScore, movesLeft - 1); // Moves don't decrease on cascade, but we check win condition
        setIsProcessing(false);
      }
    }, 300);
  };

  const checkGameStatus = (currentScore: number, currentMoves: number) => {
    if (currentScore >= level.targetScore) {
      setGameState('won');
      saveProgress(level.id, currentScore, 3); // Mock stars
    } else if (currentMoves <= 0) {
      setGameState('lost');
    }
  };

  const saveProgress = async (levelId: number, score: number, stars: number) => {
    if (!token) return;
    try {
      await fetch('http://localhost:3000/api/progress/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ levelId, score, stars }),
      });
    } catch (err) {
      console.error('Failed to save progress', err);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white font-sans">
      <div className="flex justify-between w-full max-w-md mb-4 px-4">
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-sm">Level</span>
          <span className="text-2xl font-bold text-pink-500">{level.id}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-sm">Score</span>
          <span className="text-2xl font-bold text-yellow-400">{score} / {level.targetScore}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-sm">Moves</span>
          <span className="text-2xl font-bold text-blue-400">{movesLeft}</span>
        </div>
      </div>

      {grid.length > 0 && (
        <div className="relative">
          <Board
            grid={grid}
            onCandyClick={handleCandyClick}
            onCandySwipe={handleCandySwipe}
            selectedPos={selectedPos}
          />
          {gameState !== 'playing' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg z-10">
              <h2 className={`text-5xl font-bold mb-4 ${gameState === 'won' ? 'text-green-400' : 'text-red-500'}`}>
                {gameState === 'won' ? 'Level Complete!' : 'Out of Moves!'}
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => startLevel(level.id)}
                  className="px-6 py-2 bg-gray-600 rounded hover:bg-gray-500 transition"
                >
                  Retry
                </button>
                {gameState === 'won' && level.id < TOTAL_LEVELS && (
                  <button
                    onClick={() => startLevel(level.id + 1)}
                    className="px-6 py-2 bg-pink-500 rounded hover:bg-pink-400 transition"
                  >
                    Next Level
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

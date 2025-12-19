import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Candy as CandyType } from '../types/game';

interface CandyProps {
    candy: CandyType | null;
    onClick: () => void;
    isSelected: boolean;
    onSwipe: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
}

const colorMap: Record<string, string> = {
    Red: 'bg-red-500',
    Blue: 'bg-blue-500',
    Green: 'bg-green-500',
    Yellow: 'bg-yellow-400',
    Purple: 'bg-purple-500',
    Orange: 'bg-orange-500',
};

export const Candy: React.FC<CandyProps> = ({ candy, onClick, isSelected, onSwipe }) => {
    const touchStart = React.useRef<{ x: number, y: number } | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart.current) return;

        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };

        const diffX = touchEnd.x - touchStart.current.x;
        const diffY = touchEnd.y - touchStart.current.y;
        const minSwipeDistance = 30;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > minSwipeDistance) {
                onSwipe(diffX > 0 ? 'RIGHT' : 'LEFT');
            }
        } else {
            if (Math.abs(diffY) > minSwipeDistance) {
                onSwipe(diffY > 0 ? 'DOWN' : 'UP');
            }
        }
        touchStart.current = null;
    };

    return (
        <div className="w-full h-full relative">
            <AnimatePresence>
                {candy && (
                    <motion.div
                        key="candy"
                        className={`absolute inset-0 rounded-full ${colorMap[candy.color]} cursor-pointer shadow-lg border-2 ${isSelected ? 'border-white scale-110' : 'border-transparent'
                            }`}
                        onClick={onClick}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        layout
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

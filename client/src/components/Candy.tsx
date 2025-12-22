import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Candy as CandyType } from '../types/game';

interface CandyProps {
    candy: CandyType | null;
    onClick: () => void;
    isSelected: boolean;
    onSwipe: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
}

// Bubble color mappings with gradients
const colorMap: Record<string, string> = {
    Red: 'from-red-400 to-red-600 shadow-red-500/50',
    Blue: 'from-blue-400 to-blue-600 shadow-blue-500/50',
    Green: 'from-green-400 to-green-600 shadow-green-500/50',
    Yellow: 'from-yellow-300 to-yellow-500 shadow-yellow-500/50',
    Purple: 'from-purple-400 to-purple-600 shadow-purple-500/50',
    Orange: 'from-orange-400 to-orange-600 shadow-orange-500/50',
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
        <div className="w-full h-full relative p-1">
            <AnimatePresence mode='popLayout'>
                {candy && (
                    <motion.div
                        key={`${candy.id}`} // Use stable ID if available, otherwise fallback is tricky but key="candy" caused issues in some lists
                        // If candy object changes entirely (new id), it triggers exit/enter. 
                        // Assuming the parent maps grid cells and `candy` prop changes from Value to Null or new Value.
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${colorMap[candy.color]} 
                        cursor-pointer shadow-lg border-2 ${isSelected ? 'border-white scale-110 brightness-110' : 'border-transparent border-opacity-50'}
                        flex items-center justify-center backdrop-blur-sm`}
                        onClick={onClick}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        layoutId={`candy-${candy.id}`} // Helpful for layout animations if items move
                        whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{
                            scale: 2,
                            opacity: 0,
                            transition: { duration: 0.2, ease: "easeOut" }
                        }}
                    >
                        {/* Bubble Glare/Reflection */}
                        <div className="absolute top-[15%] left-[15%] w-[25%] h-[15%] bg-white rounded-full opacity-60 rotate-[-45deg] filter blur-[0.5px]"></div>
                        <div className="absolute bottom-[15%] right-[15%] w-[10%] h-[10%] bg-white rounded-full opacity-30 filter blur-[0.5px]"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

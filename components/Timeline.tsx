
import React from 'react';
import { ImageInfo } from '../types';

interface TimelineProps {
    history: ImageInfo[];
    currentIndex: number;
    onSelect: (index: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ history, currentIndex, onSelect }) => {
    if (history.length <= 1) {
        return null; // Don't show the timeline if there's only the original image
    }

    return (
        <div className="w-full max-w-4xl bg-black/40 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 overflow-hidden">
            <div className="px-4 py-2 flex items-center gap-3 overflow-x-auto">
                {history.map((image, index) => (
                    <div
                        key={index}
                        onClick={() => onSelect(index)}
                        className="relative flex-shrink-0 cursor-pointer group"
                    >
                        <img
                            src={image.url}
                            alt={`Version ${index + 1}`}
                            className={`w-16 h-10 object-cover rounded-md transition-all duration-200 ${currentIndex === index ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-indigo-400' : 'border-2 border-transparent group-hover:border-slate-500'}`}
                        />
                        <div className={`absolute inset-0 bg-black/30 rounded-md transition-opacity duration-200 ${currentIndex === index ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}></div>
                         <span className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[10px] bg-black/60 text-white/90 rounded-sm pointer-events-none">
                            {index === 0 ? 'Original' : `Edit ${index}`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
import React from 'react';

interface HeaderProps {
    onReset: () => void;
    showReset: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
    return (
        <header className="w-full p-4 bg-gradient-to-r from-indigo-900/20 via-purple-900/15 to-blue-900/20 backdrop-blur-xl border-b border-gradient-to-r from-indigo-400/30 via-purple-400/20 to-blue-400/30 flex items-center justify-between z-50 relative">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl"></div>
            
            {/* Content */}
            <div className="flex items-center relative z-10">
                <img src="/respace.png" alt="re:space" className="h-10 w-auto filter drop-shadow-lg" />
            </div>
            
            {showReset && (
                <button
                    onClick={onReset}
                    className="px-4 py-2 text-sm font-semibold text-indigo-100 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-500/30 hover:to-purple-500/30 rounded-xl transition-all duration-300 border border-indigo-400/30 hover:border-indigo-300/50 backdrop-blur-sm relative z-10 hover:shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5"
                >
                    Reset Space
                </button>
            )}
        </header>
    );
};

export default Header;
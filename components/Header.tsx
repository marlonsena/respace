import React from 'react';

interface HeaderProps {
    onReset: () => void;
    showReset: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
    return (
        <header className="w-full p-4 bg-black/40 backdrop-blur-lg border-b border-white/20 flex items-center justify-between z-50">
            <div className="flex items-center">
                <img src="/respace.png" alt="re:space" className="h-10 w-auto" />
            </div>
            {showReset && (
                <button
                    onClick={onReset}
                    className="px-4 py-2 text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 rounded-md transition-colors duration-200 border border-white/10"
                >
                    Reset Space
                </button>
            )}
        </header>
    );
};

export default Header;
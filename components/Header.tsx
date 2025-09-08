import React, { useState } from 'react';

interface HeaderProps {
    onReset: () => void;
    showReset: boolean;
}

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (apiKey: string) => void;
    currentApiKey: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, currentApiKey }) => {
    const [apiKey, setApiKey] = useState(currentApiKey);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(apiKey);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-gradient-to-br from-indigo-900/90 via-purple-900/85 to-blue-900/90 backdrop-blur-xl border border-indigo-400/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Bring Your Own Key (BYOK)</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">
                            Gemini API Key
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Gemini API key"
                            className="w-full px-3 py-2 bg-white/10 border border-indigo-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                        />
                    </div>
                    
                    <div className="bg-indigo-900/30 border border-indigo-400/20 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-indigo-200 mb-2">How to get your API key:</h3>
                        <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                            <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-indigo-200 underline">Google AI Studio</a></li>
                            <li>Sign in with your Google account</li>
                            <li>Click "Create API Key"</li>
                            <li>Copy the generated key and paste it above</li>
                        </ol>
                        <p className="text-xs text-yellow-300 mt-2">
                            ⚠️ Your API key is stored locally and never sent to our servers.
                        </p>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600/20 hover:bg-gray-500/30 rounded-lg transition-all duration-200 border border-gray-500/30"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/25"
                        >
                            Save Key
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userApiKey, setUserApiKey] = useState(() => {
        return localStorage.getItem('gemini-api-key') || '';
    });

    const handleSaveApiKey = (apiKey: string) => {
        setUserApiKey(apiKey);
        if (apiKey) {
            localStorage.setItem('gemini-api-key', apiKey);
        } else {
            localStorage.removeItem('gemini-api-key');
        }
    };

    return (
        <>
            <header className="w-full p-4 bg-gradient-to-r from-indigo-900/20 via-purple-900/15 to-blue-900/20 backdrop-blur-xl border-b border-gradient-to-r from-indigo-400/30 via-purple-400/20 to-blue-400/30 flex items-center justify-between z-50 relative">
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl"></div>
                
                {/* Content */}
                <div className="flex items-center relative z-10">
                    <img src={`${import.meta.env.BASE_URL}respace.png`} alt="re:space" className="h-10 w-auto filter drop-shadow-lg" />
                </div>
                
                <div className="flex items-center gap-3 relative z-10">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 text-sm font-semibold text-indigo-100 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl transition-all duration-300 border border-purple-400/30 hover:border-purple-300/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-0.5 flex items-center gap-2"
                        title="Bring Your Own Key"
                    >
                        <span className="text-xs">🔑</span>
                        BYOK
                        {userApiKey && <span className="w-2 h-2 bg-green-400 rounded-full"></span>}
                    </button>
                    
                    {showReset && (
                        <button
                            onClick={onReset}
                            className="px-4 py-2 text-sm font-semibold text-indigo-100 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-500/30 hover:to-purple-500/30 rounded-xl transition-all duration-300 border border-indigo-400/30 hover:border-indigo-300/50 backdrop-blur-sm hover:shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5"
                        >
                            Reset Space
                        </button>
                    )}
                </div>
            </header>
            
            <ApiKeyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveApiKey}
                currentApiKey={userApiKey}
            />
        </>
    );
};

export default Header;
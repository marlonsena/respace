
import React from 'react';

const loadingMessages = [
    "Brewing up some magic...",
    "Re-imagining your space...",
    "Styling the pixels...",
    "This might take a moment...",
    "Generating your new reality...",
    "Almost there..."
];

const Loader: React.FC = () => {
    const [message, setMessage] = React.useState(loadingMessages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xl flex flex-col items-center justify-center z-50 transition-opacity duration-300">
            <div className="w-16 h-16 border-4 border-t-indigo-500 border-slate-600 rounded-full animate-spin"></div>
            <p className="mt-6 text-lg font-semibold text-slate-200 tracking-wide">{message}</p>
        </div>
    );
};

export default Loader;
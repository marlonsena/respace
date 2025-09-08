import React from 'react';
import { ViewMode } from '../types';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ControlPanelProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    onStylize: () => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    canShowComparison: boolean;
    isLoading: boolean;
    examplePrompts: string[];
    isGeneratingPrompts: boolean;
    isMinimized: boolean;
    onToggleMinimize: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    prompt,
    setPrompt,
    onStylize,
    viewMode,
    setViewMode,
    canShowComparison,
    isLoading,
    examplePrompts,
    isGeneratingPrompts,
    isMinimized,
    onToggleMinimize,
}) => {
    return (
        <div className="w-full max-w-4xl bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 ease-in-out">
            {/* Header / Toggle Area */}
            <div className="flex items-center justify-between p-2 cursor-pointer" onClick={onToggleMinimize} aria-expanded={!isMinimized} aria-controls="control-panel-content">
                <h3 className="text-sm font-semibold text-slate-300 pl-2">Design Studio</h3>
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label={isMinimized ? 'Expand controls' : 'Collapse controls'}>
                    <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isMinimized ? 'rotate-180' : 'rotate-0'}`} />
                </button>
            </div>

            {/* Collapsible Content */}
            <div
                id="control-panel-content"
                className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${isMinimized ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'}`}
            >
                <div className="p-4 pt-0">
                    <div className="flex flex-col md:flex-row gap-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Imagine something new... e.g., a modern leather sofa by the window"
                            className="flex-grow bg-slate-900/80 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 resize-none"
                            rows={2}
                            disabled={isLoading}
                        />
                        <button
                            onClick={onStylize}
                            disabled={isLoading || !prompt.trim()}
                            className="btn-reimagine flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white text-base font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:from-slate-600 disabled:to-slate-700 disabled:via-slate-600 disabled:cursor-not-allowed disabled:scale-100 disabled:animation-none"
                        >
                            Reimagine
                        </button>
                    </div>
                     <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium mr-2 flex-shrink-0">Inspiration:</span>
                        {isGeneratingPrompts ? (
                            <span className="text-xs text-slate-400 italic">Generating ideas...</span>
                        ) : (
                            <div className="group relative flex-grow overflow-hidden hide-scrollbar">
                                <div className="animate-marquee flex items-center gap-2 whitespace-nowrap">
                                    {examplePrompts.map((p, index) => (
                                        <button
                                            key={`a-${p}-${index}`}
                                            onClick={() => setPrompt(p)}
                                            disabled={isLoading}
                                            className="flex-shrink-0 px-3 py-1.5 text-xs bg-white/5 text-slate-300 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 border border-white/10"
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    {/* Duplicate for seamless loop */}
                                    {examplePrompts.map((p, index) => (
                                        <button
                                            key={`b-${p}-${index}`}
                                            onClick={() => setPrompt(p)}
                                            disabled={isLoading}
                                            className="flex-shrink-0 px-3 py-1.5 text-xs bg-white/5 text-slate-300 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 border border-white/10"
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="border-t border-white/10 p-3 flex justify-center items-center gap-6">
                    {/* Before/After Toggle */}
                    {canShowComparison && (
                        <div className="flex items-center bg-black/20 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode(ViewMode.ORIGINAL)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${viewMode === ViewMode.ORIGINAL ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/10'}`}
                            >
                                Before
                            </button>
                            <button
                                onClick={() => setViewMode(ViewMode.EDITED)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${viewMode === ViewMode.EDITED ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/10'}`}
                            >
                                After
                            </button>
                        </div>
                    )}

                    {/* Download Button */}
                    {canShowComparison && (
                        <div className="relative">
                            <button
                                disabled
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-400 bg-white/5 rounded-md transition-colors duration-200 border border-white/10 cursor-not-allowed"
                                aria-label="Download HD (coming soon)"
                            >
                                <DownloadIcon className="w-4 h-4" />
                                <span>Download HD</span>
                            </button>
                            <span className="absolute -top-2 -right-3 px-2 py-0.5 bg-slate-700 text-white text-[10px] font-bold rounded-full shadow-lg pointer-events-none">
                                Soon
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;
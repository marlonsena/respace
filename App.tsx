
import React, { useState, useCallback } from 'react';
import { ViewMode, AppState, ImageInfo } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Viewer from './components/Viewer';
import ControlPanel from './components/ControlPanel';
import Loader from './components/Loader';
import Timeline from './components/Timeline';
import { editImageWithGemini, generateContextualPrompts } from './services/geminiService';
import { TEMPLATE_IMAGES, STATIC_EXAMPLE_PROMPTS } from './constants';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
    const [history, setHistory] = useState<ImageInfo[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.EDITED);
    const [prompt, setPrompt] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [clarification, setClarification] = useState<string | null>(null);
    const [examplePrompts, setExamplePrompts] = useState<string[]>(STATIC_EXAMPLE_PROMPTS);
    const [isGeneratingPrompts, setIsGeneratingPrompts] = useState<boolean>(false);
    const [isControlPanelMinimized, setIsControlPanelMinimized] = useState(false);

    const resetState = () => {
        setAppState(AppState.INITIAL);
        setHistory([]);
        setCurrentIndex(0);
        setPrompt('');
        setError(null);
        setClarification(null);
        setExamplePrompts(STATIC_EXAMPLE_PROMPTS);
        setIsControlPanelMinimized(false);
    };

    const handleNewImage = (imageInfo: ImageInfo) => {
        setHistory([imageInfo]);
        setCurrentIndex(0);
        setViewMode(ViewMode.EDITED);
        setAppState(AppState.EDITING);
        setError(null);
        setClarification(null);
        
        setIsGeneratingPrompts(true);
        generateContextualPrompts(imageInfo.url, imageInfo.type)
            .then(prompts => {
                if (prompts.length > 0) {
                    setExamplePrompts(prompts);
                }
            })
            .catch(err => {
                console.warn("Could not generate contextual prompts:", err);
                // Keep static prompts as a fallback
                setExamplePrompts(STATIC_EXAMPLE_PROMPTS);
            })
            .finally(() => setIsGeneratingPrompts(false));
    };

    const padImageTo2To1 = (image: HTMLImageElement, fileType: string): string => {
        const canvas = document.createElement('canvas');
        const targetWidth = image.height * 2;
        const targetHeight = image.width / 2;
        
        if (image.width / image.height > 2) {
            // Wider than 2:1, pad top/bottom
            canvas.width = image.width;
            canvas.height = targetHeight;
        } else {
            // Taller than 2:1, pad sides
            canvas.width = targetWidth;
            canvas.height = image.height;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return ''; // Should not happen

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const x = (canvas.width - image.width) / 2;
        const y = (canvas.height - image.height) / 2;
        ctx.drawImage(image, x, y);

        return canvas.toDataURL(fileType);
    };

    const handleImageUpload = (file: File) => {
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);

        image.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const aspectRatio = image.width / image.height;
            
            if (aspectRatio === 2) {
                // If it's already 2:1, proceed as before
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = e.target?.result as string;
                    handleNewImage({ url: base64, type: file.type });
                };
                reader.onerror = () => {
                    setError('Failed to read the image file.');
                    resetState();
                };
                reader.readAsDataURL(file);
            } else {
                // If not 2:1, pad the image
                const paddedBase64 = padImageTo2To1(image, file.type);
                if (paddedBase64) {
                    handleNewImage({ url: paddedBase64, type: file.type });
                } else {
                    setError('Could not process and pad the image.');
                    resetState();
                }
            }
        };

        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            setError('Could not read image file. It may be corrupt or in an unsupported format.');
            resetState();
        };

        image.src = objectUrl;
    };

    const handleUseTemplateImage = async (imageUrl: string) => {
        try {
            setAppState(AppState.LOADING);
            setError(null);
            setClarification(null);
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                handleNewImage({ url: base64, type: blob.type });
            };
            reader.onerror = () => {
                 console.error('Failed to read the sample image file.');
                 setError('Failed to read the sample image file.');
                 resetState();
            };
            reader.readAsDataURL(blob);
        } catch (err) {
            console.error("Failed to load sample image:", err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred while loading the sample image.');
            resetState();
        }
    };

    const handleStylize = useCallback(async () => {
        const currentImage = history[currentIndex];
        if (!currentImage || !prompt.trim()) {
            setError("Please ensure an image is loaded and a prompt is provided.");
            return;
        }

        setAppState(AppState.LOADING);
        setError(null);
        setClarification(null);

        try {
            const result = await editImageWithGemini(currentImage.url, currentImage.type, prompt);
            
            if (result.image) {
                const { base64Image, mimeType } = result.image;
                const newImage: ImageInfo = { url: `data:${mimeType};base64,${base64Image}`, type: mimeType };
                
                // Branch from the current point in history
                const newHistory = [...history.slice(0, currentIndex + 1), newImage];
                setHistory(newHistory);
                setCurrentIndex(newHistory.length - 1);
                setViewMode(ViewMode.EDITED);

            } else if (result.text) {
                setClarification(result.text);
            } else {
                setError("The model did not return an image or a message. It may have refused the request.");
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setAppState(AppState.EDITING);
        }
    }, [history, currentIndex, prompt]);
    
    const handleTimelineSelect = (index: number) => {
        setCurrentIndex(index);
        setViewMode(ViewMode.EDITED); // Default to showing the selected version
    };

    const getCurrentImageUrl = () => {
        if (history.length === 0) return '';
        const comparisonIndex = Math.max(0, currentIndex - 1);
        const activeImageIndex = (viewMode === ViewMode.ORIGINAL && currentIndex > 0) ? comparisonIndex : currentIndex;
        return history[activeImageIndex]?.url ?? '';
    };

    return (
        <div className="min-h-screen text-white flex flex-col antialiased bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
            </div>
            
            <Header onReset={resetState} showReset={appState !== AppState.INITIAL} />
            <main className="flex-grow flex flex-col relative">
                {appState === AppState.LOADING && <Loader />}
                {appState === AppState.INITIAL && (
                     <ImageUploader 
                        onImageUpload={handleImageUpload} 
                        onUseTemplate={handleUseTemplateImage} 
                        templates={TEMPLATE_IMAGES}
                     />
                )}
                {(appState === AppState.EDITING || appState === AppState.LOADING) && history.length > 0 && (
                    <>
                        <div className="flex-grow w-full h-full absolute inset-0">
                           <Viewer imageUrl={getCurrentImageUrl()} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-40 flex flex-col items-center gap-4">
                            <Timeline history={history} currentIndex={currentIndex} onSelect={handleTimelineSelect} />
                            <ControlPanel
                                prompt={prompt}
                                setPrompt={setPrompt}
                                onStylize={handleStylize}
                                viewMode={viewMode}
                                setViewMode={setViewMode}
                                canShowComparison={currentIndex > 0}
                                isLoading={appState === AppState.LOADING}
                                examplePrompts={examplePrompts}
                                isGeneratingPrompts={isGeneratingPrompts}
                                isMinimized={isControlPanelMinimized}
                                onToggleMinimize={() => setIsControlPanelMinimized(prev => !prev)}
                            />
                        </div>
                    </>
                )}
                {clarification && (
                    <div className="absolute bottom-48 left-1/2 -translate-x-1/2 bg-blue-900/70 backdrop-blur-xl border border-blue-500/70 text-white p-4 rounded-lg shadow-xl z-50 w-11/12 max-w-lg">
                        <p className="font-semibold text-blue-100">The model has a question:</p>
                        <p className="mt-1 italic">"{clarification}"</p>
                        <p className="text-xs mt-2 text-blue-200">Try refining your prompt and stylize again.</p>
                        <button onClick={() => setClarification(null)} className="absolute top-1 right-2 text-lg text-blue-100 hover:text-white">&times;</button>
                    </div>
                )}
                 {error && (
                    <div className="absolute bottom-48 left-1/2 -translate-x-1/2 bg-red-900/70 backdrop-blur-xl border border-red-500/70 text-white p-4 rounded-lg shadow-xl z-50">
                        <p><strong>Error:</strong> {error}</p>
                        <button onClick={() => setError(null)} className="absolute top-1 right-2 text-lg">&times;</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
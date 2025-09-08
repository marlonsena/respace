
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import TemplatePreview from './TemplatePreview';
import { CameraIcon } from './icons/CameraIcon';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    onUseTemplate: (url: string) => void;
    templates: { name: string; url: string }[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onUseTemplate, templates }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageUpload(e.target.files[0]);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageUpload(e.dataTransfer.files[0]);
        }
    }, [onImageUpload]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleUploadClick = () => {
        document.getElementById('file-upload')?.click();
    };

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-8 gap-12">
            <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                    Welcome to the Future of Design
                </h2>
                <p className="mt-3 text-lg text-slate-400 max-w-3xl">
                    Re-imagine your space in seconds. Select a template to get started, or upload your own 360° photo below.
                </p>
            </div>
            
            {/* Template Gallery */}
            <div className="w-full max-w-5xl">
                <h3 className="text-2xl font-bold text-slate-100 mb-6 text-center">Test with a template</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {templates.map((template) => (
                        <TemplatePreview
                            key={template.name}
                            template={template}
                            onClick={onUseTemplate}
                        />
                    ))}
                </div>
            </div>

            {/* Secondary Upload/Capture options */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {/* Upload Box */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onClick={handleUploadClick}
                    className={`relative w-full text-center bg-black/30 backdrop-blur-lg border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20 ${isDragging ? 'border-indigo-400 bg-black/40 scale-105' : 'border-white/20'}`}
                >
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleFileChange}
                    />
                    <div className="w-14 h-14 bg-indigo-500/20 text-indigo-300 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <UploadIcon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100">Upload your own 360°</h3>
                    <p className="text-slate-400 mt-1 text-sm">Drag & drop or click to browse</p>
                </div>

                {/* Capture Box - Coming Soon */}
                <div className="relative w-full text-center bg-black/30 backdrop-blur-lg border-2 border-dashed border-white/20 rounded-2xl p-8 cursor-not-allowed opacity-60">
                    <div className="w-14 h-14 bg-slate-700/50 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <CameraIcon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-300">Capture your room</h3>
                    <p className="text-slate-400 mt-1 text-sm">Use your phone to create a 360° image</p>
                    <span className="absolute -top-2 -right-2 px-2.5 py-1 bg-slate-700 text-white text-xs font-bold rounded-full shadow-lg">
                        Soon
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
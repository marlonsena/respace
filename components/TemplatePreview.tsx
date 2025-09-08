import React, { useEffect, useRef } from 'react';
import { Viewer } from 'photo-sphere-viewer';

interface TemplatePreviewProps {
    template: { name: string; url: string };
    onClick: (url: string) => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onClick }) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const viewerInstance = useRef<Viewer | null>(null);

    useEffect(() => {
        if (viewerRef.current) {
            const viewer = new Viewer({
                container: viewerRef.current,
                panorama: template.url,
                loadingImg: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // transparent
                navbar: [],
                mousewheel: false,
                touchmoveTwoFingers: false,
                autorotateDelay: 1000,
                autorotateSpeed: '0.6rpm',
                defaultZoomLvl: 30, // Zoom in slightly to reduce distortion
                fisheye: 1,
                moveInertia: false, // disable drag inertia
            });

            viewerInstance.current = viewer;

            return () => {
                viewer.destroy();
            };
        }
    }, [template.url]);

    const handleMouseEnter = () => {
        viewerInstance.current?.stopAutorotate();
    };

    const handleMouseLeave = () => {
        viewerInstance.current?.startAutorotate();
    };

    return (
        <div
            className="group cursor-pointer aspect-[16/9] relative rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all duration-300 shadow-lg"
            onClick={() => onClick(template.url)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="button"
            aria-label={`Use ${template.name} template`}
        >
            <div ref={viewerRef} className="w-full h-full"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
            <span className="absolute bottom-2 left-3 font-semibold text-sm pointer-events-none">{template.name}</span>
        </div>
    );
};

export default TemplatePreview;

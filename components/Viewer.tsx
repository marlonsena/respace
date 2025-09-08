import React, { useEffect, useRef } from 'react';
import { Viewer } from 'photo-sphere-viewer';

interface ViewerProps {
    imageUrl: string;
}

const ViewerComponent: React.FC<ViewerProps> = ({ imageUrl }) => {
    const viewerContainerRef = useRef<HTMLDivElement>(null);
    const viewerInstanceRef = useRef<Viewer | null>(null);

    // Effect for initializing and destroying the viewer instance.
    // This runs only once when the component mounts.
    useEffect(() => {
        const container = viewerContainerRef.current;
        if (!container) {
            return;
        }

        // Initialize the Photo Sphere Viewer
        const psv = new Viewer({
            container: container,
            panorama: imageUrl,
            navbar: [], // Hide the default navbar
            loadingImg: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Use a transparent pixel for loading
            defaultZoomLvl: 0, // Start a bit zoomed in for a better initial view
            mousewheel: true,
            touchmoveTwoFingers: true,
        });

        viewerInstanceRef.current = psv;

        // Cleanup function to destroy the viewer when the component unmounts
        return () => {
            viewerInstanceRef.current?.destroy();
            viewerInstanceRef.current = null;
        };
    }, []); // Empty dependency array ensures this effect runs only once

    // Effect for updating the panorama when the imageUrl prop changes.
    useEffect(() => {
        if (viewerInstanceRef.current && imageUrl && viewerInstanceRef.current.config.panorama !== imageUrl) {
            viewerInstanceRef.current.setPanorama(imageUrl, {
                transition: 300, // Use a smooth but quick transition
            });
        }
    }, [imageUrl]); // This effect runs whenever the imageUrl changes

    return <div ref={viewerContainerRef} className="w-full h-full" />;
};

export default ViewerComponent;
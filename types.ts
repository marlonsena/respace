// FIX: Removed unused import from 'photo-sphere-viewer' which caused a compilation error.
// The 'ViewerConstructorOptions' type does not exist, and none of the imported types were used.

export enum AppState {
    INITIAL = 'INITIAL',
    LOADING = 'LOADING',
    EDITING = 'EDITING',
}

export enum ViewMode {
    ORIGINAL = 'ORIGINAL',
    EDITED = 'EDITED',
}

export interface ImageInfo {
    url: string;
    type: string;
}

export interface GeminiImage {
    base64Image: string;
    mimeType: string;
}

export interface GeminiEditResponse {
    image: GeminiImage | null;
    text: string | null;
}
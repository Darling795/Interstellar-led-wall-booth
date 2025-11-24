export interface Background {
    id: string;
    name: string;
    type: 'gradient' | 'video';
    style?: string;
    src?: string;
}

export const backgrounds: Background[] = [
    // VIDEO BACKGROUNDS (Replace these URLs with your actual video files)
    {
        id: 'video-1',
        name: 'Video Background 1',
        type: 'video',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
        id: 'video-2',
        name: 'Video Background 2',
        type: 'video',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
        id: 'video-3',
        name: 'Video Background 3',
        type: 'video',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },

    // INTERSTELLAR THEMED GRADIENTS
    {
        id: 'gradient-interstellar',
        name: 'Interstellar Gold',
        type: 'gradient',
        style: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF1493 100%)'
    },
    {
        id: 'gradient-gala',
        name: 'Gala Gradient',
        type: 'gradient',
        style: 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #fbbf24 100%)'
    },
    {
        id: 'gradient-cosmic',
        name: 'Cosmic Purple',
        type: 'gradient',
        style: 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 50%, #ec4899 100%)'
    },
    {
        id: 'gradient-stellar',
        name: 'Stellar Shine',
        type: 'gradient',
        style: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 25%, #ec4899 75%, #9333ea 100%)'
    },
    {
        id: 'gradient-nebula',
        name: 'Nebula Dreams',
        type: 'gradient',
        style: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 33%, #ec4899 66%, #fbbf24 100%)'
    }
];
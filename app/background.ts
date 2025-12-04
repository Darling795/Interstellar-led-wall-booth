export interface Background {
    id: string;
    name: string;
    type: 'image' | 'gradient' | 'video';
    category: string;
    style?: string;
    src?: string;
}

export interface Category {
    id: string;
    name: string;
}

export const categories: Category[] = [
    { id: 'alita', name: 'Alita' },
    { id: 'blade-runner', name: 'Blade Runner' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'doom', name: 'Doom' },
    { id: 'dune', name: 'Dune' },
    { id: 'edge-of-tomorrow', name: 'Edge of Tomorrow' },
    { id: 'ex-machina', name: 'Ex Machina' },
    { id: 'ghost-in-the-shell', name: 'Ghost in the Shell' },
    { id: 'matrix', name: 'Matrix' },
    { id: 'thx-1138', name: 'THX 1138' },
    { id: 'tron', name: 'Tron' },
];

export const backgrounds: Background[] = [
    // ALITA
    { id: 'alita-4', name: 'Poster', type: 'image', category: 'alita', src: '/Led-Wall/alita/poster.webp' },
    { id: 'alita-1', name: 'Alita 1', type: 'image', category: 'alita', src: '/Led-Wall/alita/1.webp' },
    { id: 'alita-2', name: 'Alita 2', type: 'image', category: 'alita', src: '/Led-Wall/alita/2.webp' },
    { id: 'alita-3', name: 'Alita 3', type: 'image', category: 'alita', src: '/Led-Wall/alita/3.webp' },

    // BLADE RUNNER
    { id: 'blade-runner-4', name: 'Poster', type: 'image', category: 'blade-runner', src: '/Led-Wall/blade-runner/poster.webp' },
    { id: 'blade-runner-1', name: 'Blade Runner 1', type: 'image', category: 'blade-runner', src: '/Led-Wall/blade-runner/1.webp' },
    { id: 'blade-runner-2', name: 'Blade Runner 2', type: 'image', category: 'blade-runner', src: '/Led-Wall/blade-runner/2.webp' },

//     // CYBERPUNK
    { id: 'cyberpunk-4', name: 'Poster', type: 'image', category: 'cyberpunk', src: '/Led-Wall/cyberpunk/poster.webp' },
    { id: 'cyberpunk-1', name: 'Cyberpunk 1', type: 'image', category: 'cyberpunk', src: '/Led-Wall/cyberpunk/1.webp' },
    { id: 'cyberpunk-2', name: 'Cyberpunk 2', type: 'image', category: 'cyberpunk', src: '/Led-Wall/cyberpunk/2.webp' },
    { id: 'cyberpunk-3', name: 'Cyberpunk 3', type: 'image', category: 'cyberpunk', src: '/Led-Wall/cyberpunk/3.webp' },

//     // DOOM
    { id: 'doom-4', name: 'Poster', type: 'image', category: 'doom', src: '/Led-Wall/doom/poster.webp' },
    { id: 'doom-1', name: 'Doom 1', type: 'image', category: 'doom', src: '/Led-Wall/doom/1.webp' },
    { id: 'doom-2', name: 'Doom 2', type: 'image', category: 'doom', src: '/Led-Wall/doom/2.webp' },
    { id: 'doom-3', name: 'Doom 3', type: 'image', category: 'doom', src: '/Led-Wall/doom/3.webp' },

//     // DUNE
    { id: 'dune-4', name: 'Poster', type: 'image', category: 'dune', src: '/Led-Wall/dune/poster.webp' },
    { id: 'dune-1', name: 'Dune 1', type: 'image', category: 'dune', src: '/Led-Wall/dune/1.webp' },
    { id: 'dune-2', name: 'Dune 2', type: 'image', category: 'dune', src: '/Led-Wall/dune/2.webp' },
    { id: 'dune-3', name: 'Dune 3', type: 'image', category: 'dune', src: '/Led-Wall/dune/3.webp' },

//     // EDGE OF TOMORROW
    { id: 'edge-of-tomorrow-4', name: 'Poster', type: 'image', category: 'edge-of-tomorrow', src: '/Led-Wall/edge-of-tomorrow/poster.webp' },
    { id: 'edge-of-tomorrow-1', name: 'Edge of Tomorrow 1', type: 'image', category: 'edge-of-tomorrow', src: '/Led-Wall/edge-of-tomorrow/1.webp' },
    { id: 'edge-of-tomorrow-2', name: 'Edge of Tomorrow 2', type: 'image', category: 'edge-of-tomorrow', src: '/Led-Wall/edge-of-tomorrow/2.webp' },
    { id: 'edge-of-tomorrow-3', name: 'Edge of Tomorrow 3', type: 'image', category: 'edge-of-tomorrow', src: '/Led-Wall/edge-of-tomorrow/3.webp' },

//     // EX MACHINA
    { id: 'ex-machina-1', name: 'Poster', type: 'image', category: 'ex-machina', src: '/Led-Wall/ex-machina/poster.webp' },
    { id: 'ex-machina-2', name: 'Ex Machina 1', type: 'image', category: 'ex-machina', src: '/Led-Wall/ex-machina/1.webp' },


//     // GHOST IN THE SHELL
    { id: 'ghost-in-the-shell-1', name: 'Poster', type: 'image', category: 'ghost-in-the-shell', src: '/Led-Wall/ghost-in-the-shell/poster.webp' },
    { id: 'ghost-in-the-shell-2', name: 'Ghost in the Shell 1', type: 'image', category: 'ghost-in-the-shell', src: '/Led-Wall/ghost-in-the-shell/1.webp' },

    
//     // MATRIX
    { id: 'matrix-4', name: 'Poster', type: 'image', category: 'matrix', src: '/Led-Wall/matrix/poster.webp' },
    { id: 'matrix-1', name: 'Matrix 1', type: 'image', category: 'matrix', src: '/Led-Wall/matrix/1.webp' },

//     // THX 1138
    { id: 'thx-1138-4', name: 'Poster', type: 'image', category: 'thx-1138', src: '/Led-Wall/thx 1138/poster.webp' },
    { id: 'thx-1138-1', name: 'THX 1138 1', type: 'image', category: 'thx-1138', src: '/Led-Wall/thx 1138/1.webp' },
    { id: 'thx-1138-2', name: 'THX 1138 2', type: 'image', category: 'thx-1138', src: '/Led-Wall/thx 1138/2.webp' },
    { id: 'thx-1138-3', name: 'THX 1138 3', type: 'image', category: 'thx-1138', src: '/Led-Wall/thx 1138/3.webp' },

//     // TRON
    { id: 'tron-4', name: 'Poster', type: 'image', category: 'tron', src: '/Led-Wall/tron/poster.webp' },
    { id: 'tron-1', name: 'Tron 1', type: 'image', category: 'tron', src: '/Led-Wall/tron/1.webp' },
    { id: 'tron-2', name: 'Tron 2', type: 'image', category: 'tron', src: '/Led-Wall/tron/2.webp' },
    { id: 'tron-3', name: 'Tron 3', type: 'image', category: 'tron', src: '/Led-Wall/tron/3.webp' },
];

// Helper to get backgrounds by category
export const getBackgroundsByCategory = (categoryId: string): Background[] => {
    return backgrounds.filter(bg => bg.category === categoryId);
};

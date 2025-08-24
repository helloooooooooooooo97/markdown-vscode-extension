interface defaultFrontmatterType {
    prev: string[];
    next: string[];
    tags: string[];
    image: string;
    headerBackground?: {
        type: 'color' | 'dag' | 'graph' | 'image';
        value: string;
        opacity?: number;
    };
}

export const getDefaultFrontmatterData = (): defaultFrontmatterType => {
    return {
        prev: [],
        next: [],
        tags: [],
        image: "",
        headerBackground: {
            type: 'image',
            value: '/images/space1.jpg',
            opacity: 1
        }
    };
};
interface defaultFrontmatterType {
    prev: string[];
    next: string[];
    tags: string[];
}

export const getDefaultFrontmatterData = (): defaultFrontmatterType => {
    return {
        prev: [],
        next: [],
        tags: [],
    };
};
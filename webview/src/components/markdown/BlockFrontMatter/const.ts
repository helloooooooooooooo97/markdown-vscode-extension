interface defaultFrontmatterType {
    prev: string[];
    next: string[];
    tags: string[];
    image: string;
}

export const getDefaultFrontmatterData = (): defaultFrontmatterType => {
    return {
        prev: [],
        next: [],
        tags: [],
        image: "",
    };
};
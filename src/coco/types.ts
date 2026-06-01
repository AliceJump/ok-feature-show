export interface CocoCategory {
    id: number;
    name: string;
}

export interface CocoImage {
    id: number;
    file_name: string;
    width?: number;
    height?: number;
}

export interface CocoAnnotation {
    id: number;
    image_id: number;
    category_id: number;
    bbox?: [number, number, number, number] | number[];
}

export interface FeatureMeta {
    featureName: string;
    annotation?: CocoAnnotation;
    image?: CocoImage;
}

export interface CocoIndex {
    categories: CocoCategory[];
    featureMap: Map<string, FeatureMeta>;
}

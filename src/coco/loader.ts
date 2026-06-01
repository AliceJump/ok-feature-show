import * as fs from 'fs';
import * as path from 'path';

import { CocoAnnotation, CocoCategory, CocoImage, CocoIndex, FeatureMeta } from './types';

interface CocoDataset {
    categories?: CocoCategory[];
    annotations?: CocoAnnotation[];
    images?: CocoImage[];
}

export function loadCocoIndex(rootPath: string): CocoIndex {
    const cocoPath = path.join(rootPath, 'assets', 'coco_annotations.json');

    if (!fs.existsSync(cocoPath)) {
        return { categories: [], featureMap: new Map() };
    }

    let dataset: CocoDataset;
    try {
        dataset = JSON.parse(fs.readFileSync(cocoPath, 'utf-8')) as CocoDataset;
    } catch {
        return { categories: [], featureMap: new Map() };
    }

    const categories = dataset.categories ?? [];
    const annotations = dataset.annotations ?? [];
    const images = dataset.images ?? [];

    const imageById = new Map<number, CocoImage>();
    images.forEach((image) => imageById.set(image.id, image));

    const firstAnnotationByCategory = new Map<number, CocoAnnotation>();
    for (const ann of annotations) {
        if (!firstAnnotationByCategory.has(ann.category_id)) {
            firstAnnotationByCategory.set(ann.category_id, ann);
        }
    }

    const featureMap = new Map<string, FeatureMeta>();

    for (const category of categories) {
        const annotation = firstAnnotationByCategory.get(category.id);
        const image = annotation ? imageById.get(annotation.image_id) : undefined;

        featureMap.set(category.name, {
            featureName: category.name,
            annotation,
            image
        });
    }

    return {
        categories,
        featureMap
    };
}

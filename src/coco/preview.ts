import * as fs from 'fs';
import * as path from 'path';

import sharp = require('sharp');

import { FeatureMeta } from './types';

function sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9_-]/g, '_');
}

export async function ensureFeaturePreview(
    rootPath: string,
    feature: FeatureMeta
): Promise<string | undefined> {
    if (!feature.image?.file_name || !feature.annotation?.bbox?.length) {
        return undefined;
    }

    const sourcePath = path.join(rootPath, 'assets', 'images', feature.image.file_name);
    if (!fs.existsSync(sourcePath)) {
        return undefined;
    }

    const previewDir = path.join(rootPath, '.cache', 'previews');
    fs.mkdirSync(previewDir, { recursive: true });

    const outputPath = path.join(previewDir, `${sanitizeFilename(feature.featureName)}.png`);
    const [x, y, w, h] = feature.annotation.bbox.map((value) => Math.max(0, Math.floor(value)));

    if (!w || !h) {
        return undefined;
    }

    try {
        await sharp(sourcePath)
            .extract({ left: x, top: y, width: w, height: h })
            .toFile(outputPath);
        return outputPath;
    } catch {
        return undefined;
    }
}

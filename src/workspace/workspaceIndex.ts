import { loadCocoIndex } from '../coco/loader';
import { FeatureMeta } from '../coco/types';
import { resolveEnumInfo, EnumInfo } from './enumResolver';
import { getWorkspaceContext } from './configScanner';

export interface WorkspaceIndex {
    rootPath: string;
    enumInfo?: EnumInfo;
    features: string[];
    featureMap: Map<string, FeatureMeta>;
}

export function buildWorkspaceIndex(): WorkspaceIndex | undefined {
    const workspace = getWorkspaceContext();

    if (!workspace) {
        return undefined;
    }

    const cocoIndex = loadCocoIndex(workspace.rootPath);
    const enumInfo = resolveEnumInfo(workspace);

    const features = enumInfo
        ? enumInfo.entries.map((entry) => entry.featureName)
        : cocoIndex.categories.map((category) => category.name);

    return {
        rootPath: workspace.rootPath,
        enumInfo,
        features,
        featureMap: cocoIndex.featureMap
    };
}

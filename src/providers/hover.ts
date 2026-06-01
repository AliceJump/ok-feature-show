import * as vscode from 'vscode';

import { ensureFeaturePreview } from '../coco/preview';
import { buildWorkspaceIndex } from '../workspace/workspaceIndex';

export class FeatureHoverProvider implements vscode.HoverProvider {
    async provideHover(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover | undefined> {
        const index = buildWorkspaceIndex();
        if (!index) {
            return undefined;
        }

        const range = document.getWordRangeAtPosition(position, /[A-Za-z_][A-Za-z0-9_]*/);
        if (!range) {
            return undefined;
        }

        const token = document.getText(range);
        const featureName = this.resolveFeatureName(token, index);

        if (!featureName) {
            return undefined;
        }

        const feature = index.featureMap.get(featureName);
        const markdown = new vscode.MarkdownString();
        markdown.isTrusted = true;

        markdown.appendMarkdown(`**Feature Preview**\n\n`);
        markdown.appendMarkdown(`- Name: \`${featureName}\`\n`);

        if (feature?.image?.file_name) {
            markdown.appendMarkdown(`- Image: \`${feature.image.file_name}\`\n`);
        }

        if (feature?.annotation?.bbox?.length) {
            markdown.appendMarkdown(`- BBox: \`${feature.annotation.bbox.join(', ')}\`\n`);
        }

        if (feature?.annotation?.id !== undefined) {
            markdown.appendMarkdown(`- Annotation ID: \`${feature.annotation.id}\`\n`);
        }

        if (feature) {
            const previewPath = await ensureFeaturePreview(index.rootPath, feature);
            if (previewPath) {
                markdown.appendMarkdown(`\n![preview](${vscode.Uri.file(previewPath).toString()})`);
            }
        }

        return new vscode.Hover(markdown, range);
    }

    private resolveFeatureName(token: string, index: ReturnType<typeof buildWorkspaceIndex>): string | undefined {
        if (!index) {
            return undefined;
        }

        if (index.featureMap.has(token)) {
            return token;
        }

        if (index.enumInfo) {
            const match = index.enumInfo.entries.find((entry) => entry.enumKey === token);
            return match?.featureName;
        }

        return undefined;
    }
}

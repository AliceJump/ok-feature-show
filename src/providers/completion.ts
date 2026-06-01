import * as vscode from 'vscode';

import { ensureFeaturePreview } from '../coco/preview';
import { isEnumMemberCompletion, inferQuotedStringContext, isFeatureArgumentContext } from '../context/parser';
import { buildWorkspaceIndex } from '../workspace/workspaceIndex';

export const ADD_ENUM_IMPORT_COMMAND = 'ok-feature-show.addEnumImport';

export class FeatureCompletionProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.CompletionItem[] | undefined> {
        const index = buildWorkspaceIndex();
        if (!index || index.features.length === 0) {
            return [];
        }

        const offset = document.offsetAt(position);
        const before = document.getText().slice(0, offset);

        if (!isFeatureArgumentContext(before)) {
            return [];
        }

        if (index.enumInfo) {
            if (isEnumMemberCompletion(before, index.enumInfo.className)) {
                return Promise.all(index.enumInfo.entries.map(async (entry) => {
                    const item = new vscode.CompletionItem(entry.enumKey, vscode.CompletionItemKind.EnumMember);
                    item.insertText = entry.enumKey;
                    item.detail = `Feature: ${entry.featureName}`;
                    item.documentation = await this.buildDocumentation(index.rootPath, entry.featureName);
                    return item;
                }));
            }

            const enumClassItem = new vscode.CompletionItem(index.enumInfo.className, vscode.CompletionItemKind.Enum);
            enumClassItem.insertText = index.enumInfo.className;
            enumClassItem.detail = 'Feature Enum';
            enumClassItem.documentation = `Auto import: \`${index.enumInfo.importStatement}\``;
            enumClassItem.command = {
                command: ADD_ENUM_IMPORT_COMMAND,
                title: 'Add enum import',
                arguments: [document.uri, index.enumInfo.importStatement]
            };

            return [enumClassItem];
        }

        const linePrefix = document.lineAt(position.line).text.slice(0, position.character);
        const inQuotedString = inferQuotedStringContext(linePrefix);

        return Promise.all(index.features.map(async (feature) => {
            const item = new vscode.CompletionItem(feature, vscode.CompletionItemKind.Value);
            item.insertText = inQuotedString ? feature : `"${feature}"`;
            item.detail = 'COCO Feature';
            item.documentation = await this.buildDocumentation(index.rootPath, feature);
            return item;
        }));
    }

    private async buildDocumentation(rootPath: string, featureName: string): Promise<vscode.MarkdownString> {
        const markdown = new vscode.MarkdownString();
        markdown.isTrusted = true;

        const index = buildWorkspaceIndex();
        const feature = index?.featureMap.get(featureName);

        markdown.appendMarkdown(`**Feature:** \`${featureName}\`\n\n`);

        if (!feature) {
            markdown.appendMarkdown('_No COCO annotation matched._');
            return markdown;
        }

        if (feature.image?.file_name) {
            markdown.appendMarkdown(`- Image: \`${feature.image.file_name}\`\n`);
        }

        if (feature.annotation?.bbox?.length) {
            markdown.appendMarkdown(`- BBox: \`${feature.annotation.bbox.join(', ')}\`\n`);
        }

        if (feature.annotation?.id !== undefined) {
            markdown.appendMarkdown(`- Annotation ID: \`${feature.annotation.id}\`\n`);
        }

        const previewPath = await ensureFeaturePreview(rootPath, feature);
        if (previewPath) {
            markdown.appendMarkdown(`\n![preview](${vscode.Uri.file(previewPath).toString()})`);
        }

        return markdown;
    }
}

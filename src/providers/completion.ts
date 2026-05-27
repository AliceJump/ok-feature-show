import * as vscode from 'vscode';

import { loadCategories } from '../coco/loader';
import { isFeatureContext } from '../context/parser';

export class FeatureCompletionProvider
    implements vscode.CompletionItemProvider {

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.CompletionItem[] | undefined> {

        console.log("completion triggered");
        
        const fullText = document.getText();
        const offset = document.offsetAt(position);
        const before = fullText.substring(0, offset);

        // ❌ 在字符串里直接不触发
        if (this.isInString(before)) {
            return [];
        }

        // ❌ 只允许 feature context
        if (!isFeatureContext(before)) {
            return [];
        }
        
        const categories = await loadCategories();

        return categories.map(category => {

            const item = new vscode.CompletionItem(
                category.name,
                vscode.CompletionItemKind.Value
            );

            // =========================
            // ✅ 关键：自动加双引号
            // =========================
            item.insertText = new vscode.SnippetString(`"${category.name}"`);

            item.detail = "COCO Feature";

            return item;
        });
    }

    // =========================
    // 字符串检测（稳定版）
    // =========================
    private isInString(text: string): boolean {

        let inDouble = false;
        let inSingle = false;
        let escape = false;

        for (const c of text) {

            if (escape) {
                escape = false;
                continue;
            }

            if (c === '\\') {
                escape = true;
                continue;
            }

            if (c === '"' && !inSingle) {
                inDouble = !inDouble;
            } else if (c === "'" && !inDouble) {
                inSingle = !inSingle;
            }
        }

        return inDouble || inSingle;
    }
}
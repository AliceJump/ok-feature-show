import * as vscode from 'vscode';

import { FeatureCompletionProvider, ADD_ENUM_IMPORT_COMMAND } from './providers/completion';
import { FeatureHoverProvider } from './providers/hover';

export function activate(context: vscode.ExtensionContext) {
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'python' },
        new FeatureCompletionProvider(),
        '=', ',', '[', '(', '.', '"', "'"
    );

    const hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: 'file', language: 'python' },
        new FeatureHoverProvider()
    );

    const addImportCommand = vscode.commands.registerCommand(
        ADD_ENUM_IMPORT_COMMAND,
        async (uri: vscode.Uri, importStatement: string) => {
            const document = await vscode.workspace.openTextDocument(uri);
            const editor = vscode.window.visibleTextEditors.find((item) => item.document.uri.toString() === uri.toString())
                ?? await vscode.window.showTextDocument(document);

            const fullText = document.getText();
            if (fullText.includes(importStatement)) {
                return;
            }

            const lines = fullText.split(/\r?\n/);
            let insertLine = 0;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (!line || line.startsWith('#')) {
                    insertLine = i + 1;
                    continue;
                }

                if (line.startsWith('import ') || line.startsWith('from ')) {
                    insertLine = i + 1;
                    continue;
                }

                break;
            }

            await editor.edit((editBuilder) => {
                editBuilder.insert(new vscode.Position(insertLine, 0), `${importStatement}\n`);
            });
        }
    );

    context.subscriptions.push(completionProvider, hoverProvider, addImportCommand);
}

export function deactivate() {}

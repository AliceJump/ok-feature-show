import * as vscode from 'vscode';

import {
    FeatureCompletionProvider
} from './providers/completion';

export function activate(
    context: vscode.ExtensionContext
) {

    vscode.window.showInformationMessage(
        'ok-feature-show activated'
    );
    
    const provider =
        vscode.languages.registerCompletionItemProvider(
            { scheme: 'file', language: 'python' },
            new FeatureCompletionProvider(),
            '=', ',', '[', '('
        );

            context.subscriptions.push(
                provider
            );
        }

        export function deactivate() {}
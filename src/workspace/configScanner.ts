import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export interface TemplateTabConfig {
    generate_label_enum?: boolean;
    label_enum_relative_path?: string;
    next_image_index?: number;
}

export interface WorkspaceContext {
    rootPath: string;
    config?: TemplateTabConfig;
}

export function getWorkspaceContext(): WorkspaceContext | undefined {
    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    if (!rootPath) {
        return undefined;
    }

    return {
        rootPath,
        config: readTemplateTabConfig(rootPath)
    };
}

function readTemplateTabConfig(rootPath: string): TemplateTabConfig | undefined {
    const configPath = path.join(rootPath, 'configs', 'template_tab.json');

    if (!fs.existsSync(configPath)) {
        return undefined;
    }

    try {
        const raw = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(raw) as TemplateTabConfig;
    } catch {
        return undefined;
    }
}

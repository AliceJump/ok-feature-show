import * as fs from 'fs';
import * as path from 'path';

import { WorkspaceContext } from './configScanner';

export interface EnumEntry {
    enumKey: string;
    featureName: string;
}

export interface EnumInfo {
    className: string;
    importModule: string;
    importStatement: string;
    entries: EnumEntry[];
}

export function resolveEnumInfo(workspace: WorkspaceContext): EnumInfo | undefined {
    const config = workspace.config;

    if (!config?.generate_label_enum || !config.label_enum_relative_path) {
        return undefined;
    }

    const relativePath = config.label_enum_relative_path;
    const enumFile = relativePath.endsWith('.py') ? relativePath : `${relativePath}.py`;
    const enumPath = path.join(workspace.rootPath, enumFile);

    if (!fs.existsSync(enumPath)) {
        return undefined;
    }

    const content = fs.readFileSync(enumPath, 'utf-8');
    const classMatch = content.match(/class\s+([A-Za-z_]\w*)\s*\(\s*Enum\s*\)\s*:/);

    if (!classMatch) {
        return undefined;
    }

    const className = classMatch[1];
    const entries = parseEnumEntries(content, className);

    if (entries.length === 0) {
        return undefined;
    }

    const importModule = toModulePath(relativePath);

    return {
        className,
        importModule,
        importStatement: `from ${importModule} import ${className}`,
        entries
    };
}

function parseEnumEntries(content: string, className: string): EnumEntry[] {
    const lines = content.split(/\r?\n/);
    const classHeader = new RegExp(`^\\s*class\\s+${className}\\s*\\(\\s*Enum\\s*\\)\\s*:`);
    const entries: EnumEntry[] = [];

    let inClass = false;
    let classIndent = 0;

    for (const line of lines) {
        if (!inClass) {
            if (classHeader.test(line)) {
                inClass = true;
                classIndent = line.match(/^\s*/)![0].length;
            }
            continue;
        }

        if (line.trim().length === 0) {
            continue;
        }

        const indent = line.match(/^\s*/)![0].length;
        if (indent <= classIndent) {
            break;
        }

        const entryMatch = line.match(/^\s*([A-Za-z_]\w*)\s*=\s*(.+)$/);
        if (!entryMatch) {
            continue;
        }

        const enumKey = entryMatch[1];
        const rhs = entryMatch[2].trim();
        const stringValue = rhs.match(/^['"]([^'"]+)['"]/);

        entries.push({
            enumKey,
            featureName: stringValue?.[1] ?? enumKey
        });
    }

    return entries;
}

function toModulePath(relativePath: string): string {
    return relativePath
        .replace(/\\/g, '/')
        .replace(/\.py$/, '')
        .replace(/^\/+|\/+$/g, '')
        .split('/')
        .filter(Boolean)
        .join('.');
}

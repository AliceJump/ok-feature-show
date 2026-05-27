import * as fs from 'fs';

import * as path from 'path';

import * as vscode from 'vscode';

export interface CocoCategory {

    id: number;

    name: string;
}

export async function loadCategories()
: Promise<CocoCategory[]> {

    const workspace =
        vscode.workspace.workspaceFolders?.[0];

    if (!workspace) {

        return [];
    }

    const cocoPath =
        path.join(

            workspace.uri.fsPath,

            'assets',

            'coco_annotations.json'
        );

    if (!fs.existsSync(cocoPath)) {

        return [];
    }

    const text =
        fs.readFileSync(
            cocoPath,
            'utf-8'
        );

    const json =
        JSON.parse(text);

    return json.categories || [];
}
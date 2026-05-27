# ==========================================
# VSCode Python Coco Feature Preview
# Scaffold Generator (PowerShell)
# ==========================================

Write-Host ""
Write-Host "Generating project scaffold..."
Write-Host ""

# ------------------------------------------
# Root Files
# ------------------------------------------

New-Item README.md -ItemType File -Force
New-Item LICENSE -ItemType File -Force
New-Item tsconfig.json -ItemType File -Force
New-Item package.json -ItemType File -Force
New-Item esbuild.js -ItemType File -Force
New-Item .gitignore -ItemType File -Force

# ------------------------------------------
# Source Structure
# ------------------------------------------

New-Item src -ItemType Directory -Force

New-Item src/extension.ts -ItemType File -Force

# ------------------------------------------
# Providers
# ------------------------------------------

New-Item src/providers -ItemType Directory -Force

New-Item src/providers/completion.ts -ItemType File -Force
New-Item src/providers/hover.ts -ItemType File -Force
New-Item src/providers/definition.ts -ItemType File -Force
New-Item src/providers/diagnostics.ts -ItemType File -Force

# ------------------------------------------
# Workspace
# ------------------------------------------

New-Item src/workspace -ItemType Directory -Force

New-Item src/workspace/configScanner.ts -ItemType File -Force
New-Item src/workspace/enumResolver.ts -ItemType File -Force
New-Item src/workspace/functionResolver.ts -ItemType File -Force
New-Item src/workspace/workspaceIndex.ts -ItemType File -Force

# ------------------------------------------
# Coco
# ------------------------------------------

New-Item src/coco -ItemType Directory -Force

New-Item src/coco/loader.ts -ItemType File -Force
New-Item src/coco/index.ts -ItemType File -Force
New-Item src/coco/preview.ts -ItemType File -Force
New-Item src/coco/cache.ts -ItemType File -Force
New-Item src/coco/types.ts -ItemType File -Force

# ------------------------------------------
# Parser
# ------------------------------------------

New-Item src/parser -ItemType Directory -Force

New-Item src/parser/functionParser.ts -ItemType File -Force
New-Item src/parser/pythonParser.ts -ItemType File -Force
New-Item src/parser/contextParser.ts -ItemType File -Force

# ------------------------------------------
# Utils
# ------------------------------------------

New-Item src/utils -ItemType Directory -Force

New-Item src/utils/path.ts -ItemType File -Force
New-Item src/utils/markdown.ts -ItemType File -Force
New-Item src/utils/image.ts -ItemType File -Force
New-Item src/utils/logger.ts -ItemType File -Force

# ------------------------------------------
# Types
# ------------------------------------------

New-Item src/types -ItemType Directory -Force

New-Item src/types/coco.ts -ItemType File -Force
New-Item src/types/workspace.ts -ItemType File -Force
New-Item src/types/feature.ts -ItemType File -Force

# ------------------------------------------
# Cache
# ------------------------------------------

New-Item .cache -ItemType Directory -Force
New-Item .cache/previews -ItemType Directory -Force

# ------------------------------------------
# Media
# ------------------------------------------

New-Item media -ItemType Directory -Force
New-Item media/icons -ItemType Directory -Force

New-Item media/icons/icon.png -ItemType File -Force

# ------------------------------------------
# Scripts
# ------------------------------------------

New-Item scripts -ItemType Directory -Force

New-Item scripts/dev.ps1 -ItemType File -Force
New-Item scripts/build.ps1 -ItemType File -Force
New-Item scripts/watch.ps1 -ItemType File -Force

# ------------------------------------------
# VSCode
# ------------------------------------------

New-Item .vscode -ItemType Directory -Force

New-Item .vscode/launch.json -ItemType File -Force
New-Item .vscode/tasks.json -ItemType File -Force
New-Item .vscode/extensions.json -ItemType File -Force

# ------------------------------------------
# Done
# ------------------------------------------

Write-Host ""
Write-Host "Project scaffold generated successfully."
Write-Host ""
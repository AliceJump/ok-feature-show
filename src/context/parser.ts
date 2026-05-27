export function isFeatureContext(before: string): boolean {

    // 1. 必须在函数调用里
    const inFunction =
        /find_(one|feature)\s*\([^)]*$/.test(before);

    if (!inFunction) return false;

    // 2. 必须有 feature 参数（允许到逗号）
    const hasFeature =
        /feature(_name)?\s*=/.test(before);

    if (!hasFeature) return false;

    // 3. 关键：判断 list 是否打开
    const lastFeatureIdx =
        Math.max(
            before.lastIndexOf('feature_name=['),
            before.lastIndexOf('feature=[')
        );

    if (lastFeatureIdx !== -1) {

        const after = before.substring(lastFeatureIdx);

        const open = (after.match(/\[/g) || []).length;
        const close = (after.match(/\]/g) || []).length;

        // 在 list 内
        if (open > close) {
            return true;
        }
    }

    // fallback：单值模式
    return true;
}
export function isFeatureArgumentContext(before: string): boolean {
    const featureAssignment = /feature(_name)?\s*=/.test(before);
    if (!featureAssignment) {
        return false;
    }

    const assignmentStart = Math.max(before.lastIndexOf('feature_name='), before.lastIndexOf('feature='));
    const scope = assignmentStart >= 0 ? before.slice(assignmentStart) : before;

    const openParens = (scope.match(/\(/g) || []).length;
    const closeParens = (scope.match(/\)/g) || []).length;

    if (closeParens > openParens) {
        return false;
    }

    return true;
}

export function isEnumMemberCompletion(before: string, enumClassName: string): boolean {
    const escaped = enumClassName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${escaped}\\.[A-Za-z_0-9]*$`);
    return regex.test(before);
}

export function inferQuotedStringContext(linePrefix: string): boolean {
    const unescapedDoubleQuotes = linePrefix.match(/(?<!\\)"/g)?.length ?? 0;
    const unescapedSingleQuotes = linePrefix.match(/(?<!\\)'/g)?.length ?? 0;

    return unescapedDoubleQuotes % 2 === 1 || unescapedSingleQuotes % 2 === 1;
}

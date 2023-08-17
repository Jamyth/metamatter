function extractPathParams(path: string): string[] {
    const regex = /\/:([^/]*)/g;
    const matches = Array.from(path.matchAll(regex));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- regex result
    return matches.map((_) => _.at(1)!);
}

export const PathUtil = Object.freeze({
    extractPathParams,
});

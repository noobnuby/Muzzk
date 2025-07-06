export const createEnum = <V extends string>(...items: V[]) => {
    const enumObj = {} as { [K in V]: K };
    for (const item of items) {
        enumObj[item] = item;
    }

    return enumObj;
};
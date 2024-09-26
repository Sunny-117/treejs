type DataTuple = readonly [value: string | number, key: string, label: string];
/**
 * 配置的数据格式
 * 按照 [value, key, label] 来配置
 * 例如
 * ``` typescript
    export const datasource = [
        [1, 'A', '文案A'],
        [2, 'B', '文案B'],
        [3, 'C', '文案C'],
    ] as const;
 * ```
 */
export type DataTupleDataSource = readonly DataTuple[];

type DataTupleIndex = 0 | 1 | 2;

export type ExtractFromTuple<T extends DataTuple, KeyIndex extends DataTupleIndex, ValueIndex extends DataTupleIndex>
    = {
    [K in T[KeyIndex]]: Extract<
        T,
        KeyIndex extends 0
            ? (readonly [K, any, any])
            : (
                KeyIndex extends 1
                    ? (readonly [any, K, any])
                    : (readonly [any, any, K])
            )
    >[ValueIndex];
};


type ValueMapByKey<T extends DataTuple> = ExtractFromTuple<T, 1, 0>;
type KeyMapByValue<T extends DataTuple> = ExtractFromTuple<T, 0, 1>;
type NameMapByValue<T extends DataTuple> = ExtractFromTuple<T, 0, 2>;
type NameMapByKey<T extends DataTuple> = ExtractFromTuple<T, 1, 2>;


type DataSource<T extends DataTupleDataSource> = {
    [K in keyof T]: {
        label: T[K][2];
        value: T[K][0];
        key: T[K][1];
    };
};


interface ResultBase<T extends DataTupleDataSource> {
    valueMapByKey: ValueMapByKey<T[number]>;
    keyMapByValue: KeyMapByValue<T[number]>;
    nameMapByValue: NameMapByValue<T[number]>;
    nameMapByKey: NameMapByKey<T[number]>;
}


type Result<T extends DataTupleDataSource> = {
    readonly [K in keyof ResultBase<T>]: Readonly<ResultBase<T>[K]>;
};


/**
 * 从配置获取Map
 * @param dataSource 数据源
 * @returns 数据映射对象
 */
export function getConfigFromDataSource<T extends DataTupleDataSource>(dataSource: T): Readonly<
    Result<T> & { dataSource: DataSource<T> }
> {
    const initialResult = {
        valueMapByKey: {},
        keyMapByValue: {},
        nameMapByValue: {},
        nameMapByKey: {},
        dataSource: [] as DataSource<T>,
    } as unknown as (ResultBase<T> & { dataSource: DataSource<T> });

    const ds: any[] = [];

    const result = dataSource.reduce((r, [value, key, name]) => {
        type Key = keyof typeof r.valueMapByKey;
        type Value = keyof typeof r.keyMapByValue;
        if (r.valueMapByKey[key as Key] !== undefined) {
            throw new Error(`Duplicate key "${key}" found in dataSource.`);
        }
        if (r.keyMapByValue[value as Value] !== undefined) {
            throw new Error(`Duplicate value "${value}" found in dataSource.`);
        }
        r.valueMapByKey[key as Key] = value;
        r.keyMapByValue[value as Value] = key;
        r.nameMapByValue[value as Value] = name;
        r.nameMapByKey[key as Key] = name;
        ds.push({
            label: name,
            value,
            key,
        });
        return r;
    }, initialResult);

    result.dataSource = ds as DataSource<T>;
    return result;
}

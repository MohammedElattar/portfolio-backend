import pLimit from 'p-limit'

type AsyncCallback<T, R> = (item: T, index: number) => Promise<R>

export async function safePromiseAll<T, R = T>(
    items: T[],
    callback?: AsyncCallback<T, R>,
    concurrency = 10
): Promise<R[]> {
    const limit = pLimit(concurrency)

    const tasks = items.map((item, index) =>
        limit(() => (callback ? callback(item, index) : Promise.resolve(item as unknown as R)))
    )

    return Promise.all(tasks)
}

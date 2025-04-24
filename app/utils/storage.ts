import { stat } from 'fs/promises'

export async function getFileSize(path: string) {
    return await stat(path).then((s) => s.size)
}

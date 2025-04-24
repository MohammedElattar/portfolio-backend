import env from '#start/env'
import RequestHelper from './request_helper.js'
import app from '@adonisjs/core/services/app'

export const asset = (path: string = '') => {
    let APP_URL = env.get('APP_URL', 'http://localhost:3333')

    if (path === '') {
        return preparePath(APP_URL)
    }

    return `${preparePath(APP_URL)}/${preparePath(path)}`
}

function basePath(prefix: string, path: string = '') {
    return app.makePath(`${prefix}${path ? `/${path}` : ''}`)
}
export function storagePath(path: string = '') {
    return basePath('storage', path)
}

export function publicPath(path: string = '') {
    return basePath('public', path)
}

export function appPath(path: string = '') {
    return basePath('app', path)
}

export function modulesPath(path: string = '') {
    return basePath('modules', path)
}

export const isUpdate = (pattern: RegExp) => {
    const url = RequestHelper.get().url()

    return !pattern.test(url)
}

export const preparePath = (path: string) => {
    return replaceEnvSlashes(trimSlashes(path))
}

const replaceEnvSlashes = (str: string) => {
    return str.replace(/\/$/, '')
}

const trimSlashes = (str: string) => {
    return str.replace(/^\/+|\/+$/g, '')
}

export function safeSpread<T extends unknown>(value: T | undefined): object {
    return (typeof value === 'object' ? value : {}) as object
}

export function isNumeric(value: any): boolean {
    return !isNaN(value) && !isNaN(parseFloat(value))
}

export function isset<T>(value: T | null | undefined): value is T {
    return value !== undefined && value !== null
}

export function isObjectEmpty(object: Record<string, any>) {
    return Object.keys(object).length === 0
}

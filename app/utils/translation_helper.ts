import type { LoaderFactory, TranslationsLoaderContract } from '@adonisjs/i18n/types'
import { promises as fs } from 'fs'
import path from 'path'
import ContextHelper from './context_helper.js'
import { MESSAGES_FILE } from './translator.js'

/**
 * Loader implementation
 */
export class FileLoader implements TranslationsLoaderContract {
    async load() {
        const result: any = {}
        const modulesDir = path.resolve(process.cwd(), 'modules')

        try {
            const langDirs = await this.findLangDirectories(modulesDir)

            for (const langDir of langDirs) {
                const langFolders = await fs.readdir(langDir, { withFileTypes: true })

                for (const folder of langFolders) {
                    if (folder.isDirectory()) {
                        const langCode = folder.name
                        const langPath = path.join(langDir, langCode)
                        const files = await fs.readdir(langPath)

                        if (!result[langCode]) {
                            result[langCode] = {}
                        }

                        for (const file of files) {
                            let extension = '.js'

                            if (file.endsWith('.ts')) {
                                extension = '.ts'
                            }

                            if (file.endsWith(extension)) {
                                const filePath = path.join(langPath, file)
                                const moduleExports = await import(filePath)
                                const translations = moduleExports.default || moduleExports
                                const prefixedTranslations: Record<string, string> = {}

                                for (const [key, value] of Object.entries(translations)) {
                                    prefixedTranslations[`${MESSAGES_FILE}.${key}`] =
                                        value as string
                                }

                                Object.assign(result[langCode], prefixedTranslations)
                            }
                        }
                    }
                }
            }

            return result
        } catch (error) {
            return result
        }
    }

    private async findLangDirectories(dir: string): Promise<string[]> {
        const langDirs: string[] = []
        const entries = await fs.readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            if (entry.isDirectory()) {
                if (entry.name === 'lang') {
                    langDirs.push(fullPath)
                } else {
                    const subDirs = await this.findLangDirectories(fullPath)
                    langDirs.push(...subDirs)
                }
            }
        }

        return langDirs
    }
}

/**
 * Factory function to reference the loader
 * inside the config file.
 */
export function translationLoader(): LoaderFactory {
    return () => {
        return new FileLoader()
    }
}

export class TranslationHelper {
    public static getCurrentLocale() {
        return ContextHelper.get().i18n.locale || 'en'
    }
}

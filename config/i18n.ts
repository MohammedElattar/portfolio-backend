import app from '@adonisjs/core/services/app'
import { defineConfig, formatters, loaders } from '@adonisjs/i18n'
import { translationLoader } from '../app/utils/translation_helper.js'

const i18nConfig = defineConfig({
    defaultLocale: 'en',
    formatter: formatters.icu(),
    fallback: (identifier) => {
        return identifier
    },
    loaders: [
        loaders.fs({
            location: app.languageFilesPath(),
        }),
        translationLoader(),
    ],
    supportedLocales: ['en', 'ar'],
})

export default i18nConfig

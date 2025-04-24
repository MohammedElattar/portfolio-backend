import i18nManager from '@adonisjs/i18n/services/main'
import { TranslationHelper } from './translation_helper.js'

export const MESSAGES_FILE = 'messages'
export const translateSuccessMessage = (firstKey: string, secondKey: string) => {
    const t = trans()
    return `${t(`${MESSAGES_FILE}.${firstKey}`)} ${t(`${MESSAGES_FILE}.${secondKey}`)}`
}

export const translateErrorMessage = (messagesKey: string, validationKey: string) => {
    const t = trans()
    return `${t(`${MESSAGES_FILE}.${messagesKey}`)} ${t(`validation.${validationKey}`)}`
}

export const translateWord = (key: string, data?: Record<string, any>) => {
    const t = trans()
    return t(`${MESSAGES_FILE}.${key}`, data)
}

const trans = () => {
    const translator = i18nManager.locale(TranslationHelper.getCurrentLocale())

    return translator.t.bind(translator)
}

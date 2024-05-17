/**
 * Contains constants namespaces
 * DomElements - Contains DOM elements
 * ApiRoutes - Contains API routes
*/


/**
 * Contains DOM elements
 * @namespace
 * @property {HTMLFormElement} translationForm - The translation form
 * @property {HTMLParagraphElement} translatedText - The translated text
 * @property {HTMLDivElement} resultMessagesWrapper - The result messages wrapper
 */
export const DomElements = {
    translationForm: document.getElementById('translation-form'),
    translatedText: document.getElementById('translated-text'),
    resultMessagesWrapper: document.getElementById('result-messages-wrapper'),
    reverseLanguagesButton: document.getElementById('reverse-languages-button'),
    statusIcon: document.getElementById('status-icon'),
    sourceLanguageSelect: document.getElementById('source-language'),
    targetLanguageSelect: document.getElementById('target-language'),
}


/**
 * Contains API routes
 * @namespace
 * @property {string} translate - The route for the translation API
 * @property {string} detectLanguage - The route for the detect language API
 */
export const ApiRoutes = {
    translate: '/translate',
    detectLanguage: '/detect-language',
}

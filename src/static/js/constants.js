/**
 * Contains constants namespaces
*/


/**
 * Contains DOM elements
 * @namespace
 * @property {HTMLFormElement} translationForm - The translation form
 * @property {HTMLParagraphElement} translatedText - The translated text
 * @property {HTMLDivElement} resultMessagesWrapper - The result messages wrapper
 */
const DOMElements = {
    translationForm: document.getElementById('translation-form'),
    translatedText: document.getElementById('translated-text'),
    resultMessagesWrapper: document.getElementById('result-messages-wrapper'),
}


/**
 * Contains API routes
 * @namespace
 * @property {string} translate - The route for the translation API
 * @property {string} detectLanguage - The route for the detect language API
 */
const APIRoutes = {
    translate: '/translate',
    detectLanguage: '/detect-language',
}


export default {DOMElements, APIRoutes}
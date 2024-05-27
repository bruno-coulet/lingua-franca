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
 * @property {HTMLTextAreaElement} textToTranslate - The text to translate
 * @property {HTMLDivElement} resultMessagesWrapper - The result messages wrapper
 * @property {HTMLButtonElement} reverseLanguagesButton - The reverse languages button
 * @property {HTMLImageElement} statusIcon - The status icon
 * @property {HTMLSelectElement} sourceLanguageSelect - The source language select
 * @property {HTMLSelectElement} targetLanguageSelect - The target language select
 * @property {HTMLFormElement} fileUploadForm - The file upload form
 * @property {HTMLDivElement} downloadWrapper - The download wrapper
 * @property {HTMLSpanElement} filename - The filename
 */
export const DomElements = {
    translationForm: document.getElementById('translation-form'),
    translatedText: document.getElementById('translated-text'),
    textToTranslate: document.getElementById('text-to-translate'),
    resultMessagesWrapper: document.getElementById('result-messages-wrapper'),
    reverseLanguagesButton: document.getElementById('reverse-languages-button'),
    statusIcon: document.getElementById('status-icon'),
    sourceLanguageSelect: document.getElementById('source-language'),
    targetLanguageSelect: document.getElementById('target-language'),

    fileUploadForm: document.getElementById('file-upload-form'),
    downloadWrapper: document.getElementById('download-wrapper'),
    filename: document.getElementById('filename'),
}


/**
 * Contains API routes
 * @namespace
 * @property {string} translate - The route for the translation API
 * @property {string} detectLanguage - The route for the detect language API
 * @property {string} uploadFile - The route for the file upload API
 */
export const ApiRoutes = {
    translate: '/api/translate',
    detectLanguage: '/api/detect-language',

    uploadFile: '/api/file-upload',
}

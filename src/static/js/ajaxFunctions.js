// Contains AJAX functions namespace
import { ApiRoutes } from './constants.js';

/**
 * Ajax functions
 * @namespace
 * @property {function} detectLanguage - Detect the language of the text
 * @property {function} translate - Translate the text
 */
export const AjaxFunctions = {
    /**
     * Send a request to the detect language API
     * @param {FormData} formData - The FormData object
     * @returns {Promise<FormData>} - The updated FormData object with the detected language if accessible
     * @throws {Error} - If the language could not be detected
     */
    detectLanguage: async function (formData) {
        if (formData.get("source_language") === "auto") {
            const response = await fetch(ApiRoutes.detectLanguage, {
                method: 'POST',
                body: formData
            })
            const data = await response.json();
            if (data.status === 'success') {
                formData.set("source_language", data.language);
                return formData;
            } else {
                throw new Error(JSON.stringify(data.errors));
            };
        } else {
            return formData;
        };
    },
    
    /**
     * Send a request to the translate API
     * @param {FormData} formData - The formData object
     * @returns {Promise<Object>} - A JSON object with the status and the translated text
     * @throws {Error} - If the translation failed
     */
    translate: async function (formData) {
        const response = await fetch(ApiRoutes.translate, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.status === 'success') {
            return data;
        } else {
            throw new Error(JSON.stringify(data.errors));
        };
    }
};

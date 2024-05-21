// Contains utility functions namespaces

import { DomElements } from "./constants.js";

/**
 * Form utils
 * @namespace
 * @property {function} updateFormFields - Update the form fields from a FormData object
 * @property {function} displayErrors - Display errors in the form
 */
export const FormUtils = {
    /**
     * Update the form fields from a FormData object
     * @param {HTMLFormElement} form - The HTML form to update
     * @param {FormData} formData - The FormData object containing the form data
     */
    updateFormFields: function(form, formData) {
        formData.forEach((value, key) => {
            const field = form.elements[key];
            if (field) {
                field.value = value;
            };
        });
    },

    /**
     * Display errors in the form
     * @param {Object} errors - An object containing the errors
     * @param {HTMLElement} defaultParentElement - The default parent element to append the error message if errorField is not found
     * @param {string} errorMessageClass - The class name of the error message (default is "error-message")
     */
    displayErrors: function(errors, parentElement, errorMessageClass="error-message") {
        parentElement.innerHTML = "";
        for (const fieldName in errors) {
            const errorMessage = document.createElement("p");
            errorMessage.classList.add(errorMessageClass);
            errorMessage.textContent = errors[fieldName];
            errorMessage.style.display = "block";
            parentElement.appendChild(errorMessage);
        };
        ImgUtils.displayIcon(DomElements.statusIcon, "/static/images/status/error.png");
    }
};

/**
 * Image utils
 * @namespace
 * @property {function} displayIcon - Display an icon
 */
export const ImgUtils = {
    /**
     * Display an icon
     * @param {HTMLImageElement} element - The image element 
     * @param {string} src - The source of the image
     */
    displayIcon: (element, src) => {
        element.src = src;
        element.style.display = "block";
    }
}
// Contains utility functions namespaces

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
     * @param {string} errorFieldSuffix - The suffix of the error field (default is "-error")
     */
    displayErrors: function(errors, defaultParentElement, errorMessageClass="error-message", errorFieldSuffix="-error") {
        const errorFields = document.querySelectorAll(`.${errorMessageClass}`);

        errorFields.forEach(field => field.textContent = '');
        for (const fieldName in errors) {
            const errorField = document.getElementById(`${fieldName}${errorFieldSuffix}`);
            if (errorField) {
                errorField.textContent = errors[fieldName];
            }
            else {
                const errorMessage = document.createElement("p");
                errorMessage.classList.add(errorMessageClass);
                errorMessage.textContent = errors[fieldName];
                defaultParentElement.appendChild(errorMessage);
            };
        };
    }
};

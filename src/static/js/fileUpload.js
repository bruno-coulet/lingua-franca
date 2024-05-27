import { changeFlag } from './common/flags.js';
import { DomElements } from './common/constants.js';
import { AjaxFunctions } from './common/ajaxFunctions.js';
import { ImgUtils, FormUtils } from './common/utils.js';

/**
 * Handle form submission
 */
function submitFileUploadForm() {
    // Reset messages
    DomElements.downloadWrapper.style.display = "none";
    DomElements.filename.textContent = "";
    DomElements.resultMessagesWrapper.innerHTML = "";
    ImgUtils.displayIcon(DomElements.statusIcon, '/static/images/status/loading.png');

    if (!DomElements.fileUploadForm.checkValidity()) {
        // Iterate on invalid fields
        const errors = {};
        DomElements.fileUploadForm.querySelectorAll(':invalid').forEach(field => {
            // Display error message for each field
            const label = field.labels[0];
            const message = `${label.textContent} : ${field.validationMessage}`;
            errors[field.id] = message
        });

        FormUtils.displayErrors(errors, DomElements.resultMessagesWrapper);
            
        return;
    }

    const formData = new FormData(DomElements.fileUploadForm);
    AjaxFunctions.uploadFile(formData)
    .then(data => {
        ImgUtils.displayIcon(DomElements.statusIcon, '/static/images/status/success.png');
        const message = document.createElement('p')
        message.classList.add('success-message');
        message.textContent = data.message;
        DomElements.resultMessagesWrapper.appendChild(message);

        DomElements.downloadWrapper.style.display = "block"
        DomElements.filename.textContent = data.filename;

    }).catch(error => {
        ImgUtils.displayIcon(DomElements.statusIcon, '/static/images/status/error.png');
        DomElements.resultMessagesWrapper.innerHTML = "";
        DomElements.downloadWrapper.style.display = "none"
    })
}

/**
 * Initialize
 */
function init() {
    // Events listeners
    DomElements.fileUploadForm.addEventListener('submit', (event) => {
        event.preventDefault();
        submitFileUploadForm();
    });
    DomElements.targetLanguageSelect.addEventListener('change', (event) => {
        changeFlag(event.target);
    })
    // Put the default target language in the target language selector with navigator language
    DomElements.targetLanguageSelect.value = navigator.language || navigator.userLanguage || 'en';
    DomElements.targetLanguageSelect.dispatchEvent(new Event('change'));
}

document.addEventListener('DOMContentLoaded', init)
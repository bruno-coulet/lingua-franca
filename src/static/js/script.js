import { DomElements } from './constants.js';
import { AjaxFunctions } from './ajaxFunctions.js';
import { FormUtils } from './utils.js';


function submitTranslationForm(formData) {
    // Reset messages
    DomElements.translatedText.textContent = '';
    DomElements.resultMessagesWrapper.innerHTML = '';

    // Detect languages
    AjaxFunctions.detectLanguage(formData)
    .then(detectedformData => {
        FormUtils.updateFormFields(DomElements.translationForm, detectedformData);
        AjaxFunctions.translate(detectedformData)
        .then(data => {
            const successMessage = document.createElement("p");
            successMessage.classList.add("success-message");
            successMessage.textContent = "Successful translation !";
            DomElements.resultMessagesWrapper.appendChild(successMessage);
            DomElements.translatedText.textContent = data.translated_text;
        })
        .catch(error => {
            const errors = JSON.parse(error.message);
            FormUtils.displayErrors(errors, DomElements.resultMessagesWrapper);
        })
    }).catch(error => {
        const errors = JSON.parse(error.message);
        FormUtils.displayErrors(errors, DomElements.resultMessagesWrapper);
    })
}

function addFormSubmitListener() {
    DomElements.translationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        submitTranslationForm(formData);
    })
}

document.addEventListener('DOMContentLoaded', () => {
    addFormSubmitListener();
})

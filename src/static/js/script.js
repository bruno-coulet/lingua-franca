import { DomElements } from './constants.js';
import { AjaxFunctions } from './ajaxFunctions.js';
import { FormUtils } from './utils.js';


function submitTranslationForm() {
    if (!DomElements.translationForm.checkValidity()) {
        return;
    }
    // Reset messages
    DomElements.translatedText.textContent = '';
    DomElements.resultMessagesWrapper.innerHTML = '';
    DomElements.loadingSpinner.textContent = '🔄'; // TODO : Add loading spinner
    document.querySelectorAll(".error-message").forEach(el => el.style.display = "none");

    // Detect languages
    const formData = new FormData(DomElements.translationForm);
    AjaxFunctions.detectLanguage(formData)
    .then(detectedformData => {
        FormUtils.updateFormFields(DomElements.translationForm, detectedformData);
        // Translate
        AjaxFunctions.translate(detectedformData)
        .then(data => {
            DomElements.translatedText.value = data.translated_text;
            DomElements.loadingSpinner.textContent = '✅';
        })
        .catch(error => {
            DomElements.loadingSpinner.textContent = '❎';
            const errors = JSON.parse(error.message);
            FormUtils.displayErrors(errors, DomElements.resultMessagesWrapper);
        })
    }).catch(error => {
        
        DomElements.loadingSpinner.textContent = '❎';
        console.log(error)
        const errors = JSON.parse(error.message);
        console.log(errors)
        FormUtils.displayErrors(errors, DomElements.resultMessagesWrapper);
    })
}



document.addEventListener('DOMContentLoaded', () => {
    DomElements.translationForm.addEventListener('submit', (event) => {
        event.preventDefault();
            submitTranslationForm();
    })
})
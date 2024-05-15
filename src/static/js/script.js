import { DomElements } from './constants.js';
import { AjaxFunctions } from './ajaxFunctions.js';
import { FormUtils } from './utils.js';


function submitTranslationForm() {
    
    // Reset messages
    DomElements.translatedText.value = '';
    DomElements.resultMessagesWrapper.innerHTML = '';
    DomElements.loadingSpinner.textContent = '🔄';

    if (!DomElements.translationForm.checkValidity()) {
        return;
    }
    // Detect languages
    const formData = new FormData(DomElements.translationForm);
    AjaxFunctions.detectLanguage(formData)
    .then(detectedformData => {
        FormUtils.updateFormFields(DomElements.translationForm, detectedformData);
        // Translate
        AjaxFunctions.translate(detectedformData)
        .then(data => {
            DomElements.loadingSpinner.textContent = '✅';
            DomElements.translatedText.value = data.translated_text;
        })
        .catch(error => {
            const errors = JSON.parse(error.message);
            FormUtils.displayErrors(errors, DomElements.resultMessagesWrapper);
            DomElements.loadingSpinner.textContent = '❎';
        })
    }).catch(error => {
        const errors = JSON.parse(error.message);
        FormUtils.displayErrors(errors, DomElements.resultMessagesWrapper);
        DomElements.loadingSpinner.textContent = '❎';
    })
}

function addFormChangeListeners() {
    DomElements.translationForm.addEventListener('change', (event) => {
        submitTranslationForm();
    })

    const textAreas = DomElements.translationForm.querySelectorAll('textarea');
    let deboundDelay;

    textAreas.forEach(textArea => {
        textArea.addEventListener('input', (event) => {
            clearTimeout(deboundDelay); // Clear the previous delay
            deboundDelay = setTimeout(() => {
                submitTranslationForm();
            }, 500);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    DomElements.translationForm.addEventListener('submit', (event) => {
        event.preventDefault();
            submitTranslationForm();
    })

    addFormChangeListeners();
})
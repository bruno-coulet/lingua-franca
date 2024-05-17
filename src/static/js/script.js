import { DomElements } from './constants.js';
import { AjaxFunctions } from './ajaxFunctions.js';
import { FormUtils } from './utils.js';
import { languageToCountryMap } from './mapCountries.js';


function submitTranslationForm() {
    
    // Reset messages
    DomElements.translatedText.value = '';
    DomElements.resultMessagesWrapper.innerHTML = '';
    DomElements.loadingSpinner.textContent = '🔄';

    const form = DomElements.translationForm
    if (!form.checkValidity()) {

        // Iterate on invalid fields
        const errors = {};
        form.querySelectorAll(':invalid').forEach(field => {

            // Display error message for each field
            const label = field.labels[0];
            const message = `${label.textContent} : ${field.validationMessage}`;
            errors[field.id] = message
        });

        FormUtils.displayErrors(errors, DomElements.resultMessagesWrapper);
            
        return;
    }
    // Detect languages
    const formData = new FormData(form);
    AjaxFunctions.detectLanguage(formData)
    .then(detectedformData => {
        DomElements.sourceLanguageSelect.dispatchEvent(new Event('change'));
        FormUtils.updateFormFields(form, detectedformData);
        // Translate
        AjaxFunctions.translate(detectedformData)
        .then(data => {
            DomElements.loadingSpinner.textContent = '✅';
            DomElements.translatedText.value = data.translated_text;
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


function reverseLanguages() {    
    const form = DomElements.translationForm;
    const sourceLanguageSelect = form.querySelector("#source-language");
    const targetLanguageSelect = form.querySelector("#target-language");
    
    const sourceLanguage = sourceLanguageSelect.value;
    const targetLanguage = targetLanguageSelect.value;
    
    // Check for errors
    const errors = {};
    if (sourceLanguage === targetLanguage) {
        errors["same-languages"] = "Source and target language must be different";
    }
    if (sourceLanguage === "auto") {
        errors["auto-detection"] = "Source language must be different from auto detection";
    }
    if (Object.keys(errors).length > 0) {
        FormUtils.displayErrors(errors, DomElements.resultMessagesWrapper);
        return;
    }

    if (targetLanguage === "") {
        const autoOption = sourceLanguageSelect.querySelector('option[value="auto"]');
        if (autoOption) {
            autoOption.selected = true;
        }

    } else {
        sourceLanguageSelect.value = targetLanguage;
    }
    
    // Reverse languages
    targetLanguageSelect.value = sourceLanguage;
    const textTranslated = form.querySelector("#translated-text")
    const textToTranslate = form.querySelector("#text-to-translate")
    textToTranslate.value = textTranslated.value;
    textTranslated.value = ""

    // Dispatch events
    sourceLanguageSelect.dispatchEvent(new Event('change'));
    targetLanguageSelect.dispatchEvent(new Event('change'));

    // Submit form
    submitTranslationForm();
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

function changeFlag(select) {
    const img = document.getElementById(`${select.id}-flag-icon`)
    img.src = `https://flagsapi.com/${languageToCountryMap[select.value]}/shiny/32.png`
}

function init() {
    // Events listeners
    DomElements.translationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        submitTranslationForm();
    });
    addFormChangeListeners();
    DomElements.reverseLanguagesButton.addEventListener('click', reverseLanguages);

    DomElements.sourceLanguageSelect.addEventListener('change', (event) => {
        changeFlag(event.target);
    })
    DomElements.targetLanguageSelect.addEventListener('change', (event) => {
        changeFlag(event.target);
    })
    // Put the default target language in the target language selector with navigator language
    DomElements.targetLanguageSelect.value = navigator.language || navigator.userLanguage || 'en';
    DomElements.targetLanguageSelect.dispatchEvent(new Event('change'));
}

document.addEventListener('DOMContentLoaded', init)
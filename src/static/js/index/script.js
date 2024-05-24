import { DomElements } from './constants.js';
import { AjaxFunctions } from '../ajaxFunctions.js';
import { FormUtils, ImgUtils } from './utils.js';
import { changeFlag } from '../flags.js';

/**
 * Handle form submission
 */
function submitTranslationForm() {
    if (DomElements.textToTranslate.value === "") {
        DomElements.statusIcon.style.display = "none";
        DomElements.translatedText.value = "";
        DomElements.resultMessagesWrapper.innerHTML = "";
        DomElements.translatedText.placeholder = "Translated text";
        return;
    }
    // Reset messages
    DomElements.resultMessagesWrapper.innerHTML = '';
    DomElements.translatedText.placeholder = '🔄...';
    DomElements.translatedText.value = '';
    ImgUtils.displayIcon(DomElements.statusIcon, '/static/images/status/loading.png');
   
    if (!DomElements.translationForm.checkValidity()) {
        // Iterate on invalid fields
        const errors = {};
        DomElements.translationForm.querySelectorAll(':invalid').forEach(field => {
            // Display error message for each field
            const label = field.labels[0];
            const message = `${label.textContent} : ${field.validationMessage}`;
            errors[field.id] = message
        });

        FormUtils.displayErrors(errors, DomElements.resultMessagesWrapper);
            
        return;
    }
    // Detect languages
    const formData = new FormData(DomElements.translationForm);
    AjaxFunctions.detectLanguage(formData)
    .then(detectedformData => {
        if (detectedformData.get("text_to_translate") !== "") {
            FormUtils.updateFormFields(DomElements.translationForm  , detectedformData);
            DomElements.sourceLanguageSelect.dispatchEvent(new Event('change'));
            // Translate
            AjaxFunctions.translate(detectedformData)
            .then(data => {
                ImgUtils.displayIcon(DomElements.statusIcon, '/static/images/status/success.png');
                DomElements.translatedText.value = data.translated_text;
                enableDisableReverseLanguages();
            
            })
            .catch(error => {
                DomElements.translatedText.placeholder = "Translated text";
                const errors = JSON.parse(error.message);
                enableDisableReverseLanguages();
                FormUtils.displayErrors(errors, DomElements.resultMessagesWrapper);
            })
        }
    }).catch(error => {
        DomElements.translatedText.placeholder = "Translated text";
        const errors = JSON.parse(error.message);
        enableDisableReverseLanguages();
        FormUtils.displayErrors(errors, DomElements.resultMessagesWrapper);
    })
}

/**
 * Reverse languages
 */
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

/**
 * Enable/disable reverse languages button
 */
function enableDisableReverseLanguages() {
        if (DomElements.sourceLanguageSelect.value === "auto" || DomElements.targetLanguageSelect.value === DomElements.sourceLanguageSelect.value) {
        DomElements.reverseLanguagesButton.disabled = true;
    } else {
        DomElements.reverseLanguagesButton.disabled = false;
    }
    window.requestAnimationFrame(() => {});
}

/**
 * Add form change listeners
 */
function addFormChangeListeners() {
    
    let deboundDelay;
    DomElements.translationForm.addEventListener('change', (event) => {
        clearTimeout(deboundDelay);
        deboundDelay = setTimeout(() => {
            enableDisableReverseLanguages();
            submitTranslationForm();
        }, 500);
    })

    DomElements.textToTranslate.addEventListener('input', (event) => {
        clearTimeout(deboundDelay);
        deboundDelay = setTimeout(() => {
            enableDisableReverseLanguages();
            submitTranslationForm();
        }, 1000);
    });
    
}


/**
 * Initialize
 */
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
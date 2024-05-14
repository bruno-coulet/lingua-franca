# lingua-franca
Translator Flask app using Google Translate API

## Table of content
- [lingua-franca](#lingua-franca)
  - [Table of content](#table-of-content)
  - [Getting started](#getting-started)
  - [Files](#files)

## Getting started
- Open git bash
- Clone the repository : `git clone https://github.com/christian-aucane/lingua-franca.git`
- Move in the repo : `cd lingua-franca`
- Run install.sh : `source install.sh`

## Files
- **install.sh** : Bash script to install project
    - Create virtual environment
    - Install dependencies
- **src/** : Contain sources
    - **templates/** : Contain HTML templates
        - **index.html** : The interface
    - **forms.py** : Contain TranlsationForm class
    - **translation.py** : Contain functions to connect to the translation API
    - **app.py** : Contain the Flask app, and routes
        - `index()` : Display the interface
        - `detect()` : Detect the language
        - `translate()` : Translate the text
    - **static/** : Contain static files dirs
        - **js/** : Contain JavaScript modules
            - **constants.js** : Contains constants namespaces
                - `DomElements` : Namespace for usefull HTML Dom elements
                - `ApiRoutes` : Namespace for API routes
            - **utils.js** : Contains utility functions namespaces
                - `FormUtils` : Namespace for utility forms functions
                    - `updateFormFields(form, formData)` : Update the form with the FormData object
                    - `displayErrors(errors, defaultParentElement, errorMessageClass="error-message", errorFieldSuffix="-error")` : Display the errors in the fields
            - **ajaxFunctions.js** : Contain AJAX functions namespace
                - `AjaxFunctions` : Namespace for AJAX calls
                    - `detectLanguage(formData)` : Send a POST request to detect-language/ API route
                    - `translate(formData)` : Send a POST request to translate/ API route
            - **script.js** : Main JS script
                - `submitTranslationForm(formData)` : Submit the form to the backend and modify display with the response
                - `addFormSubmitListener()` : Add an event listener on the form submit event to call `submitTranslationForm()`

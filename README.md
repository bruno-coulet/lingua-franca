# lingua-franca
Translator Flask app using Google Translate API

## Table of content
- [lingua-franca](#lingua-franca)
  - [Table of content](#table-of-content)
  - [Getting started](#getting-started)
  - [Project files](#project-files)

## Getting started
- Open git bash
- Clone the repository : `git clone https://github.com/christian-aucane/lingua-franca.git`
- Move in the repo : `cd lingua-franca`
- Run install.sh : `source install.sh`

## Project files
- **README.md** : Project details (this file)
- **.gitignore** : Files ignored by Git
- **requirements.txt** : Project dependencies
- **install.sh** : Bash script to install project
    - Create virtual environment
    - Install dependencies
- **src/** : Source files
    - **templates/** : Contain HTML templates
        - **index.html** : The interface
    - **forms.py** : Contain TranlsationForm class
    - **translation.py** : Contain functions to connect to the translation API
    - **app.py** : Contain the Flask app, and routes
        - `index()` : Display the interface
        - `detect()` : Detect the language
        - `translate()` : Translate the text
    - **static/** : Static files dirs
        - **js/** : JavaScript modules
            - **constants.js** : Constants namespaces
                - `DomElements` : Namespace for usefull HTML Dom elements
                - `ApiRoutes` : Namespace for API routes
            - **utils.js** : Utility functions namespaces
                - `FormUtils` : Namespace for utility forms functions
                    - `updateFormFields(form, formData)` : Update the form with the FormData object
                    - `displayErrors(errors, defaultParentElement, errorMessageClass="error-message")` : Display the errors in the fields
            - **ajaxFunctions.js** : AJAX functions namespace
                - `AjaxFunctions` : Namespace for AJAX calls
                    - `detectLanguage(formData)` : Send a POST request to detect-language/ API route
                    - `translate(formData)` : Send a POST request to translate/ API route
            - **script.js** : Main JS script
                - `submitTranslationForm(formData)` : Submit the form to the backend and modify display with the response
                - `addFormSubmitListener()` : Add an event listener on the form submit event to call `submitTranslationForm()`
        - **css/** : CSS files
            - **normalize.css** : To normalize styles
            - **variables.css** : Variables (Colors ...)
            - **style.css** : Project style
  
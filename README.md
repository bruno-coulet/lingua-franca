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
- `install.sh` : Bash script to install project
    - Create virtual environment
    - Install dependencies
- src/ : Contain sources
    - templates/ : Contain HTML templates
        - `index.html` : The interface
    - `forms.py` : Contain TranlsationForm class
    - `translation.py` : Contain functions to connect to the translation API
    - `app.py` : Contain the Flask app, and routes
        - '/' index() to display the interface
        - 'translate/' translate() to retrieve ajax requests for form submission and return the translated text
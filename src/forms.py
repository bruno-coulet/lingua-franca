import os

from flask_wtf import FlaskForm
from wtforms import BooleanField, FileField, SelectField, TextAreaField
from wtforms.validators import DataRequired

from translation import list_languages

AVAILABLE_LANGUAGES = list_languages()
ALLOWED_FILE_EXTENSIONS = ['.txt', '.docx']

class TranslationForm(FlaskForm):
    """
    Form for translating text

    Fields:
        source_language - SelectField - Source language
        target_language - SelectField - Target language
        text_to_translate - TextAreaField - Text to translate
        text_translated - TextAreaField - Text translated
    """
    source_language = SelectField("Source language",
                                  id="source-language",
                                  choices=[],
                                  default="auto",
                                  validators=[DataRequired("Please select a source language")])
    target_language = SelectField("Target language",
                                  id="target-language",
                                  choices=[],
                                  default="",
                                  validators=[DataRequired("Please select a target language")])
    text_to_translate = TextAreaField("Text to translate",
                                      id="text-to-translate",
                                      render_kw={"placeholder": "Enter text to translate ...",
                                                 "cols": 50, "rows": 15},
                                      validators=[DataRequired("Type something to translate")])
    text_translated = TextAreaField("Text translated",
                                    id="translated-text",
                                    render_kw={"placeholder": "Translated text", 
                                               "readonly": True,
                                               "cols": 50, "rows": 15})

    def __init__(self, *args, **kwargs):
        """
        Init the form and set the choices for the source and target languages
        """
        super().__init__(*args, **kwargs)
        self.source_language.choices = [("auto", "Automatic Detection")] + AVAILABLE_LANGUAGES
        self.target_language.choices = AVAILABLE_LANGUAGES


def verify_file_extension(form, field):
    """
    Custom validator to verify that the uploaded file is a .txt or .docx file
    """
    file_ext = os.path.splitext(field.data.filename)[1].lower()  # Get file extension
    if file_ext not in ALLOWED_FILE_EXTENSIONS:
        raise ValueError("Please upload a .txt or .docx file")


class FileUploadForm(FlaskForm):
    """
    Form for uploading a file

    Fields:
        file - FileField - File to translate
        target_language - SelectField - Target language
    """
    file = FileField("File to translate (.txt or .docx)",
                     id="file-to-translate",
                     render_kw={"accept": ".txt,.docx",},
                     validators=[DataRequired("Please select a file to translate"),
                                 verify_file_extension],
                     description="Only .txt files are supported")
    target_language = SelectField("Target language",
                                  id="target-language",
                                  choices=[],
                                  default="",
                                  validators=[DataRequired("Please select a target language")])
    gdpr_consent = BooleanField("I agree to my translated document being stored by the platform", validators=[DataRequired()])

    def __init__(self, *args, **kwargs):
        """
        Init the form and set the choices for the target language
        """
        super().__init__(*args, **kwargs)
        self.target_language.choices = [("", "Select a target language")] + AVAILABLE_LANGUAGES
        
import os

from flask_wtf import FlaskForm
from wtforms import FileField, SelectField, TextAreaField
from wtforms.validators import DataRequired

from translation import list_languages

AVAILABLE_LANGUAGES = list_languages()
ALLOWED_FILE_EXTENSIONS = ['txt']

class TranslationForm(FlaskForm):
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
        super().__init__(*args, **kwargs)
        self.source_language.choices = [("auto", "Automatic Detection")] + AVAILABLE_LANGUAGES
        self.target_language.choices = AVAILABLE_LANGUAGES


def verify_file_extension(form, field):
    file_ext = os.path.splitext(field.data)[1].lower()  # Get file extension
    if file_ext not in ALLOWED_FILE_EXTENSIONS:
        raise ValueError("Please upload a .txt file")

class FileUploadForm(FlaskForm):
    file = FileField("File to translate",
                     id="file-to-translate",
                     render_kw={"accept": ".txt"},
                     validators=[DataRequired("Please select a file to translate"),
                                 verify_file_extension])
    target_language = SelectField("Target language",
                                  id="target-language",
                                  choices=[],
                                  default="",
                                  validators=[DataRequired("Please select a target language")])

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.target_language.choices = [("", "Select a target language")] + AVAILABLE_LANGUAGES
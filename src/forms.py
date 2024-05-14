from flask_wtf import FlaskForm
from wtforms import SelectField, TextAreaField
from wtforms.validators import DataRequired

from translation import list_languages


class TranslationForm(FlaskForm):
    source_language = SelectField("Source language",
                                  choices=[],
                                  default="auto",
                                  render_kw={"id": "source_language"},
                                  validators=[DataRequired("Please select a source language")])
    target_language = SelectField("Target language",
                                  choices=[],
                                  default="",
                                  render_kw={"id": "target_language"},
                                  validators=[DataRequired("Please select a target language")])
    text_to_translate = TextAreaField("Text to translate",
                                      render_kw={"id": "text_to_translate",
                                                 "placeholder": "Enter text to translate ..."},
                                      validators=[DataRequired("Please enter text to translate")])
    text_translated = TextAreaField("Translated text", render_kw={"id": "translated-text",
                                                                  "placeholder": "Translated text", 
                                                                  "readonly": True})

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        available_languages = list_languages()
        self.source_language.choices = [("auto", "Automatic Detection")] + available_languages
        self.target_language.choices = [("", "Select a target language")] + available_languages

from flask_wtf import FlaskForm
from wtforms import SelectField, TextAreaField
from wtforms.validators import DataRequired

from translation import list_languages


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
    text_to_translate = TextAreaField("",
                                      id="text-to-translate",
                                      render_kw={"placeholder": "Enter text to translate ...",
                                                 "cols": 50, "rows": 15},
                                      validators=[DataRequired("Please enter text to translate")])
    text_translated = TextAreaField("",
                                    id="translated-text",
                                    render_kw={"placeholder": "Translated text", 
                                               "readonly": True,
                                               "cols": 50, "rows": 15})

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        available_languages = list_languages()
        self.source_language.choices = [("auto", "Automatic Detection")] + available_languages
        self.target_language.choices = [("", "Select a target language")] + available_languages

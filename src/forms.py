from flask_wtf import FlaskForm
from wtforms import SelectField, StringField, SubmitField, TextAreaField

from translation import list_languages

LANGUAGES = list_languages()

class TranslationForm(FlaskForm):
    source_language = SelectField("Source language",
                                  choices=[],
                                  default="auto",
                                  render_kw={"id": "source-language"})
    target_language = SelectField("Target language",
                                  choices=[],
                                  default="auto",
                                  render_kw={"id": "target-language"})
    text_to_translate = TextAreaField("Text",
                                    render_kw={"id": "text-to-translate",
                                               "placeholder": "Enter text to translate ..."})

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.source_language.choices = [("auto", "Auto")] + LANGUAGES
        self.target_language.choices = [("", "Select a target language")] + LANGUAGES

# TODO : implement real functions using Google Translate API

def list_languages():
    # TODO : get the supported languages from Google Translate API
    return [
        ("FR", "French"),
        ("EN", "English"),
    ]

def detect_language(text):
    # TODO : get the detected language from Google Translate API
    return ("EN", "English")

def translate(text, from_language, to_language):
    # TODO : translate the text from one language to another
    return f"Translated {from_language} to {to_language}: {text.upper()}"

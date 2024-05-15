from googletrans import LANGUAGES, Translator


TRANSLATOR = Translator()


def list_languages():
    """Return a list of tuples (code, language) for all languages supported by Google Translate.

    Returns:
        list[tuple]: A list of tuples (code, language) for all languages supported by Google Translate.
    """
    return [(code, language.title()) for code, language in LANGUAGES.items()]


def detect_language(text):
    """Detect the language of the text

    Args:
        text (str): The text to detect the language

    Returns:
        str: The language code of the detected language
    """
    return TRANSLATOR.detect(text).lang


def translate_text(text, from_language, to_language):
    """Translate the text from one language to another

    Args:
        text (str): The text to translate
        from_language (str): The language code of the source language
        to_language (str): The language code of the target language

    Returns:
        str: The translated text
    """
    return TRANSLATOR.translate(text, src=from_language, dest=to_language).text


if __name__ == "__main__":
    print("list_languages: ", list_languages())
    print("detect_language: ", detect_language("Hello World!"))
    print("translate_text: ", translate_text("Hello World!", "en", "fr"))

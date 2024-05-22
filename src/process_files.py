from io import BytesIO
import os

from translation import detect_language, translate_text


class FileFormatError(Exception):
    pass


def process_txt_file(file_content, target_language):
    """
    Process a .txt file and return the translated file and the source language
    
    Args:
        file (werkzeug.datastructures.FileStorage): The file to process
        target_language (str): The language code of the target language
    """
    # Read the file content
    file_content = file.read().decode('utf-8')
    # Translate the text
    source_language = detect_language(file_content)
    translated_text = translate_text(file_content, source_language, target_language)
    # Create an in-memory file with the translated text
    translated_file = BytesIO()
    translated_file.write(translated_text.encode('utf-8'))
    translated_file.seek(0)
    return translated_file, source_language



def process_file(file, target_language):
    """
    Process a file and return the translated file and the source language
    """
    file_ext = os.path.splitext(file.filename)[1].lower()  # Get file extension
    if file_ext == ".txt":
        return process_txt_file(file, target_language)
    # TODO : add support for other file types
    else:
        raise FileFormatError("Unsupported file format (only .txt files are supported)")
    
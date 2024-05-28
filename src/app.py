from os import urandom as generate_secret_key
import os
from pathlib import Path
import uuid

from flask import Flask, jsonify, render_template, request, send_file, session
from flask_wtf.csrf import validate_csrf, CSRFError

from forms import TranslationForm, FileUploadForm
from process_files import UnsuportedFileFormatError, process_file
from translation import detect_language, translate_text


# Flask app
app = Flask(__name__)
app.config["SECRET_KEY"] = generate_secret_key(24)
TRANSLATED_FILES_FOLDER = Path(app.root_path) / "translated_files"
TRANSLATED_FILES_FOLDER.mkdir(parents=True, exist_ok=True)


# Text translation
@app.route("/", methods=["GET"])
def index():
    """
    Index page
    """
    form = TranslationForm()
    return render_template("index.html", form=form)


@app.route("/api/detect-language", methods=["POST"])
def detect():
    """
    Detect the language of the text
    """
    form = TranslationForm(request.form)
    if form.validate_on_submit():
        text = form.text_to_translate.data
        target_language = detect_language(text)
        source_language = form.source_language.data
        
        if source_language == target_language:
            return jsonify({"status": "error",
                            "errors": {"languages": "Source and target language must be different"}}), 400

        return jsonify({"status": "success",
                        "language": target_language}), 200
    else:
        errors = {field.replace("_", "-"): error for field, error in form.errors.items()}
        return jsonify({"status": "error", "errors": errors}), 400


@app.route("/api/translate", methods=["POST"])
def translate():
    """
    Translate the text
    """
    form = TranslationForm(request.form)
    if form.validate_on_submit():
        text = form.text_to_translate.data
        source_language = form.source_language.data
        target_language = form.target_language.data
        
        if source_language == target_language:
            return jsonify({"status": "error",
                            "errors": {"languages": "Source and target language must be different"}}), 400
        try:
            translated_text = translate_text(text, source_language, target_language)
        except TypeError as e:
            if str(e) == "'NoneType' object is not iterable":
                e = "Error durring translation, please add more context."
            return jsonify({"status": "error",
                            "errors": {"translation": str(e)}}), 400
        return jsonify({"status": "success",
                        "translated_text": translated_text,
                        "source_language": source_language,
                        "target_language": target_language}), 200
    else:
        return jsonify({"status": "error",
                        "errors": form.errors}), 400


# File translation

@app.route("/file", methods=["GET"])
def file():
    """
    File upload page
    """
    form = FileUploadForm()
    return render_template("file_upload.html", form=form)


@app.route("/api/file-upload", methods=["POST"])
def file_upload():
    """
    Upload a file, translate it and save in translated_files/ dir
    """
    errors = {}
    if "file" not in request.files:
        errors["file"] = "No file uploaded"
    if "target_language" not in request.form:
        errors["target-language"] = "No target language specified"
    if "csrf_token" not in request.form:
        errors["csrf"] = "Invalid CSRF token"
    
    file = request.files["file"]
    target_language = request.form["target_language"]
    csrf_token = request.form["csrf_token"]
    try:
        validate_csrf(request.form.get('csrf_token'))
    except CSRFError as e:
        errors["csrf"] = str(e)

    if not errors:
        try:
            translated_file, source_language = process_file(file, target_language)
            translated_filename = f'translated_{source_language}_{target_language}_{file.filename}'
            
            file_ext = os.path.splitext(translated_filename)[-1].lower()  # Get file extension
            translated_file_path = os.path.join(TRANSLATED_FILES_FOLDER, f"{uuid.uuid4()}.{file_ext}")

            with open(translated_file_path, "wb") as f:
                f.write(translated_file.getvalue())

            session["translated_file_path"] = translated_file_path
            session["translated_filename"] = translated_filename

            message = "File uploaded and translated successfully."
            if file_ext == ".docx":
                message += " Tables are not at the same place, they will be at the end of the file."

            return jsonify({"status": "success", "message": message, "filename": translated_filename}), 200
        except UnsuportedFileFormatError as e:
            return jsonify({"status": "error", "errors": {"file": str(e)}}), 400
        
    else:
        return jsonify({"status": "error", "errors": errors}), 400


@app.route("/download-file", methods=["GET"])
def download_file():
    """
    Download the translated file
    """
    translated_file_path = session.get("translated_file_path")
    translated_filename = session.get("translated_filename")
    if not translated_file_path:
        return jsonify({"status": "error", "errors": {"file": "No file to download"}}), 400
    
    # Detect mimetype
    file_ext = os.path.splitext(translated_filename)[-1].lower()  # Get file extension
    mimetype = 'application/octet-stream'
    if file_ext == ".txt":
        mimetype = "text/plain"
    elif file_ext == ".docx":
        mimetype = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    return send_file(translated_file_path, as_attachment=True, download_name=translated_filename, mimetype=mimetype)


# Run
if __name__ == "__main__":
    app.run()

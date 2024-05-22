from os import urandom as generate_secret_key
import os

from flask import Flask, jsonify, render_template, request, send_file, session

from forms import TranslationForm, FileUploadForm
from process_files import FileFormatError, process_txt_file
from translation import detect_language, translate_text


# Configuration
# TODO : move to .env file and read
DEBUG = True

# Flask app
app = Flask(__name__)
app.config["SECRET_KEY"] = generate_secret_key(24)


# Routes
@app.route("/", methods=["GET"])
def index():
    form = TranslationForm()
    return render_template("index.html", form=form)


@app.route("/file", methods=["GET", "POST"])
def file():
    # TODO : separate display, file upload and file download
    form = FileUploadForm()
    if request.method == "POST" and form.validate_on_submit():
        file = form.file.data
        target_language = form.target_language.data
        try:
            translated_file, source_language = process_txt_file(file, target_language)
            translated_filename = f'translated_{source_language}_{target_language}_{file.filename}'
            # Send the translated file to the user
            # TODO : save in session to download later
            return send_file(translated_file, as_attachment=True, download_name=translated_filename, mimetype='text/plain')
        except FileFormatError as e:
            return render_template("file_upload.html", form=form, error=str(e))
        
    return render_template("file_upload.html", form=form)


@app.route("/detect-language", methods=["POST"])
def detect():
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


@app.route("/translate", methods=["POST"])
def translate():
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


# Run
if __name__ == "__main__":
    app.run(debug=DEBUG)

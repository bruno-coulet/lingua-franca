from io import BytesIO
from os import urandom as generate_secret_key

from flask import Flask, jsonify, render_template, request, send_file, session

from forms import TranslationForm, FileUploadForm
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
    # TODO : use API for file upload and download
    form = FileUploadForm()
    if request.method == "POST" and form.validate_on_submit():
        file = form.file.data
        target_language = form.target_language.data
        file_content = file.read().decode('utf-8')
        print(file)
        # Translate the text
        translated_text = translate_text(file_content, "auto", target_language)
        # Create an in-memory file with the translated text
        translated_file = BytesIO()
        translated_file.write(translated_text.encode('utf-8'))
        translated_file.seek(0)

        translated_filename = 'translated_' + file.filename
        # Send the translated file to the user
        return send_file(translated_file, as_attachment=True, download_name=translated_filename, mimetype='text/plain')

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

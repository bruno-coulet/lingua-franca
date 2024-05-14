from os import urandom as generate_secret_key

from flask import Flask, jsonify, render_template, request

from forms import TranslationForm
from translation import detect_language, translate_text

# Configuration
# TODO : move to .env file and read
DEBUG = True

app = Flask(__name__)
app.config["SECRET_KEY"] = generate_secret_key(24)


@app.route("/")
def index():
    form = TranslationForm()
    return render_template("index.html", form=form)


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
        return jsonify({"status": "error", "errors": form.errors}), 400


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
        
        translated_text = translate_text(text, source_language, target_language)
        return jsonify({"status": "success",
                        "translated_text": translated_text,
                        "source_language": source_language,
                        "target_language": target_language}), 200
    else:
        return jsonify({"status": "error",
                        "errors": form.errors}), 400


if __name__ == "__main__":
    app.run(debug=DEBUG)

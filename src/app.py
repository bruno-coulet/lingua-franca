from os import urandom as generate_secret_key

from flask import Flask, jsonify, render_template, request

from forms import TranslationForm
from translation import detect_language, translate_text

# Configuration
# TODO : move to .env file and read
DEBUG = True
# TODO : Add your Google API key here

app = Flask(__name__)
app.config["SECRET_KEY"] = generate_secret_key(24)


@app.route("/")
def index():
    form = TranslationForm()
    return render_template("index.html", form=form)


@app.route("/translate", methods=["POST"])
def translate():
    form = TranslationForm(request.form)
    print(form.data)
    if form.validate():
        
        text = form.text_to_translate.data
        source_language = form.source_language.data
        target_language = form.target_language.data
        if not text:
            return jsonify({"error": "No text to translate"})
        if not source_language or not target_language:
            return jsonify({"error": "Not source or target langage"})
        
        if source_language == "auto":
            langage_detected = detect_language(form.text_to_translate.data)
            if langage_detected is None:
                return jsonify({"error": "Could not detect language"})
            
            source_language = langage_detected

        if source_language == target_language:
            return jsonify({"error": "Source and target language must be different"})
        
        print(source_language, target_language, text)
        translated_text = translate_text(text, source_language, target_language)
        return jsonify({"text": translated_text,
                        "source_language": source_language,
                        "target_language": target_language})

    return jsonify({"error": "Invalid request"}), 400
if __name__ == "__main__":
    app.run(debug=DEBUG)

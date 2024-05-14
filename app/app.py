from flask import Flask, render_template, request
from googletrans import Translator, LANGUAGES


app = Flask(__name__)
translator = Translator()

def get_languages():
    return [(code, language)for code, language in LANGUAGES.items()]

        

@app.route("/", methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        language1 = request.form.get('language1')
        language2 = request.form.get('language2')
        input_text = request.form.get('text1')
    
        
        new_dico = {'dest': language2}
        if language1 != 'auto':
            new_dico['src'] = language1
        traduction = translator.translate(input_text,**new_dico).text

        return render_template('index.html',data=get_languages(),
                               text_translated=traduction,text_to_translate=input_text,
                               lang1=language1, lang2=language2)
    
    return render_template("index.html", data=get_languages())


if __name__ == "__main__":
    app.run(debug=True)

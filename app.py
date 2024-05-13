from flask import Flask, render_template

# Configuration
DEBUG = True


app = Flask(__name__)


@app.route("/")
def index():
    # Get available languages
    languages = [
        ("FR", "French"),
        ("EN", "English"),
    ]
    return render_template("index.html", languages=languages)


if __name__ == "__main__":
    app.run(debug=DEBUG)

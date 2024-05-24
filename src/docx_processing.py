from io import BytesIO
from docx import Document
from docx.enum.text import WD_BREAK

from translation import detect_language, translate_text

class MultipleLanguagesError(Exception):
    pass

class DocxTranslator:
    def __init__(self, file, target_language):
        self.doc = Document(file)
        self.translated_doc = Document()
        self.detected_language = None
        self.target_language = target_language

        self.images = []
    
    def detect_language(self, text_to_translate):
        if not text_to_translate:
            return False
        try: 
            self.detected_language = detect_language(text_to_translate)
            return True
        except TypeError as e:
            if str(e) == "sequence item 0: expected str instance, NoneType found":
                print("DETECT LANGUAGE ERROR : ", e)
                return False
        # TODO
        # if self.detected_language is not None:
        #     raise MultipleLanguagesError("Multiple languages detected in the document")

    @staticmethod
    def add_image(paragraph, image_blob):
        run = paragraph.add_run()
        image_stream = BytesIO(image_blob)
        run.add_picture(image_stream)
    
    def process_paragraph(self, para):
        if "<a:graphicData" in para._p.xml:
            image = self.images.pop(0)
            new_para = self.translated_doc.add_paragraph()
            self.add_image(new_para, image)

        text_to_translate = para.text
        if self.detect_language(text_to_translate):
            translated_text = translate_text(text_to_translate, self.detected_language, self.target_language)
        
            if para.style.name.startswith("Heading"):
                new_para = self.translated_doc.add_heading(level=int(para.style.name.split(' ')[-1]))
            else:
                new_para = self.translated_doc.add_paragraph()
            new_para.style = para.style
            
            new_run = new_para.add_run(translated_text)
            for run in para.runs:
                new_run.bold = run.bold
                new_run.italic = run.italic
                new_run.underline = run.underline
                new_run.font.name = run.font.name
                new_run.font.size = run.font.size
                new_run.font.color.rgb = run.font.color.rgb

                if run.text == '\f':  # Page break character
                    print("PAGE BREAK")
                    new_run.add_break(WD_BREAK.PAGE)

    def process_table(self, table):
        new_table = self.translated_doc.add_table(len(table.rows), len(table.columns), style=table.style)

        for row_idx, row in enumerate(table.rows):
            for cell_idx, cell in enumerate(row.cells):
                
                new_cell = new_table.cell(row_idx, cell_idx)
                if self.detect_language(cell.text):
                    translated_text = translate_text(cell.text, self.detected_language, self.target_language)
                    new_cell.text = translated_text

                new_cell.paragraphs[0].style = cell.paragraphs[0].style

    def process_document(self):

        for rel in self.doc.part.rels.values():
            if "image" in rel.target_ref:
                image = rel.target_part.blob
                self.images.append(image)
                
        for para in self.doc.paragraphs:
            self.process_paragraph(para)

        # TODO : add tables during the paragraph processing
        self.translated_doc.add_page_break()
        self.translated_doc.add_heading("TABLES", level=1)
        for i, table in enumerate(self.doc.tables, start=1):
            self.translated_doc.add_heading(f"Table {i}", level=2)
            self.process_table(table)
            self.translated_doc.add_paragraph("\n\n")

        return self.translated_doc

if __name__ == "__main__":
    with open("test.docx", "rb") as f:
        docx_translator = DocxTranslator(f, "fr")
        translated_doc = docx_translator.process_document()
    with open("test_fr.docx", "wb") as f:
        translated_file = BytesIO()
        translated_doc.save(translated_file)
        f.write(translated_file.getvalue())
        
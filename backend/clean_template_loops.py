"""
Remove loop tags from paragraphs - they should only be in the table
"""
from docx import Document

def clean_template():
    doc = Document('templates/template.docx')
    
    # Remove loop tags from paragraphs (keep only in table)
    paragraphs_to_clear = []
    for para in doc.paragraphs:
        text = para.text.strip()
        if '{% for req in requirements_flat %}' in text or '{% endfor %}' in text:
            # Clear this paragraph if it only contains loop tags
            if text in ['{% for req in requirements_flat %}', '{% endfor %}', '{%for req in requirements_flat%}', '{%endfor%}']:
                paragraphs_to_clear.append(para)
    
    # Clear those paragraphs
    for para in paragraphs_to_clear:
        para.clear()
        # Or remove the paragraph entirely
        # Actually, let's just clear it
        para.text = ''
    
    doc.save('templates/template.docx')
    print(f"[OK] Cleaned {len(paragraphs_to_clear)} paragraphs with loop tags")
    print("Loop tags should now only be in the table cells")

if __name__ == "__main__":
    clean_template()


from fpdf import FPDF


class PDFGenerator:
    def __init__(self):
        self.pdf = FPDF()
        self.pdf.set_auto_page_break(auto=True, margin=15)

    def add_page(self):
        self.pdf.add_page()

    def set_title(self, title):
        self.pdf.set_font("Arial", 'B', 16)
        self.pdf.cell(0, 10, title, ln=True, align='C')

    def set_body(self, body):
        self.pdf.set_font("Arial", size=12)
        self.pdf.multi_cell(0, 10, body)

    def save(self, filename):
        self.pdf.output(filename)


def generate_document(title, body, filename):
    """Generate a PDF document with given title, body, and save to filename."""
    pdf_generator = PDFGenerator()
    pdf_generator.add_page()
    pdf_generator.set_title(title)
    pdf_generator.set_body(body)
    pdf_generator.save(filename)


def generate_scheme_document(scheme_data: dict, filename: str):
    """Generate a PDF document for a specific government scheme."""
    pdf = PDFGenerator()
    pdf.add_page()
    pdf.set_title(scheme_data.get('name', 'Government Scheme'))

    body = f"""
Ministry: {scheme_data.get('ministry', 'N/A')}

Description:
{scheme_data.get('description', 'No description available.')}

Benefits:
{scheme_data.get('benefit', 'N/A')}

Eligibility:
- Minimum Age: {scheme_data.get('min_age', 'N/A')}
- Maximum Income: {scheme_data.get('max_income', 'N/A')}
- Target Category: {scheme_data.get('target_category', 'N/A')}
- Target Occupation: {scheme_data.get('target_occupation', 'N/A')}
- State: {scheme_data.get('state', 'All India')}

Application Link: {scheme_data.get('application_link', 'N/A')}
"""
    pdf.set_body(body)
    pdf.save(filename)

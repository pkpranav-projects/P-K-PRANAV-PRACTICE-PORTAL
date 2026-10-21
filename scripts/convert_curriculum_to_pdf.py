import os
import sys
import io
import re
import struct
from pathlib import Path
from PIL import Image as PILImage
import docx
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE

from reportlab.lib.pagesizes import letter, landscape, A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, PageBreak, KeepTogether, Preformatted
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
import olefile

if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

DOCS_DIR = Path(r"c:\Users\P K PRANAV\Pictures\javapractice\documentss")
OUTPUT_DIR = DOCS_DIR / "web_pdf"
TEMP_IMG_DIR = DOCS_DIR / "temp_extracted_imgs"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
TEMP_IMG_DIR.mkdir(parents=True, exist_ok=True)

class NumberedCanvas(canvas.Canvas):
    """Adds slide/page numbers and running header/footer."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        # Footer
        self.drawString(36, 18, "Java Curriculum Study Guide · Comprehensive Lab & Theory Edition")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(self._pagesize[0] - 36, 18, page_str)
        self.restoreState()

def clean_text(txt):
    if not txt:
        return ""
    txt = txt.replace("\x0b", "\n").replace("\r\n", "\n").replace("\r", "\n")
    # escape XML characters for reportlab Paragraph
    txt = txt.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return txt.strip()

def is_code_block(text):
    code_indicators = [
        "public class", "class ", "interface ", "public static void", "System.out.println",
        "import java.", "new ArrayList", "new Scanner", "throws Exception", "catch (",
        ";", "{}", "void main", "private int", "public int", "return "
    ]
    matches = sum(1 for ind in code_indicators if ind in text)
    has_braces = "{" in text or "}" in text
    has_semicolon = ";" in text
    return (matches >= 2 and (has_braces or has_semicolon)) or text.strip().startswith("//")

def convert_pptx(pptx_path: Path, output_pdf: Path):
    print(f"Converting PPTX: {pptx_path.name} -> {output_pdf.name}")
    prs = Presentation(str(pptx_path))
    
    # Page size: Landscape letter (792 x 612)
    page_w, page_h = landscape(letter)
    doc = SimpleDocTemplate(
        str(output_pdf),
        pagesize=(page_w, page_h),
        leftMargin=36,
        rightMargin=36,
        topMargin=32,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'SlideTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=12
    )
    subtitle_style = ParagraphStyle(
        'SlideSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#4f46e5'),
        spaceAfter=8
    )
    body_style = ParagraphStyle(
        'SlideBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=6
    )
    bullet_style = ParagraphStyle(
        'SlideBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor('#1e293b'),
        leftIndent=15,
        spaceAfter=5
    )
    code_style = ParagraphStyle(
        'SlideCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#f8fafc'),
        backColor=colors.HexColor('#0f172a'),
        borderColor=colors.HexColor('#334155'),
        borderWidth=1,
        borderPadding=8,
        spaceAfter=8
    )

    story = []
    total_slides = len(prs.slides)

    for slide_idx, slide in enumerate(prs.slides):
        slide_num = slide_idx + 1
        
        # Slide Header Table
        header_data = [
            [
                Paragraph(f"<b>{pptx_path.stem}</b>", subtitle_style),
                Paragraph(f"<font color='#64748b' size=9>Slide {slide_num} of {total_slides}</font>", ParagraphStyle('SlideNum', alignment=2, fontName='Helvetica-Bold'))
            ]
        ]
        header_table = Table(header_data, colWidths=[page_w - 72 - 120, 120])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 4))
        
        # Horizontal accent line
        line_table = Table([[""]], colWidths=[page_w - 72], rowHeights=[2])
        line_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#4f46e5')),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(line_table)
        story.append(Spacer(1, 10))

        # Collect slide elements
        slide_title = ""
        slide_paragraphs = []
        slide_images = []

        for shape in slide.shapes:
            if shape.has_text_frame:
                for p_idx, p in enumerate(shape.text_frame.paragraphs):
                    raw_text = p.text.strip()
                    if not raw_text:
                        continue
                    if shape == slide.shapes[0] and p_idx == 0 and not slide_title:
                        slide_title = raw_text
                    else:
                        slide_paragraphs.append((raw_text, p.level))

            elif shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
                try:
                    img_bytes = shape.image.blob
                    img_ext = shape.image.ext
                    img_path = TEMP_IMG_DIR / f"slide_{slide_num}_{len(slide_images)}.{img_ext}"
                    with open(img_path, "wb") as f_img:
                        f_img.write(img_bytes)
                    
                    # Inspect dimensions
                    with PILImage.open(img_path) as pil_img:
                        orig_w, orig_h = pil_img.size
                        # Max display area: 420w x 260h
                        max_w, max_h = 420, 260
                        ratio = min(max_w / orig_w, max_h / orig_h, 1.0)
                        disp_w = orig_w * ratio
                        disp_h = orig_h * ratio
                    
                    slide_images.append((img_path, disp_w, disp_h))
                except Exception as img_err:
                    pass

        if slide_title:
            story.append(Paragraph(clean_text(slide_title), title_style))
        else:
            story.append(Paragraph(f"Section Overview", title_style))

        # Add paragraphs
        for text, level in slide_paragraphs:
            cleaned = clean_text(text)
            if not cleaned:
                continue
            if is_code_block(text):
                # Render code snippet
                code_text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                story.append(Paragraph(f"<font face='Courier' color='#38bdf8'><b>&gt; </b></font>{code_text}", code_style))
            elif level > 0 or len(text) < 120:
                bullet_char = "• " if level <= 1 else "– "
                story.append(Paragraph(f"<font color='#4f46e5'>{bullet_char}</font>{cleaned}", bullet_style))
            else:
                story.append(Paragraph(cleaned, body_style))

        # Add Images if any
        for img_path, w, h in slide_images:
            try:
                story.append(Spacer(1, 6))
                story.append(RLImage(str(img_path), width=w, height=h))
            except Exception:
                pass

        if slide_idx < total_slides - 1:
            story.append(PageBreak())

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] Created {output_pdf.name} ({total_slides} slides)")

def convert_docx(docx_path: Path, output_pdf: Path):
    print(f"Converting DOCX: {docx_path.name} -> {output_pdf.name}")
    doc = docx.Document(str(docx_path))
    
    # Page size: Letter portrait
    page_w, page_h = letter
    pdf_doc = SimpleDocTemplate(
        str(output_pdf),
        pagesize=(page_w, page_h),
        leftMargin=44,
        rightMargin=44,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    h1_style = ParagraphStyle(
        'DocH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#1e1b4b'),
        spaceBefore=14,
        spaceAfter=8
    )
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#312e81'),
        spaceBefore=10,
        spaceAfter=6
    )
    h3_style = ParagraphStyle(
        'DocH3',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#4f46e5'),
        spaceBefore=6,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14.5,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=5
    )
    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#1e293b'),
        leftIndent=14,
        spaceAfter=4
    )
    code_style = ParagraphStyle(
        'DocCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#f8fafc'),
        backColor=colors.HexColor('#0f172a'),
        borderColor=colors.HexColor('#334155'),
        borderWidth=1,
        borderPadding=6,
        spaceBefore=4,
        spaceAfter=6
    )

    story = []

    # Title header banner
    doc_title = docx_path.stem
    story.append(Paragraph(f"<b>{clean_text(doc_title)}</b>", h1_style))
    story.append(Paragraph(f"<font color='#4f46e5' size=9><b>JAVA STUDY GUIDE & CODE EXAMPLES</b></font>", styles['Normal']))
    story.append(Spacer(1, 4))
    
    line_table = Table([[""]], colWidths=[page_w - 88], rowHeights=[2])
    line_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#4f46e5')),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(line_table)
    story.append(Spacer(1, 10))

    # Iterate paragraphs
    for p in doc.paragraphs:
        txt = p.text.strip()
        if not txt:
            continue
        cleaned = clean_text(txt)
        style_name = p.style.name.lower() if p.style else ""

        if "heading 1" in style_name:
            story.append(Paragraph(cleaned, h1_style))
        elif "heading 2" in style_name:
            story.append(Paragraph(cleaned, h2_style))
        elif "heading 3" in style_name:
            story.append(Paragraph(cleaned, h3_style))
        elif is_code_block(txt):
            code_escaped = txt.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            story.append(Paragraph(code_escaped, code_style))
        elif txt.startswith("•") or txt.startswith("-") or txt.startswith("*"):
            bullet_body = cleaned.lstrip("•-* ")
            story.append(Paragraph(f"<font color='#4f46e5'>• </font>{bullet_body}", bullet_style))
        elif txt.startswith("Example ") or txt.startswith("Program ") or txt.startswith("Step "):
            story.append(Paragraph(f"<b>{cleaned}</b>", h3_style))
        else:
            story.append(Paragraph(cleaned, body_style))

    # Iterate tables in docx
    for t_idx, table in enumerate(doc.tables):
        story.append(Spacer(1, 8))
        table_data = []
        for row in table.rows:
            row_data = []
            for cell in row.cells:
                cell_txt = clean_text(cell.text.strip())
                row_data.append(Paragraph(cell_txt, body_style))
            table_data.append(row_data)
        
        if table_data:
            col_count = len(table_data[0])
            col_w = (page_w - 88) / max(col_count, 1)
            rl_table = Table(table_data, colWidths=[col_w] * col_count)
            rl_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
                ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#0f172a')),
                ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ]))
            story.append(rl_table)
            story.append(Spacer(1, 8))

    pdf_doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] Created {output_pdf.name}")

def convert_ppt(ppt_path: Path, output_pdf: Path):
    print(f"Converting PPT (OLE): {ppt_path.name} -> {output_pdf.name}")
    ole = olefile.OleFileIO(str(ppt_path))
    stream = ole.openstream('PowerPoint Document')
    data = stream.read()

    pos = 0
    extracted_texts = []
    seen = set()

    while pos + 8 <= len(data):
        ver_inst, rec_type, rec_len = struct.unpack('<HHI', data[pos:pos+8])
        if rec_type in (0x0FA8, 0x0FA0) and 0 < rec_len < 20000:
            body = data[pos+8:pos+8+rec_len]
            txt = ""
            if rec_type == 0x0FA8:
                try:
                    txt = body.decode('latin1', errors='ignore').strip()
                except:
                    pass
            else:
                try:
                    txt = body.decode('utf-16le', errors='ignore').strip()
                except:
                    pass
            
            # Filter boilerplate
            if txt and len(txt) > 2 and "Click to edit" not in txt:
                # normalize
                norm = " ".join(txt.split())
                if norm not in seen:
                    seen.add(norm)
                    extracted_texts.append(txt)
        pos += 1

    # Extract pictures from stream
    extracted_images = []
    if ole.exists('Pictures'):
        pic_stream = ole.openstream('Pictures')
        pic_data = pic_stream.read()
        png_matches = list(re.finditer(b'\x89PNG\r\n\x1a\n', pic_data))
        for p_i, m in enumerate(png_matches):
            start = m.start()
            # find IEND
            end_match = re.search(b'IEND\xaeB`\x82', pic_data[start:])
            if end_match:
                end = start + end_match.end()
                png_bytes = pic_data[start:end]
                img_path = TEMP_IMG_DIR / f"ppt_extracted_{p_i}.png"
                try:
                    with open(img_path, 'wb') as pf:
                        pf.write(png_bytes)
                    with PILImage.open(img_path) as pimg:
                        w, h = pimg.size
                        ratio = min(380 / w, 220 / h, 1.0)
                        extracted_images.append((img_path, w * ratio, h * ratio))
                except Exception:
                    pass

    # Group extracted texts into slide-like clusters
    # Break into pages of 3-5 items
    clusters = []
    current = []
    for t in extracted_texts:
        current.append(t)
        if len(current) >= 4 or len("\n".join(current)) > 400:
            clusters.append(current)
            current = []
    if current:
        clusters.append(current)

    page_w, page_h = landscape(letter)
    doc = SimpleDocTemplate(
        str(output_pdf),
        pagesize=(page_w, page_h),
        leftMargin=36,
        rightMargin=36,
        topMargin=32,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'PptTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=12
    )
    subtitle_style = ParagraphStyle(
        'PptSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0284c7'),
        spaceAfter=8
    )
    body_style = ParagraphStyle(
        'PptBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=6
    )
    code_style = ParagraphStyle(
        'PptCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#f8fafc'),
        backColor=colors.HexColor('#0f172a'),
        borderColor=colors.HexColor('#334155'),
        borderWidth=1,
        borderPadding=6,
        spaceAfter=6
    )

    story = []
    total_pages = len(clusters)

    for p_idx, cluster in enumerate(clusters):
        slide_num = p_idx + 1
        header_data = [
            [
                Paragraph(f"<b>{ppt_path.stem} · Stacks, Queues &amp; Deque</b>", subtitle_style),
                Paragraph(f"<font color='#64748b' size=9>Slide {slide_num} of {total_pages}</font>", ParagraphStyle('SlideNum', alignment=2, fontName='Helvetica-Bold'))
            ]
        ]
        header_table = Table(header_data, colWidths=[page_w - 72 - 120, 120])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 4))
        
        line_table = Table([[""]], colWidths=[page_w - 72], rowHeights=[2])
        line_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0284c7')),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(line_table)
        story.append(Spacer(1, 10))

        # Main slide title from first item
        first_item = cluster[0]
        title_lines = first_item.split("\n")
        story.append(Paragraph(clean_text(title_lines[0]), title_style))

        if len(title_lines) > 1:
            for l in title_lines[1:]:
                if l.strip():
                    story.append(Paragraph(f"<font color='#0284c7'>• </font>{clean_text(l)}", body_style))

        for text_item in cluster[1:]:
            cleaned = clean_text(text_item)
            if not cleaned:
                continue
            if is_code_block(text_item):
                code_escaped = text_item.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                story.append(Paragraph(code_escaped, code_style))
            else:
                for line in text_item.split("\n"):
                    l_clean = clean_text(line)
                    if l_clean:
                        story.append(Paragraph(f"<font color='#0284c7'>• </font>{l_clean}", body_style))

        # Add image if available for this slide
        if p_idx < len(extracted_images):
            img_p, iw, ih = extracted_images[p_idx]
            story.append(Spacer(1, 6))
            story.append(RLImage(str(img_p), width=iw, height=ih))

        if p_idx < total_pages - 1:
            story.append(PageBreak())

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] Created {output_pdf.name} ({total_pages} slides)")

def main():
    print(f"Scanning documents directory: {DOCS_DIR}")
    files = list(DOCS_DIR.iterdir())
    converted_count = 0

    for file_path in sorted(files):
        if file_path.name.startswith("~$") or file_path.is_dir():
            continue
        ext = file_path.suffix.lower()
        if ext == ".pptx":
            out_pdf = OUTPUT_DIR / f"{file_path.name}.pdf"
            convert_pptx(file_path, out_pdf)
            converted_count += 1
        elif ext == ".docx":
            out_pdf = OUTPUT_DIR / f"{file_path.name}.pdf"
            convert_docx(file_path, out_pdf)
            converted_count += 1
        elif ext == ".ppt":
            out_pdf = OUTPUT_DIR / f"{file_path.name}.pdf"
            convert_ppt(file_path, out_pdf)
            converted_count += 1

    import shutil
    shutil.rmtree(TEMP_IMG_DIR, ignore_errors=True)

    print(f"\n==========================================")
    print(f"Conversion complete! Converted {converted_count} files to high-res companion PDFs in: {OUTPUT_DIR}")
    print(f"==========================================")

if __name__ == "__main__":
    main()

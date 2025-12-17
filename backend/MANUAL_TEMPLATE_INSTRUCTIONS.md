# Manual Template Creation - Step by Step

## Quick Fix: Update Your Existing Template

### Method 1: Edit in Word (Easiest)

1. **Open** `backend/templates/template.docx` in Microsoft Word

2. **Find your table** with the Functional Requirements

3. **In the FIRST DATA ROW** (row 2, after header), type in each cell:
   - Cell 1: `{{ req.req_id }}`
   - Cell 2: `{{ req.section }}`
   - Cell 3: `{{ req.description }}`
   - Cell 4: `{{ req.status }}`

4. **Right-click on Row 2** → Select the entire row

5. **Before Row 2**, type: `{% for req in requirements_flat %}`

6. **After Row 2**, type: `{% endfor %}`

7. **Save** the file

### Method 2: Create New Template

1. Open Microsoft Word
2. Type: **Functional Requirements** (centered, bold, size 16)
3. Press Enter twice
4. Insert → Table → 4 columns, 2 rows
5. **Row 1 (Header)** - Type:
   - Requirement ID | Section | Description | Status
   - Make it bold, blue background, white text
6. **Row 2 (Data)** - Type in each cell:
   - `{{ req.req_id }}`
   - `{{ req.section }}`
   - `{{ req.description }}`
   - `{{ req.status }}`
7. **Select Row 2** (click row number on left)
8. **Before the table**, type: `{% for req in requirements_flat %}`
9. **After the table**, type: `{% endfor %}`
10. Save as: `template.docx` in `backend/templates/` folder

## Testing

1. Restart backend server
2. Upload Excel file
3. Check if data appears

## Common Issues:

- **Blank output**: Jinja2 syntax not typed correctly
- **No data**: Variable names don't match (must be: req.req_id, req.section, etc.)
- **Error**: Check backend logs for parsing errors


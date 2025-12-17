# Word Template Guide for BRD Generator

## How to Create/Update Your Word Template

### Step 1: Open Microsoft Word
1. Create a new Word document or open your existing template
2. Add a title: "Functional Requirements" (centered, bold)

### Step 2: Create the Table Structure
1. Insert a table with 4 columns:
   - **Requirement ID**
   - **Section**
   - **Description**
   - **Status**

2. Format the header row:
   - Make it bold
   - Add background color (blue)
   - White text color

### Step 3: Add Jinja2 Template Syntax

**IMPORTANT:** For docxtpl to work with tables, the Jinja2 syntax must be placed **INSIDE the table cells**, not outside.

#### Option A: Simple Flat List (Easier - Recommended)

1. Create a table with **2 rows**:
   - Row 1: Header row (Requirement ID | Section | Description | Status)
   - Row 2: Data row (this will be duplicated for each requirement)

2. In **Row 2 (the data row)**, type the Jinja2 syntax **directly in each cell**:

   - **Cell 1 (Requirement ID column)**: Type exactly: `{{ req.req_id }}`
   - **Cell 2 (Section column)**: Type exactly: `{{ req.section }}`
   - **Cell 3 (Description column)**: Type exactly: `{{ req.description }}`
   - **Cell 4 (Status column)**: Type exactly: `{{ req.status }}`

3. **After the table** (outside, in a new paragraph), type:
   ```
   {% for req in requirements_flat %}{% endfor %}
   ```
   
   **OR** place the loop tags around the table row:
   - Before Row 2: `{% for req in requirements_flat %}`
   - After Row 2: `{% endfor %}`

**Visual Example:**
```
[Table]
┌─────────────────┬──────────┬─────────────┬────────┐
│ Requirement ID  │ Section  │ Description │ Status │  ← Row 1 (Header)
├─────────────────┼──────────┼─────────────┼────────┤
│ {{ req.req_id }}│{{req.section}}│{{req.description}}│{{req.status}}│  ← Row 2 (Data with Jinja2)
└─────────────────┴──────────┴─────────────┴────────┘

{% for req in requirements_flat %}{% endfor %}
```

**Alternative (Loop around row):**
```
{% for req in requirements_flat %}
[Table Row 2 with variables]
{% endfor %}
```

#### Option B: Grouped by Form (With Section Headings)

If you want section headings (like "Initiate Change Request"):

1. Before the table, add:
```
{% for form_group in requirements %}
{{ form_group.form }}
```

2. Then your table row:
```
{% for req in form_group.requirements %}
{{ req.req_id }} | {{ req.section }} | {{ req.description }} | {{ req.status }}
{% endfor %}
```

3. After the table, add:
```
{% endfor %}
```

### Step 4: Save the Template
1. Save as: `template.docx`
2. Place it in: `backend/templates/template.docx`

## Important Notes:

1. **Jinja2 syntax must be typed exactly** - including the curly braces and percent signs
2. **Spaces matter** - `{% for %}` not `{%for%}`
3. **Variable names are case-sensitive** - use `req.req_id` not `req.Req_ID`
4. **Test your template** - Use the `/test-parse` endpoint to verify data structure

## Testing Your Template

1. Upload your Excel file through the frontend
2. Check backend logs to see parsed data
3. If blank, check:
   - Jinja2 syntax is correct
   - Variable names match (req.req_id, req.section, etc.)
   - Table structure is correct

## Example Template Structure:

```
Functional Requirements

[Table Header Row - Blue Background]
Requirement ID | Section | Description | Status

[Data Row with Jinja2]
{% for req in requirements_flat %}
{{ req.req_id }} | {{ req.section }} | {{ req.description }} | {{ req.status }}
{% endfor %}
```


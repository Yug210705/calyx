import os
import re

# Add welcome gradient to index.css
with open('frontend/src/index.css', 'r', encoding='utf-8') as f:
    index_css = f.read()

if '--welcome-gradient' not in index_css:
    index_css = index_css.replace(':root {\n', ':root {\n  --welcome-gradient: linear-gradient(to bottom, color-mix(in srgb, var(--primary-color) 12%, var(--card-bg)), var(--card-bg));\n')
    index_css = index_css.replace('.global-page-header {\n  background: var(--card-bg);', '.global-page-header {\n  background: var(--welcome-gradient);')
    with open('frontend/src/index.css', 'w', encoding='utf-8') as f:
        f.write(index_css)

# Update welcome backgrounds
files_to_update = {
    'frontend/src/pages/Dashboard.css': (r'\.welcome-section \{\s*background: var\(--card-bg\);', '.welcome-section {\n  background: var(--welcome-gradient);'),
    'frontend/src/pages/Projects.css': (r'\.projects-welcome-section \{\s*background: var\(--card-bg\);', '.projects-welcome-section {\n  background: var(--welcome-gradient);'),
    'frontend/src/pages/Tasks.css': (r'\.tasks-welcome \{\s*background: var\(--card-bg\);', '.tasks-welcome {\n  background: var(--welcome-gradient);')
}

for filepath, (pattern, replacement) in files_to_update.items():
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = re.sub(pattern, replacement, content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

print("Headers updated!")

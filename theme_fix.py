import os
import re

css_files = []
for root, dirs, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.css') and file not in ['index.css', 'Auth.css']:
            css_files.append(os.path.join(root, file))

replacements = [
    (r'(?i)background(?:-color)?:\s*#(?:ffffff|fff)\b', 'background: var(--card-bg)'),
    (r'(?i)background(?:-color)?:\s*white\b', 'background: var(--card-bg)'),
    (r'(?i)color:\s*#(?:111827|0f172a|000000|000)\b', 'color: var(--text-primary)'),
    (r'(?i)color:\s*#(?:4b5563|6b7280|475569)\b', 'color: var(--text-secondary)'),
    (r'(?i)color:\s*#(?:9ca3af|94a3b8)\b', 'color: var(--text-muted)'),
    (r'(?i)border(?:-[a-z]+)?:\s*1px solid #(?:e5e7eb|e2e8f0|f3f4f6|d1d5db)\b', 'border: 1px solid var(--border-color)'),
    (r'(?i)border-color:\s*#(?:e5e7eb|e2e8f0|f3f4f6|d1d5db)\b', 'border-color: var(--border-color)'),
    (r'(?i)background(?:-color)?:\s*#(?:f9fafb|f8fafc|f3f4f6|f1f5f9)\b', 'background: var(--bg-color)'),
    (r'(?i)background(?:-color)?:\s*#(?:e5e7eb|e2e8f0|d1d5db)\b', 'background: var(--border-color)')
]

for file_path in css_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, new_content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")

print("Done!")

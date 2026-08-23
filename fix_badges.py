import os
import re

replacements = [
    (r'background:\s*#fdfdfd;', 'background: var(--bg-color);'),
    (r'background(?:-color)?:\s*#f5f3ff;', 'background: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#eff6ff;', 'background: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#ecfdf5;', 'background: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#fff7ed;', 'background: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#F5F3FF;', 'background: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#EFF6FF;', 'background: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#ECFDF5;', 'background: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#FFF7ED;', 'background: color-mix(in srgb, currentColor 15%, transparent);'),
    
    (r'background:\s*#fce8e8;\s*color:\s*#ef4444;', 'background: color-mix(in srgb, var(--danger) 15%, transparent); color: var(--danger);'),
    (r'background:\s*#fef3c7;\s*color:\s*#f59e0b;', 'background: color-mix(in srgb, var(--warning) 15%, transparent); color: var(--warning);'),
    (r'background:\s*#d1fae5;\s*color:\s*#10b981;', 'background: color-mix(in srgb, var(--success) 15%, transparent); color: var(--success);')
]

for root, dirs, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.css'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            new_content = content
            for p, r in replacements:
                new_content = re.sub(p, r, new_content)
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")

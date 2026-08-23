import os
import re

replacements = [
    (r'color:\s*#334155;', 'color: var(--text-primary);'),
    (r'color:\s*#64748b;', 'color: var(--text-secondary);'),
    (r'color:\s*#374151;', 'color: var(--text-primary);'),
    (r'border(?:-bottom|-top)?:\s*1px solid #f1f5f9;', 'border-bottom: 1px solid var(--border-color);'),
    (r'border(?:-bottom|-top)?:\s*1px solid transparent;', 'border-bottom: 1px solid transparent;'), # Safety check
    (r'border-color:\s*#fca5a5;', 'border-color: var(--danger);'),
    (r'background(?:-color)?:\s*#f3e8ff;', 'background-color: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#e0f2fe;', 'background-color: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#fce7f3;', 'background-color: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#dcfce7;', 'background-color: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#fee2e2;', 'background-color: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#fef9c3;', 'background-color: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#dbeafe;', 'background-color: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#ffedd5;', 'background-color: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#f5f3ff;', 'background-color: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#eff6ff;', 'background-color: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#ecfdf5;', 'background-color: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'background(?:-color)?:\s*#fff7ed;', 'background-color: color-mix(in srgb, currentColor 15%, transparent);'),
    (r'border:\s*2px solid #ffffff;', 'border: 2px solid var(--card-bg);')
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

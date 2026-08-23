import os
import re

# Fix tabs that should have border-bottom, not full border
# These are tab containers that only need a bottom border line
tab_selectors = [
    '.rpt-tabs',
    '.intg-tabs',
    '.intg-sb-tabs',
    '.rpt-workload-table th',
]

for root, dirs, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.css'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            
            # Fix: tabs containers should have border-bottom not full border
            for sel in tab_selectors:
                escaped = re.escape(sel)
                pattern = r'(' + escaped + r'\s*\{[^}]*?)border:\s*1px solid var\(--border-color\)'
                replacement = r'\1border-bottom: 1px solid var(--border-color)'
                content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            
            # Fix: background-color: #fcfcfc (sidebar usage box)
            content = re.sub(r'background-color:\s*#fcfcfc;', 'background-color: var(--bg-color);', content)
            
            # Fix: background-color: #eef2ff (pagination active)
            content = re.sub(r'background-color:\s*#eef2ff;', 'background-color: color-mix(in srgb, var(--primary-color) 15%, transparent);', content)
            
            # Fix: background-color: #cbd5e1 (toggle slider)
            content = re.sub(r'background-color:\s*#cbd5e1;', 'background-color: var(--border-color-darker);', content)
            
            # Fix: border-bottom: 2px solid #cbd5e1
            content = re.sub(r'border-bottom:\s*2px solid #cbd5e1', 'border-bottom: 2px solid var(--border-color-darker)', content)
            
            # Fix avatar stack borders from white to card-bg
            content = re.sub(r'border:\s*2px solid white;', 'border: 2px solid var(--card-bg);', content)
            
            # Fix input background in search boxes
            content = re.sub(r'background:\s*none;\s*\n(\s*)outline:\s*none;', r'background: transparent;\n\1outline: none;', content)
            
            if content != original:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filepath}")

print("Done!")

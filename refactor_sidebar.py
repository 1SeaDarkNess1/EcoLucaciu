import re

file_path = 'style.css'
with open(file_path, 'r') as f:
    lines = f.readlines()

# Line numbers are 0-indexed in list
changes = {
    99: ("width: 280px;", "width: 320px;"),
    101: ("padding: 2.5rem 1.875rem;", "padding: 1.5rem 1.25rem;"),
    112: ("font-size: 1.3rem;", "font-size: 1.2rem;"),
    115: ("height: 70px;", "height: 60px;"),
    155: ("font-size: var(--fs-small);", "font-size: 0.85rem;"),
    157: ("padding-top: 1.25rem;", "padding-top: 1rem;"),
    160: ("padding-bottom: 1.25rem;", "padding-bottom: 1rem;"),
    165: ("margin-left: 310px;", "margin-left: 340px;")
}

for line_idx, (old, new) in changes.items():
    if old in lines[line_idx]:
        lines[line_idx] = lines[line_idx].replace(old, new)
        print(f"Applied change at line {line_idx+1}: {old} -> {new}")
    else:
        print(f"WARNING: content mismatch at line {line_idx+1}. Expected '{old}', found '{lines[line_idx].strip()}'")

with open(file_path, 'w') as f:
    f.writelines(lines)

import re

file_path = 'style.css'
with open(file_path, 'r') as f:
    content = f.read()

# Replace .reader-layout
# Match the single line block
pattern_reader = r"\.reader-layout \{ flex: 1; display: flex; align-items: center; justify-content: center; overflow-y: auto; padding: 2rem; \}"
replacement_reader = ".reader-layout { flex: 1; display: flex; flex-direction: column; align-items: stretch; justify-content: flex-start; overflow: hidden; padding: 1rem; height: calc(100vh - 70px); }"

if pattern_reader in content:
    content = content.replace(pattern_reader, replacement_reader)
    print("Replaced .reader-layout")
else:
    print("WARNING: Could not find .reader-layout exact match")

# Replace .material-viewer block
pattern_viewer = r"""\.material-viewer \{
    width: 90%;
    max-width: 1200px;
    height: 80vh;
    /\* Glass styles inherited via class \*/
    padding: 20px;
    display: flex;
    flex-direction: column;
    transition: all 0.4s ease;
    overflow: hidden;
\}"""
replacement_viewer = """.material-viewer {
    width: 100%;
    flex: 1;
    max-width: none;
    height: auto;
    /* Glass styles inherited via class */
    padding: 0;
    display: flex;
    flex-direction: column;
    transition: all 0.4s ease;
    overflow: hidden;
    margin: 0;
}"""

# Use re.sub just in case of whitespace differences, but exact match is safer if I copied correctly.
# Let's try direct replace first.
if pattern_viewer in content:
    content = content.replace(pattern_viewer, replacement_viewer)
    print("Replaced .material-viewer")
else:
    print("WARNING: Could not find .material-viewer exact match")
    # Try creating a regex for it
    pattern_viewer_re = r"\.material-viewer\s*\{\s*width:\s*90%;\s*max-width:\s*1200px;\s*height:\s*80vh;\s*/\*.*?\*/\s*padding:\s*20px;\s*display:\s*flex;\s*flex-direction:\s*column;\s*transition:\s*all\s*0\.4s\s*ease;\s*overflow:\s*hidden;\s*\}"
    content = re.sub(pattern_viewer_re, replacement_viewer, content, flags=re.DOTALL)
    print("Attempted regex replacement for .material-viewer")

# Update iframe
pattern_iframe = r"\.material-viewer iframe \{ flex: 1; border-radius: 16px; border: none; background: #ffffff; \}"
replacement_iframe = ".material-viewer iframe { flex: 1; width: 100%; height: 100%; border-radius: 16px; border: none; background: #ffffff; }"

if pattern_iframe in content:
    content = content.replace(pattern_iframe, replacement_iframe)
    print("Replaced .material-viewer iframe")
else:
    print("WARNING: Could not find .material-viewer iframe match")

with open(file_path, 'w') as f:
    f.write(content)

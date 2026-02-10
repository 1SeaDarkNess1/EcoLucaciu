import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Fix Duplicated Mobile Nav
# The previous script appended the block + initialHash line.
# It seems it did it twice or something, or I replaced 'const initialHash' which appeared multiple times?
# No, 'const initialHash' usually appears once.
# Let's verify the content structure.
# I see two blocks of "Mobile Nav Fix".
# I'll remove one of them.

# Regex to find the duplicated block.
mobile_nav_block = r"""
    // Mobile Nav Fix
    const sidebarLinks = document.querySelectorAll\('.menu-vertical a'\);
    const sidebar = document.getElementById\('sidebar'\);
    if \(sidebarLinks && sidebar\) \{
        sidebarLinks.forEach\(link => \{
            link.addEventListener\('click', \(\) => \{
                // If on mobile \(or generally if sidebar is open overlay mode\)
                // The issue description says "on mobile".
                // We check window width or just remove 'open' class safely.
                if \(window.innerWidth <= 768\) \{
                    sidebar.classList.remove\('open'\);
                \}
            \}\);
        \}\);
    \}
"""
# The previous script might have used a slightly different string for the second insertion (the one I defined in python variable nav_logic).
# One block has comments, the other might not?
# Let's just look at the file content in the previous turn.
# Both look identical in the `read_file` output except for comments.
# Wait, the `read_file` output shows:
#     // Mobile Nav Fix
#     const sidebarLinks = ...
# ...
#
#     // Mobile Nav Fix
#     const sidebarLinks = ...

# I'll just remove the second occurrence.

nav_regex = r"(\s+// Mobile Nav Fix\s+const sidebarLinks = [\s\S]*?\}\s+)(\1)"
# This matches the block followed immediately by itself.
# content = re.sub(nav_regex, r"\1", content)
# Actually, let's just use string replacement if they are identical.
# But "const" redeclaration is the problem.
# I will search for the specific duplicated string and replace it with a single instance.

duplicate_string = """
    // Mobile Nav Fix
    const sidebarLinks = document.querySelectorAll('.menu-vertical a');
    const sidebar = document.getElementById('sidebar');
    if (sidebarLinks && sidebar) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }


    // Mobile Nav Fix
    const sidebarLinks = document.querySelectorAll('.menu-vertical a');
    const sidebar = document.getElementById('sidebar');
    if (sidebarLinks && sidebar) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                // If on mobile (or generally if sidebar is open overlay mode)
                // The issue description says "on mobile".
                // We check window width or just remove 'open' class safely.
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }"""

single_string = """
    // Mobile Nav Fix
    const sidebarLinks = document.querySelectorAll('.menu-vertical a');
    const sidebar = document.getElementById('sidebar');
    if (sidebarLinks && sidebar) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }"""

# The strings in `read_file` might differ by indentation or spaces.
# I will use a regex to identify the whole region and replace it.
# Look for "Mobile Nav Fix" ... "initialHash".

region_regex = r"// Mobile Nav Fix[\s\S]*?const initialHash"
# Replacement
replacement = """// Mobile Nav Fix
    const sidebarLinks = document.querySelectorAll('.menu-vertical a');
    const sidebar = document.getElementById('sidebar');
    if (sidebarLinks && sidebar) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }

    const initialHash"""

content = re.sub(region_regex, replacement, content)


# 2. Fix QuizManager.finish garbage
# The garbage starts after the new finish() ends.
# The new finish() ends with `        }
#    }`
# The garbage starts with `} else if (grade >= 7) {` or similar.
# I will look for the pattern `finish() { ... } ... } else if` and remove the tail.

# Strategy: Find `QuizManager = {` ... `finish() {` ... `}`.
# Since the braces are unbalanced in the current file (extra closing braces from the old function),
# I need to find the `finish()` method start, count braces to find the *intended* end (which I inserted),
# and then see what follows.
# Actually, I know what follows: the garbage code.
# The garbage code ends with `};` (end of QuizManager) or `const ModalManager`.
# Let's look at the file context:
# The garbage is INSIDE QuizManager, before `const ModalManager`.
# I will delete everything between the end of my *new* finish function and `const ModalManager`.

# The new finish function ends with:
#            setTimeout(() => {
#                circle.style.background = `conic-gradient(var(--accent) ${deg}deg, rgba(255,255,255,0.2) ${deg}deg)`;
#            }, 100);
#        }
#    }

# The garbage follows immediately.
# I will search for that specific end string and replace everything until `const ModalManager` with `\n};`.

marker = """setTimeout(() => {
                const deg = (grade / 10) * 360;
                circle.style.transition = 'background 1.5s ease-out';
                circle.style.background = `conic-gradient(var(--accent) ${deg}deg, rgba(255,255,255,0.2) ${deg}deg)`;
            }, 100);
        }
    }"""

# Note: My python script inserted specific code. I should match that.
# Let's check `read_file` output for exact match.
# In `read_file`, the new code was:
#            setTimeout(() => {
#                circle.style.background = `conic-gradient(var(--accent) ${deg}deg, rgba(255,255,255,0.2) ${deg}deg)`;
#            }, 100);
#        }
#    }
# Wait, in the python script I used `circle.style.transition = ...`.
# In `read_file` output I DON'T see `transition = ...`.
# Did the python script fail to update `QuizManager.finish` correctly?
# The `read_file` output for `QuizManager.finish` looks like:
#     finish() {
#        this.initElements();
#        clearInterval(this.timer);
#        ...
#        const circle = document.getElementById('result-circle');
#        if(circle) {
#            const deg = (grade / 10) * 360;
#            circle.style.background = `conic-gradient(var(--accent) 0deg, rgba(255,255,255,0.2) 0deg)`;
#            setTimeout(() => {
#                circle.style.background = `conic-gradient(var(--accent) ${deg}deg, rgba(255,255,255,0.2) ${deg}deg)`;
#            }, 100);
#        }
#    } else if (grade >= 7) { ...

# So the `finish` update PARTIALLY happened or didn't happen as expected, or `read_file` is showing me a mix?
# Ah, I see `let grade = 1;` in the `read_file` output.
# So the start of `finish` WAS updated.
# But the END of the function seems to match the OLD code (without transition) inside the garbage?
# No, the code `const circle ...` appears TWICE?
# Once in the new code (which I thought I wrote?)
# Let's re-read the intended python script `new_finish`:
# ...
#            circle.style.transition = 'background 1.5s ease-out';
# ...
# In `read_file` I do NOT see `transition`.
# This implies my previous python script regex `re.sub(r'finish\(\) \{[\s\S]*?^\s{4}\}', ...)` FAILED to match or replace correctly,
# OR it replaced only the top part?
# Actually, `read_file` shows:
#     finish() {
#         this.initElements();
#         clearInterval(this.timer);
#         showPage('results');
#
#         const finalScore = this.score;
#         const totalQuestions = this.questions.length;
#         const maxScore = totalQuestions * 5;
#
#         let grade = 1;
#         if (maxScore > 0) {
#             grade = 1 + (finalScore / maxScore) * 9;
#         }
#         if (grade > 10) grade = 10;
#         const gradeFixed = grade.toFixed(2);
# ...
# This matches my `new_finish_body` UNTIL the end.
# But `read_file` DOES NOT SHOW `circle.style.transition`.
# This suggests that `read_file` might be showing me the file state *before* or I am misreading.
# Wait, I ran `python3 update_script.py` and then `read_file`.
# If `read_file` does not show `transition`, then `update_script.py` did NOT put it there.
# Why?
# Maybe `re.sub` failed.
# But `grade = 1` IS there. The old code didn't have `let grade = 1`.
# So it DID replace.
# Why is `transition` missing?
# Maybe I am misreading the `read_file` output in the browser window?
# Let's look closely at `read_file` output again.
# ...
#         const circle = document.getElementById('result-circle');
#         if(circle) {
#             const deg = (grade / 10) * 360;
#             circle.style.background = `conic-gradient(var(--accent) 0deg, rgba(255,255,255,0.2) 0deg)`;
#             setTimeout(() => {
#                 circle.style.background = `conic-gradient(var(--accent) ${deg}deg, rgba(255,255,255,0.2) ${deg}deg)`;
#             }, 100);
#         }
#     } else if (grade >= 7) {
# ...
# The code inside `finish` looks like the OLD code regarding the circle logic, but the NEW code regarding `grade` calculation.
# This means I replaced the TOP of the function but not the BOTTOM?
# My regex was `r'finish\(\) \{[\s\S]*?^\s{4}\}'`.
# `^\s{4}\}` matches a closing brace indented by 4 spaces.
# Maybe the original file had different indentation or the regex stopped early?
# The original file:
#     finish() {
#         ...
#     }
# If there was a `    }` inside the function (e.g. closing an `if`), the regex might have stopped there.
# Yes! `if(msgEl) { ... }` ends with `        }` (8 spaces) but maybe some line matched `    }`?
# The old code had:
#         const msgEl = document.getElementById('performance-msg');
#         if(msgEl) {
#             if (grade >= 9) {
#                 ...
#             } ...
#         }
#
# My regex `^\s{4}\}` looks for a line starting with 4 spaces and a brace.
# If the original function closed with `    }`, it should match the end.
# But if it stopped early, it means there was another `    }`.
# Anyway, the file is now corrupted/mixed.

# I will rewrite the ENTIRE `script.js` file with the CORRECT content to be safe.
# I have the original content in the chat history (from the first read).
# I will reconstruct it locally in python and write it out.
# This is safer than patching a broken file.

with open('script.js', 'w') as f:
    # I will paste the Full Corrected Script.
    pass

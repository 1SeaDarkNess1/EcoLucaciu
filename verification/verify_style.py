from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # 1. Load the page
    page.goto("http://localhost:8080")
    page.wait_for_load_state("networkidle")

    # 2. Check Sidebar Styles
    sidebar = page.locator(".sidebar")

    # Get computed styles
    width = sidebar.evaluate("el => getComputedStyle(el).width")
    padding = sidebar.evaluate("el => getComputedStyle(el).padding")

    print(f"Sidebar Width: {width}")
    print(f"Sidebar Padding: {padding}")

    if width != "280px":
        print("FAIL: Sidebar width is not 280px")
    if padding != "20px":
        print("FAIL: Sidebar padding is not 20px")

    # Check Header h1
    header_h1 = page.locator(".sidebar-header h1")
    word_wrap = header_h1.evaluate("el => getComputedStyle(el).wordWrap")
    white_space = header_h1.evaluate("el => getComputedStyle(el).whiteSpace")

    print(f"Header WordWrap: {word_wrap}")
    print(f"Header WhiteSpace: {white_space}")

    # Check Footer
    footer = page.locator(".sidebar-footer")
    footer_fs = footer.evaluate("el => getComputedStyle(el).fontSize")
    print(f"Footer FontSize: {footer_fs}") # 0.85rem is approx 13.6px if base is 16px

    # 3. Check Material Viewer
    # Navigate to Materiale to ensure the viewer is in DOM (it's always in DOM but hidden/empty)
    # We need to trigger it to be visible or just check the style rule applied

    # Let's force the viewer to be visible or just check the class styles
    # The viewer is inside .material-viewer.
    viewer = page.locator(".material-viewer").first

    # We can check the computed style even if hidden, but better if we can verify the rule application.
    # Let's check the computed style.

    viewer_display = viewer.evaluate("el => getComputedStyle(el).display")
    viewer_flex_dir = viewer.evaluate("el => getComputedStyle(el).flexDirection")
    viewer_min_height = viewer.evaluate("el => getComputedStyle(el).minHeight")

    print(f"Viewer Display: {viewer_display}")
    print(f"Viewer FlexDir: {viewer_flex_dir}")
    print(f"Viewer MinHeight: {viewer_min_height}")

    # Check iframe styles (might not be present if no lesson loaded, but we can check if we inject one or checks rules)
    # We can inject a dummy iframe to test the selector
    page.evaluate("""() => {
        const viewer = document.querySelector('.material-viewer');
        viewer.innerHTML = '<iframe id="test-iframe"></iframe>';
    }""")

    iframe = page.locator("#test-iframe")
    iframe_min_height = iframe.evaluate("el => getComputedStyle(el).minHeight")
    iframe_width = iframe.evaluate("el => getComputedStyle(el).width")

    print(f"Iframe MinHeight: {iframe_min_height}")
    print(f"Iframe Width: {iframe_width}")

    # Take screenshot of the sidebar area and viewer area
    page.screenshot(path="verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

from playwright.sync_api import sync_playwright
import time
import os

def run():
    os.makedirs("/home/jules/verification", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Desktop
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto("http://localhost:8080")
        time.sleep(2) # Wait for load

        # Sidebar Screenshot
        page.screenshot(path="/home/jules/verification/desktop_sidebar.png")

        # Open Viewer (Lesson)
        # We need to make sure data is loaded.
        # Let's try to navigate to 'Materiale' first
        page.evaluate("showPage('materiale')")
        time.sleep(1)
        # Now try to open first lesson
        # We can find a chapter card and click it, or use JS
        # Let's use JS for reliability if elements are generated
        try:
            page.evaluate("openLesson(0)")
            time.sleep(2)
            page.screenshot(path="/home/jules/verification/desktop_viewer.png")
        except Exception as e:
            print(f"Error opening lesson: {e}")

        # Mobile
        page_mobile = browser.new_page(viewport={'width': 375, 'height': 667})
        page_mobile.goto("http://localhost:8080")
        time.sleep(2)

        # Open Sidebar
        # Ensure mobile toggle is visible
        if page_mobile.is_visible("#mobile-toggle"):
            page_mobile.click("#mobile-toggle")
            time.sleep(1)
            page_mobile.screenshot(path="/home/jules/verification/mobile_sidebar.png")
        else:
            print("Mobile toggle not found")

        browser.close()

if __name__ == "__main__":
    run()

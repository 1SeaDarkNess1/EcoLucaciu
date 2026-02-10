import os
import time
from playwright.sync_api import sync_playwright

def verify_glass_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Navigate
        page.goto("http://localhost:8000")
        time.sleep(1) # Let animations settle

        # Take Home Screenshot
        page.screenshot(path="verification/home_glass.png")
        print("Captured home_glass.png")

        # Navigate to Materials
        page.evaluate("showPage('materiale')")
        time.sleep(1)
        page.screenshot(path="verification/materials_glass.png")
        print("Captured materials_glass.png")

        # Navigate to Quiz Dashboard
        page.evaluate("showPage('grila')")
        time.sleep(1)
        page.screenshot(path="verification/quiz_glass.png")
        print("Captured quiz_glass.png")

        # Start Quiz (General)
        # Assuming startQuiz('general') works and shows #quiz section
        page.evaluate("startQuiz('general')")
        time.sleep(1)
        page.screenshot(path="verification/quiz_active_glass.png")
        print("Captured quiz_active_glass.png")

        # Mobile View
        context_mobile = browser.new_context(viewport={'width': 375, 'height': 667})
        page_mobile = context_mobile.new_page()
        page_mobile.goto("http://localhost:8000")
        time.sleep(1)

        # Open Sidebar on Mobile
        # Assuming #mobile-toggle is visible
        if page_mobile.is_visible("#mobile-toggle"):
            page_mobile.click("#mobile-toggle")
            time.sleep(0.5) # Transition
            page_mobile.screenshot(path="verification/mobile_sidebar_glass.png")
            print("Captured mobile_sidebar_glass.png")
        else:
            print("Mobile toggle not visible")

        browser.close()

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")
    verify_glass_ui()

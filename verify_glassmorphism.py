from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        # Navigate to home
        page.goto("http://localhost:8080")
        time.sleep(2) # Wait for animations/mesh to load

        # Screenshot Home
        page.screenshot(path="home_glass.png")

        # Hover over a card to trigger effect
        page.hover(".nav-card:first-child")
        time.sleep(0.5)
        page.screenshot(path="home_card_hover.png")

        # Open University Modal to check Glass Modal
        # Click on "Admitere" to go there or just find the modal trigger if accessible
        # The modal is triggered by `openUni` but that's in JS.
        # Let's navigate to 'Admitere' section first
        page.click("a[href='#admitere']")
        time.sleep(1)
        page.screenshot(path="admitere_section.png")

        # We can also execute JS to force open a modal for testing
        page.evaluate("document.getElementById('uni-modal').classList.remove('hidden')")
        page.evaluate("document.getElementById('modal-body').innerHTML = '<h1>Glass Modal Test</h1><p>Checking background blur and border.</p>'")
        time.sleep(0.5)
        page.screenshot(path="modal_glass.png")

        browser.close()

if __name__ == "__main__":
    run()

from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        print("Navigating to Grile...")
        page.goto('http://localhost:8000/index.html')
        page.evaluate("showPage('grila')")
        time.sleep(1)
        page.screenshot(path='grile_page_v2.png')

        browser.close()

if __name__ == '__main__':
    run()

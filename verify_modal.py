from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:8000/index.html")

    # Wait for page load
    time.sleep(1)

    # Click 'Admitere' in navbar to show the section
    page.click("text=Admitere")

    # Wait for section to be visible
    page.wait_for_selector("#admitere.active")

    # Wait for cards to be generated
    page.wait_for_selector("#uni-grid .nav-card")

    cards = page.locator("#uni-grid .nav-card")
    if cards.count() == 0:
        print("No cards found in #uni-grid")
        return

    card = cards.first

    # Focus it
    card.focus()
    time.sleep(0.5)

    # Check focus
    focused_class = page.evaluate("document.activeElement.className")
    print(f"Focused element class: {focused_class}")

    # Screenshot of focused card
    page.screenshot(path="verification_card_focus.png")
    print("Captured verification_card_focus.png")

    # Open modal via keyboard
    page.keyboard.press("Enter")

    # Wait for modal to appear (be visible)
    page.wait_for_selector("#uni-modal:not(.hidden)")
    time.sleep(0.5)

    # Check focus
    focused_id = page.evaluate("document.activeElement.id")
    print(f"Focused element ID: {focused_id}")

    if focused_id == "modal-close-btn":
        print("SUCCESS: Focus moved to close button.")
    else:
        print(f"ERROR: Focus is on '{focused_id}', expected 'modal-close-btn'")

    # Screenshot of modal
    page.screenshot(path="verification_modal_open.png")
    print("Captured verification_modal_open.png")

    # Close via Escape
    page.keyboard.press("Escape")

    # Wait for modal to be hidden
    page.wait_for_selector("#uni-modal", state="hidden")
    time.sleep(0.5)

    # Check focus restoration
    restored_class = page.evaluate("document.activeElement.className")
    print(f"Restored focus element class: {restored_class}")

    if "nav-card" in restored_class:
        print("SUCCESS: Focus restored to card.")
    else:
        print(f"ERROR: Focus NOT restored to card. Current: {restored_class}")

    # Screenshot after close
    page.screenshot(path="verification_modal_closed.png")
    print("Captured verification_modal_closed.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

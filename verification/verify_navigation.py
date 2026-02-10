from playwright.sync_api import sync_playwright, expect

def test_navigation(page):
    page.set_viewport_size({"width": 1280, "height": 1024})
    page.goto("http://localhost:8000")

    # Wait for the page to load and cache to initialize
    page.wait_for_load_state("networkidle")

    # Click on 'Materiale' link
    page.click("a[href='#materiale']", force=True)
    expect(page.locator("#materiale")).to_have_class(r"view active")

    # Click on 'Grile' link
    page.click("a[href='#grila']", force=True)
    expect(page.locator("#grila")).to_have_class(r"view active")

    # Take a screenshot
    page.screenshot(path="verification/navigation_to_grila.png")
    print("Verification successful")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_navigation(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/failure.png")
        finally:
            browser.close()

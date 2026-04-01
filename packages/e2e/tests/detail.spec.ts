import { test, expect } from "@playwright/test";

test.describe("Product detail page", () => {
  test("D1–D7: detail page assertions", async ({ page }) => {
    // Navigate to listing and resolve first product URL dynamically
    let productUrl: string;

    await test.step("Navigate from listing to detail page", async () => {
      await page.goto("/");

      // Find first link whose href contains /products/
      const firstProductLink = page
        .getByRole("link")
        .filter({ hasText: /.+/ })
        .and(page.locator('a[href*="/products/"]'))
        .first();

      const href = await firstProductLink.getAttribute("href");
      if (!href) throw new Error("No product link found on listing page");

      // D1: HTTP response for the detail page is 200
      const [response] = await Promise.all([
        page.waitForResponse((resp) => resp.url().includes("/products/")),
        firstProductLink.click(),
      ]);

      expect(response.status(), "D1: detail page HTTP status should be 200").toBe(200);

      productUrl = page.url();
    });

    // D2: A visible <h1> containing the product name is present
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading, "D2: product name h1 should be visible").toBeVisible();

    // D3: A price string matching /\$[\d,.]+/ is visible
    const price = page.getByText(/\$[\d,.]+/);
    await expect(price.first(), "D3: price should be visible").toBeVisible();

    // D4: "Add to Cart" button is present and enabled
    const addToCartButton = page.getByRole("button", { name: /add to cart/i });
    await expect(addToCartButton, "D4: Add to Cart button should be visible and enabled").toBeEnabled();

    // D5: Clicking "Add to Cart" does NOT change the current URL
    const urlBefore = page.url();
    await addToCartButton.click();
    const urlAfter = page.url();
    expect(urlAfter, "D5: URL should not change after clicking Add to Cart").toBe(urlBefore);

    // D6: After clicking "Add to Cart", visible feedback appears:
    //     either text matching /added to cart/i OR nav cart indicator shows count > 0
    const feedbackLocator = page.getByText(/added to cart/i);
    const cartCountLocator = page
      .getByRole("navigation")
      .getByText(/^[1-9]\d*$/);

    await expect(
      feedbackLocator.or(cartCountLocator),
      "D6: feedback text or cart count should be visible after add"
    ).toBeVisible();

    // D7: Nav cart count increments to >= 1
    const navCartCount = page
      .getByRole("navigation")
      .getByText(/^[1-9]\d*$/);

    await expect(navCartCount, "D7: nav cart count should be >= 1").toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Product detail page", () => {
  test("D1–D7: detail page assertions", async ({ page }) => {
    let productUrl: string;

    await test.step("Navigate from listing to detail page", async () => {
      await page.goto("/");

      // Find the first product link by inspecting href attributes on role="link" elements.
      // getAttribute("href") is structural metadata — not a CSS class or data-testid.
      const allLinks = page.getByRole("link");
      const linkCount = await allLinks.count();

      let firstProductIndex = -1;
      for (let i = 0; i < linkCount; i++) {
        const href = await allLinks.nth(i).getAttribute("href");
        if (href?.includes("/products/")) {
          firstProductIndex = i;
          break;
        }
      }

      if (firstProductIndex === -1) {
        throw new Error("No product link found on listing page");
      }

      const firstProductLink = allLinks.nth(firstProductIndex);

      // D1: HTTP response for the detail page is 200
      const [detailResponse] = await Promise.all([
        page.waitForResponse(
          (resp) =>
            resp.url().includes("/products/") &&
            resp.request().resourceType() === "document",
        ),
        firstProductLink.click(),
      ]);

      expect(
        detailResponse.status(),
        "D1: detail page HTTP status should be 200",
      ).toBe(200);

      productUrl = page.url();
    });

    // Suppress unused-variable warning — productUrl records navigation target for context.
    void productUrl!;

    // D2: A visible <h1> containing the product name is present
    const heading = page.getByRole("heading", { level: 1 });
    await expect(
      heading,
      "D2: product name h1 should be visible",
    ).toBeVisible();

    // D3: A price string matching /\$[\d,.]+/ is visible
    const price = page.getByText(/\$[\d,.]+/);
    await expect(price.first(), "D3: price should be visible").toBeVisible();

    // D4: "Add to Cart" button is present and enabled (not disabled)
    const addToCartButton = page.getByRole("button", { name: /add to cart/i });
    await expect(
      addToCartButton,
      "D4: Add to Cart button should be enabled",
    ).toBeEnabled();

    // D5: Clicking "Add to Cart" does NOT change the current URL
    const urlBefore = page.url();
    await addToCartButton.click();
    const urlAfter = page.url();
    expect(
      urlAfter,
      "D5: URL should not change after clicking Add to Cart",
    ).toBe(urlBefore);

    // D6: After clicking "Add to Cart", visible feedback appears:
    //     text matching /added to cart/i AND the nav cart indicator shows a count > 0
    const feedbackLocator = page.getByText(/added to cart/i);
    const cartCountLocator = page
      .getByRole("navigation")
      .getByText(/^[1-9]\d*$/);

    await expect(
      feedbackLocator.and(cartCountLocator),
      "D6: feedback text and cart count should be visible after add",
    ).toBeVisible();

    // D7: Nav cart count increments to >= 1
    const navCartCount = page.getByRole("navigation").getByText(/^[1-9]\d*$/);

    await expect(
      navCartCount,
      "D7: nav cart count should be >= 1",
    ).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Product listing page", () => {
  test("L1–L8: listing page assertions", async ({ page }) => {
    // L1: GET / returns HTTP 200
    await test.step("L1: GET / returns HTTP 200", async () => {
      const response = await page.goto("/");
      expect(response?.status()).toBe(200);
    });

    // L2: At least 1 product card is visible
    await test.step("L2: at least one product card is visible", async () => {
      const firstCard = page
        .locator('[role="article"], [role="listitem"]')
        .first();
      await expect(firstCard).toBeVisible();
    });

    // Gather first 3 visible cards for L3–L5
    const cards = page.locator('[role="article"], [role="listitem"]');
    const cardCount = Math.min(await cards.count(), 3);

    // L3: Each visible card contains a heading (product name)
    await test.step("L3: first 3 cards each contain a heading", async () => {
      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        const heading = card.getByRole("heading");
        await expect(heading).toBeVisible();
      }
    });

    // L4: Each visible card contains a price string matching /$[\d,.]+/
    await test.step("L4: first 3 cards each contain a price (/$[\\d,.]+/)", async () => {
      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        const price = card.getByText(/\$[\d,.]+/);
        await expect(price).toBeVisible();
      }
    });

    // L5: Each card has a link whose href contains /products/
    await test.step("L5: first 3 cards each have a link to /products/", async () => {
      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        const link = card.getByRole("link");
        await expect(link).toHaveAttribute("href", /\/products\//);
      }
    });

    // L6: Navigation contains a link matching /cart/i
    await test.step("L6: navigation contains a cart link", async () => {
      await expect(page.getByRole("link", { name: /cart/i })).toBeVisible();
    });

    // L7: Page does NOT show empty-cart text
    await test.step("L7: listing page does not show empty-cart text", async () => {
      await expect(page.getByText(/your cart is empty/i)).not.toBeVisible();
    });

    // L8: Clicking the first product card link navigates to a /products/ URL
    await test.step("L8: clicking first product link navigates to /products/ URL", async () => {
      const firstCard = cards.first();
      const firstLink = firstCard.getByRole("link");
      await firstLink.click();
      await expect(page).toHaveURL(/\/products\//);
    });
  });
});

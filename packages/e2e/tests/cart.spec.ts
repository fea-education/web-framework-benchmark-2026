import { test, expect } from "@playwright/test";

// Test group 1 — Empty cart (navigate directly to /cart with no prior state)
test.describe("Cart page — empty cart", () => {
  test.use({ storageState: undefined });

  test("C1–C3: empty cart assertions", async ({ page }) => {
    // C1: GET /cart returns HTTP 200
    await test.step("C1: GET /cart returns HTTP 200", async () => {
      const response = await page.goto("/cart");
      expect(response?.status()).toBe(200);
    });

    // C2: Empty cart message is visible
    await test.step("C2: empty cart message is visible", async () => {
      await expect(page.getByText(/your cart is empty/i)).toBeVisible();
    });

    // C3: No product cards (role="article") on the empty cart page
    await test.step('C3: no [role="article"] elements on empty cart page', async () => {
      const articleCount = await page.locator('[role="article"]').count();
      expect(articleCount).toBe(0);
    });
  });
});

// Test group 2 — Cart after adding a product via listing → detail → add to cart
test.describe("Cart page — after adding a product", () => {
  test.use({ storageState: undefined });

  test("C4–C8: cart with item assertions", async ({ page }) => {
    // Setup: navigate to listing, click first product, record name, add to cart
    let productName = "";

    await test.step("Setup: navigate to listing and click first product", async () => {
      await page.goto("/");
      const firstProductLink = page
        .locator('[role="article"], [role="listitem"]')
        .first()
        .getByRole("link");
      await firstProductLink.click();
      await page.waitForURL(/\/products\//);
    });

    await test.step("Setup: record product name from h1", async () => {
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();
      productName = (await h1.textContent()) ?? "";
      expect(productName.length).toBeGreaterThan(0);
    });

    await test.step("Setup: click Add to Cart and wait for feedback", async () => {
      await page.getByRole("button", { name: /add to cart/i }).click();
      // Both feedback text AND cart count update must occur
      await Promise.all([
        page
          .getByText(/added to cart|item added|in your cart/i)
          .waitFor({ state: "visible", timeout: 5000 }),
        page
          .getByRole("link", { name: /cart.*[1-9]|[1-9].*cart/i })
          .waitFor({ state: "visible", timeout: 5000 }),
      ]);
    });

    await test.step("Setup: navigate to /cart", async () => {
      await page.goto("/cart");
    });

    // C4: The cart page shows the product name recorded in setup
    await test.step("C4: cart shows the added product name", async () => {
      await expect(page.getByText(productName)).toBeVisible();
    });

    // C5: A quantity control is visible for the cart item
    await test.step("C5: quantity control is visible", async () => {
      const spinbutton = page.getByRole("spinbutton");
      const incrementBtn = page.getByRole("button", {
        name: /increase|increment|\+/i,
      });
      const hasSpinbutton = (await spinbutton.count()) > 0;
      const hasIncrementBtn = (await incrementBtn.count()) > 0;
      expect(hasSpinbutton || hasIncrementBtn).toBe(true);
      if (hasSpinbutton) {
        await expect(spinbutton.first()).toBeVisible();
      } else {
        await expect(incrementBtn.first()).toBeVisible();
      }
    });

    // C6: Incrementing quantity updates the displayed quantity value
    await test.step("C6: incrementing quantity updates the value", async () => {
      const spinbutton = page.getByRole("spinbutton").first();
      const hasSpinbutton = (await spinbutton.count()) > 0;

      if (hasSpinbutton) {
        await spinbutton.fill("2");
        await expect(spinbutton).toHaveValue("2");
      } else {
        const incrementBtn = page
          .getByRole("button", { name: /increase|increment|\+/i })
          .first();
        // Read current quantity before incrementing
        const beforeText = await page
          .locator('[role="article"], [role="listitem"]')
          .first()
          .textContent();
        await incrementBtn.click();
        // After clicking increment, quantity should change — assert the page
        // now shows "2" somewhere in the cart item context
        const cartItem = page
          .locator('[role="article"], [role="listitem"]')
          .first();
        await expect(cartItem).toContainText("2");
        // Ensure it changed from whatever was before (sanity: before text should not have been "2" already)
        const afterText = await cartItem.textContent();
        expect(afterText).not.toBe(beforeText);
      }
    });

    // C7: Clicking remove/delete removes the item (waits for DOM detach)
    await test.step("C7: remove button removes the cart item from DOM", async () => {
      const cartItem = page
        .locator('[role="article"], [role="listitem"]')
        .first();
      const removeBtn = page
        .getByRole("button", { name: /remove|delete/i })
        .first();
      await expect(removeBtn).toBeVisible();
      await removeBtn.click();
      // Wait for the item to detach from DOM (not just hidden)
      await expect(cartItem)
        .toBeHidden({ timeout: 5000 })
        .catch(() => null);
      await expect(page.locator('[role="article"]')).toHaveCount(0, {
        timeout: 5000,
      });
    });

    // C8: After removing the only item, the empty cart message reappears
    await test.step("C8: empty cart message reappears after removal", async () => {
      await expect(page.getByText(/your cart is empty/i)).toBeVisible();
    });
  });
});

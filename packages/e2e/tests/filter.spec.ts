import { test, expect } from "@playwright/test";

test.describe("Filter page", () => {
  test("F1–F6: filter page assertions", async ({ page }) => {
    // F1: GET /filter returns HTTP 200
    await test.step("F1: GET /filter returns HTTP 200", async () => {
      const response = await page.goto("/filter");
      expect(response?.status()).toBe(200);
    });

    // F2: At least 1 product card is visible on initial load
    await test.step(
      "F2: at least one product card is visible on initial load",
      async () => {
        const firstCard = page
          .locator('[role="article"], [role="listitem"]')
          .first();
        await expect(firstCard).toBeVisible();
      }
    );

    const cards = page.locator('[role="article"], [role="listitem"]');
    const initialCount = await cards.count();

    // F3: A category filter control is present (combobox, listbox, or radiogroup)
    await test.step(
      "F3: a category filter control is present",
      async () => {
        const combobox = page.getByRole("combobox");
        const listbox = page.getByRole("listbox");
        const radiogroup = page.getByRole("radiogroup");

        const comboboxCount = await combobox.count();
        const listboxCount = await listbox.count();
        const radiogroupCount = await radiogroup.count();

        expect(
          comboboxCount + listboxCount + radiogroupCount,
          "Expected at least one of: combobox, listbox, or radiogroup"
        ).toBeGreaterThan(0);
      }
    );

    // F4: Selecting a category reduces the visible product count
    await test.step(
      "F4: selecting a category reduces visible product count",
      async () => {
        // Try combobox first, then listbox, then radiogroup
        const combobox = page.getByRole("combobox");
        const comboboxCount = await combobox.count();

        if (comboboxCount > 0) {
          // Use the first combobox — select the first non-placeholder option
          const firstCombobox = combobox.first();
          const options = firstCombobox.locator("option");
          const optionCount = await options.count();
          // Skip index 0 in case it's a "All" / placeholder option
          const targetIndex = optionCount > 1 ? 1 : 0;
          const targetValue = await options.nth(targetIndex).getAttribute("value");
          if (targetValue) {
            await firstCombobox.selectOption(targetValue);
          }
        } else {
          // Try radiogroup: click first radio button that isn't already selected
          const radiogroup = page.getByRole("radiogroup").first();
          const radios = radiogroup.getByRole("radio");
          const radioCount = await radios.count();
          // Click second radio if available (first may be "All"), otherwise first
          const targetRadio = radioCount > 1 ? radios.nth(1) : radios.first();
          await targetRadio.click();
        }

        // Wait for DOM to stabilise after filter interaction
        await page.waitForTimeout(300);

        const filteredCount = await cards.count();
        expect(
          filteredCount,
          `Expected filtered count (${filteredCount}) to be less than initial count (${initialCount})`
        ).toBeLessThan(initialCount);
        expect(
          filteredCount,
          "Expected at least one product to remain after filtering"
        ).toBeGreaterThanOrEqual(1);
      }
    );

    // Navigate back to /filter to reset state for F5/F6
    await page.goto("/filter");
    await page
      .locator('[role="article"], [role="listitem"]')
      .first()
      .waitFor({ state: "visible" });
    const countBeforePrice = await cards.count();

    // F5: A price range input is present
    await test.step("F5: a price range input is present", async () => {
      const rangeInput = page.locator('input[type="range"]');
      const slider = page.getByRole("slider");

      const rangeCount = await rangeInput.count();
      const sliderCount = await slider.count();

      expect(
        rangeCount + sliderCount,
        "Expected at least one price range input (input[type=range] or role=slider)"
      ).toBeGreaterThan(0);
    });

    // F6: Setting price range to minimum hides products
    await test.step(
      "F6: setting price range to minimum hides previously visible products",
      async () => {
        const rangeInput = page.locator('input[type="range"]').first();
        const rangeCount = await rangeInput.count();

        if (rangeCount > 0) {
          // Fill with "0" to set to minimum value
          await rangeInput.fill("0");
          await rangeInput.dispatchEvent("input");
          await rangeInput.dispatchEvent("change");
        } else {
          // Fall back to role=slider
          const slider = page.getByRole("slider").first();
          await slider.fill("0");
          await slider.dispatchEvent("input");
          await slider.dispatchEvent("change");
        }

        // Wait for DOM to stabilise after price filter interaction
        await page.waitForTimeout(300);

        const countAfterPrice = await cards.count();
        expect(
          countAfterPrice,
          `Expected price-filtered count (${countAfterPrice}) to be less than pre-filter count (${countBeforePrice})`
        ).toBeLessThan(countBeforePrice);
      }
    );
  });
});

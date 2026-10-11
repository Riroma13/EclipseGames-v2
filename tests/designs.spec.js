import { test, expect } from "@playwright/test";
const designs = ["mesa", "cuaderno", "signal", "atlas"];
test("catálogo y cambio de diseño conservan las observaciones demo", async ({
  page,
}) => {
  await page.goto("/?gallery=1");
  await expect(page.getByRole("button", { name: /Probar / })).toHaveCount(4);
  await page.getByRole("button", { name: "Probar Cuaderno de campo" }).click();
  await page.getByRole("button", { name: "Entrar a la demo" }).click();
  await page
    .getByRole("button", { name: "Abrir ficha de Alba Martín" })
    .click();
  await page
    .getByRole("button", { name: "Comunicación: registrar 2 XP base" })
    .click();
  await expect(page.locator(".toast")).toContainText("+2 XP base");
  await page
    .getByRole("combobox", { name: "Elegir diseño" })
    .selectOption("signal");
  await expect(page.locator("html")).toHaveAttribute("data-design", "signal");
  await expect(page.locator(".xp-summary")).toContainText("2");
  await page
    .getByRole("combobox", { name: "Elegir diseño" })
    .selectOption("atlas");
  await expect(page.locator(".xp-summary")).toContainText("2");
  await page.getByRole("button", { name: "Deshacer", exact: true }).click();
  await expect(page.locator(".toast")).toContainText("Registro deshecho");
});
for (const design of designs)
  test(`${design}: módulos navegables y diseño móvil`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/?design=${design}`);
    await page.getByRole("button", { name: "Entrar a la demo" }).click();
    await expect(
      page.getByRole("button", { name: /Abrir ficha de/ }),
    ).toHaveCount(30);
    await page.setViewportSize({ width: 390, height: 844 });
    for (const module of [
      "rt",
      "evaluation",
      "avatars",
      "broadcasts",
      "organization",
      "history",
      "settings",
    ]) {
      await page
        .getByRole("combobox", { name: "Cambiar sección" })
        .selectOption(module);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${design}/${module}`,
      ).toBe(true);
    }
    await page
      .getByRole("combobox", { name: "Cambiar sección" })
      .selectOption("classroom");
    await expect(page.locator(".island")).toBeVisible();
    await expect(page.locator(".island")).not.toContainText("Alba Martín");
    expect(errors).toEqual([]);
  });

import { test, expect } from "@playwright/test";

test("docente busca, registra, corrige y mantiene aislamiento entre grupos", async ({
  page,
}) => {
  await page.goto("/?design=mesa");
  await page.getByRole("button", { name: "Entrar a la demo" }).click();
  await expect(
    page.getByRole("button", { name: /Abrir ficha de/ }),
  ).toHaveCount(30);
  await page.getByRole("searchbox", { name: "Buscar alumno" }).fill("ines");
  await expect(
    page.getByRole("button", { name: /Abrir ficha de/ }),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "Abrir ficha de Inés Gil" }).click();
  await page
    .getByRole("button", { name: "Comunicación: registrar 2 XP base" })
    .click();
  await expect(
    page.getByRole("button", { name: "Precisión: registrar 1 XP base" }),
  ).toBeDisabled();
  await expect(page.locator(".toast")).toContainText("+2 XP base");
  await expect(page.getByText("2 XP base", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Deshacer", exact: true }).click();
  await expect(page.locator(".toast")).toContainText("Registro deshecho");
  await expect(page.getByText("Corregido · registro deshecho")).toBeVisible();
  await expect(page.getByText("Sin registro", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Herramientas de prueba" }).click();
  await page
    .getByRole("checkbox", { name: "Simular error en el próximo registro XP" })
    .check();
  await page
    .getByRole("button", { name: "Precisión: registrar 1 XP base" })
    .click();
  await expect(page.getByRole("alert")).toContainText("No se ha registrado");
  await expect(page.getByText("Sin registro", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Precisión: registrar 1 XP base" })
    .click();
  await expect(page.locator(".toast")).toContainText("+1 XP base");
  await page.getByRole("combobox", { name: "Grupo activo" }).selectOption("b");
  await expect(
    page.getByRole("button", { name: /Abrir ficha de/ }),
  ).toHaveCount(30);
  await expect(page.getByText("Una observación")).toBeVisible();
  await expect(page.getByText("1 XP base", { exact: true })).toHaveCount(0);
  await page.getByRole("combobox", { name: "Grupo activo" }).selectOption("a");
  await expect(page.getByText("1 XP base", { exact: true })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Entrar a la demo" }),
  ).toBeVisible();
});

test("tablet: búsqueda vacía, teclado y panel sin desbordamiento", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/?design=mesa");
  await page.getByRole("button", { name: "Entrar a la demo" }).click();
  await page
    .getByRole("searchbox", { name: "Buscar alumno" })
    .fill("nadie aquí");
  await expect(page.getByText("No encontramos ese alumno")).toBeVisible();
  await page.getByRole("button", { name: "Ver todo el grupo" }).click();
  const student = page.getByRole("button", {
    name: "Abrir ficha de Alba Martín",
  });
  await student.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Comunicación: registrar 1 XP base" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(student).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await student.click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

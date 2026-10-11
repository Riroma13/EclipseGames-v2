import { test, expect } from "@playwright/test";
const enter = async (page) => {
  await page.goto("/?design=mesa");
  await page.getByRole("button", { name: "Entrar a la demo" }).click();
};
const navigate = async (page, name) =>
  page
    .getByRole("navigation", { name: "Secciones", exact: true })
    .getByRole("button", { name, exact: true })
    .click();

test("RT: sesión manual, ausencia y corrección del lote", async ({ page }) => {
  await enter(page);
  await navigate(page, "Tareas · RT");
  await expect(page.getByRole("button", { name: "Guardar RT" })).toBeDisabled();
  await page
    .getByRole("button", { name: "Comenzar sesión" })
    .filter({ visible: true })
    .click();
  await page.getByRole("button", { name: "Asignar 10 a todos" }).click();
  await page
    .getByRole("combobox", { name: "RT de Alba Martín" })
    .selectOption("A");
  await page.getByRole("button", { name: "Guardar RT" }).click();
  await expect(page.getByRole("status")).toContainText("RT guardado");
  await expect(
    page.getByRole("combobox", { name: "RT de Alba Martín" }),
  ).toHaveValue("A");
  await page.getByRole("button", { name: "Deshacer guardado" }).click();
  await expect(
    page.getByRole("combobox", { name: "RT de Alba Martín" }),
  ).toHaveValue("");
  await page
    .getByRole("button", { name: "Finalizar sesión" })
    .filter({ visible: true })
    .click();
  await expect(page.getByRole("button", { name: "Guardar RT" })).toBeDisabled();
});

test("rúbrica: elección docente, cierre y reapertura conservan snapshot", async ({
  page,
}) => {
  await enter(page);
  await navigate(page, "Evaluación");
  for (const category of [
    "Comunicación",
    "Precisión",
    "Constancia",
    "Colaboración",
  ])
    await page
      .getByRole("button", { name: `${category}, nivel 3`, exact: true })
      .click();
  await page
    .getByRole("button", { name: "Cerrar evaluación", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirmar cierre" }).click();
  await expect(
    page.getByRole("button", { name: "Comunicación, nivel 3", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Reabrir explícitamente" }).click();
  await page
    .getByRole("textbox", { name: "Motivo de reapertura" })
    .fill("Revisión docente demo");
  await page.getByRole("button", { name: "Confirmar reapertura" }).click();
  await expect(
    page.getByRole("button", { name: "Comunicación, nivel 3", exact: true }),
  ).toBeEnabled();
  await expect(page.getByText(/1 snapshot\(s\) conservados/)).toBeVisible();
});

test("boutique: compra, equipar sin doble cobro y reversión", async ({
  page,
}) => {
  await enter(page);
  await navigate(page, "Avatares y gemas");
  const radio = page
    .locator(".cosmetic-card")
    .filter({ has: page.getByRole("heading", { name: "Radio Éclipse" }) });
  await radio.getByRole("button", { name: "Comprar", exact: true }).click();
  await expect(page.locator(".gem-balances")).toContainText("3");
  await radio.getByRole("button", { name: "Equipar", exact: true }).click();
  await expect(page.locator(".gem-balances")).toContainText("3");
  await page.getByRole("button", { name: "Revertir compra" }).click();
  await expect(page.locator(".gem-balances")).toContainText("4");
  await page.getByRole("button", { name: "Personalizar avatar base" }).click();
  await page.getByRole("button", { name: "Apariencia base 3" }).click();
  await page.getByRole("button", { name: "Guardar avatar base" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Identidad base demo guardada",
  );
});

test("Retransmisión: vídeo antes del desafío, aula privada y retirada", async ({
  page,
}) => {
  await enter(page);
  await navigate(page, "Retransmisiones");
  await page
    .locator(".broadcast-card")
    .first()
    .getByRole("button", { name: "Abrir Retransmisión" })
    .click();
  await expect(page.getByRole("button", { name: "VER DESAFÍO" })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "Simular fin del vídeo" }).click();
  await page.getByRole("button", { name: "VER DESAFÍO" }).click();
  await page.getByRole("button", { name: "Abrir Modo Aula" }).click();
  await expect(page.locator(".island")).not.toContainText("Alba Martín");
  await expect(page.locator(".aula-agents button")).toHaveCount(30);
  await page
    .getByRole("button", { name: "Mostrar Éclipse 01", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Éclipse 01");
  await expect(page.getByRole("dialog")).not.toContainText("Martín");
  await page.getByRole("button", { name: "Retirar de la pantalla" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("tablet: navegación por módulos y equipos sin duplicados", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await enter(page);
  await page
    .getByRole("combobox", { name: "Cambiar sección" })
    .selectOption("organization");
  await page.getByRole("button", { name: "Generar equipos" }).click();
  const aliases = await page
    .locator(".team-grid article span")
    .allTextContents();
  expect(aliases).toHaveLength(30);
  expect(new Set(aliases).size).toBe(30);
  await page.getByRole("button", { name: "Mantener equipos" }).click();
  await expect(
    page.getByRole("button", { name: "Volver a sortear" }),
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("Show Student expira y todos los módulos son navegables en móvil", async ({
  page,
}) => {
  await page.clock.install();
  await enter(page);
  await navigate(page, "Modo Aula");
  await page
    .getByRole("button", { name: "Mostrar Éclipse 01", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.clock.fastForward(121000);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Volver a la mesa docente" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const module of [
    "rt",
    "evaluation",
    "avatars",
    "broadcasts",
    "organization",
    "history",
    "behaviour",
    "settings",
  ]) {
    await page
      .getByRole("combobox", { name: "Cambiar sección" })
      .selectOption(module);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      module,
    ).toBe(true);
  }
});

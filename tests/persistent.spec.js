import { test, expect } from "@playwright/test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { openStore } from "../server/store.mjs";
import { createApi } from "../server/api.mjs";
let server, db, dir;
const password = randomUUID() + randomUUID();
test.beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), "eclipse-browser-"));
  const path = join(dir, "data.sqlite");
  execFileSync(process.execPath, ["server/bootstrap.mjs", "--demo"], {
    env: {
      ...process.env,
      ECLIPSE_DB: path,
      ECLIPSE_TEACHER_EMAIL: "browser@example.test",
      ECLIPSE_TEACHER_PASSWORD: password,
    },
  });
  db = openStore(path);
  server = createApi(db);
  await new Promise((r) => server.listen(3001, "127.0.0.1", r));
});
test.afterAll(async () => {
  await new Promise((r) => server.close(r));
  db.close();
  rmSync(dir, { recursive: true, force: true });
});
const enter = async (page) => {
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Correo", exact: true })
    .fill("browser@example.test");
  await page.getByLabel("Contraseña", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Grupo activo" })
    .selectOption({ index: 1 });
  await expect(page.locator(".session-control")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Cambiar sección", exact: true })
    .getByRole("button", { name: "Tareas · RT", exact: true })
    .click();
};
test("Atlas persistente: recarga, deshacer, fin y nueva sesión aislada", async ({
  page,
}) => {
  await enter(page);
  await page.getByRole("button", { name: "Comenzar sesión" }).click();
  await page.getByRole("button", { name: "Asignar 10 a todos" }).click();
  const first = page.locator(".rt-table-row select").first();
  await first.selectOption("A");
  await page.getByRole("button", { name: "Guardar RT", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("RT guardado.");
  await page.reload();
  await page
    .getByRole("combobox", { name: "Grupo activo" })
    .selectOption({ index: 1 });
  await page
    .getByRole("navigation", { name: "Cambiar sección", exact: true })
    .getByRole("button", { name: "Tareas · RT", exact: true })
    .click();
  await expect(first).toHaveValue("A");
  await page.getByRole("button", { name: "Deshacer guardado" }).click();
  await expect(first).toHaveValue("");
  await page.getByRole("button", { name: "Asignar 10 a todos" }).click();
  await page.getByRole("button", { name: "Guardar RT", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("RT guardado.");
  await page.getByRole("button", { name: "Finalizar sesión" }).click();
  await expect(first).toBeDisabled();
  await page.getByRole("button", { name: "Comenzar sesión" }).click();
  await expect(first).toHaveValue("");
  await page
    .getByRole("combobox", { name: "Sesión consultada" })
    .selectOption({ index: 1 });
  await expect(first).toHaveValue("10");
  await expect(first).toBeDisabled();
  await page
    .getByRole("button", { name: "Cerrar sesión", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Acceso docente" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Acceso docente" }),
  ).toBeVisible();
});
test("Atlas tablet: búsqueda, ausencia separada y confirmación al salir", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await enter(page);
  await page.getByRole("button", { name: "Asignar 10 a todos" }).click();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page
    .getByRole("combobox", { name: "Grupo activo" })
    .selectOption({ index: 2 });
  await expect(page.locator(".rt-table-row select").first()).toHaveValue("10");
  await page.getByRole("button", { name: "Guardar RT", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("RT guardado.");
  await page.getByRole("searchbox", { name: "Buscar alumno" }).fill("alba");
  await expect(page.locator(".rt-table-row")).toHaveCount(6);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("Alta de grupo y lista privada persistente", async ({ page }) => {
  await enter(page);
  await page.getByText("Crear grupo", { exact: true }).click();
  await page
    .getByRole("textbox", { name: "Nombre del grupo" })
    .fill("2.º ESO · Nuevo");
  await page
    .getByRole("textbox", { name: "Alumnos · un nombre completo por línea" })
    .fill("Eva García\nLuis Soler");
  await page.getByRole("button", { name: "Crear grupo y alumnos" }).click();
  await expect(page.getByRole("status")).toHaveText("Grupo creado.");
  await expect(page.locator(".rt-table-row")).toHaveCount(2);
  await page.reload();
  await page
    .getByRole("combobox", { name: "Grupo activo" })
    .selectOption({ label: "2.º ESO · Nuevo" });
  await page
    .getByRole("navigation", { name: "Cambiar sección", exact: true })
    .getByRole("button", { name: "Tareas · RT", exact: true })
    .click();
  await expect(page.locator(".rt-table-row")).toHaveCount(2);
});
const xpSection = (page) =>
  page
    .getByRole("navigation", { name: "Cambiar sección", exact: true })
    .getByRole("button", { name: "En clase · XP", exact: true });
test("XP persistente: búsqueda por alias, registro, recarga, deshacer y aislamiento", async ({
  page,
}) => {
  await enter(page);
  await xpSection(page).click();
  await page
    .getByRole("searchbox", { name: "Buscar alumno por nombre o alias" })
    .fill("eclipse 01");
  await expect(page.locator(".student-row")).toHaveCount(1);
  await page.locator(".student-row").click();
  const person = await page.locator(".quick-panel h2").textContent();
  await page
    .getByRole("button", {
      name: "Comunicación: registrar 2 XP base",
      exact: true,
    })
    .click();
  await expect(page.getByTestId("xp-total")).toHaveText("2");
  await expect(page.getByRole("status")).toContainText("+2 XP base guardado");
  await page.reload();
  await page
    .getByRole("combobox", { name: "Grupo activo" })
    .selectOption({ index: 1 });
  await page
    .getByRole("button", { name: `Abrir ficha de ${person}`, exact: true })
    .click();
  await expect(page.getByTestId("xp-total")).toHaveText("2");
  await page
    .getByRole("button", {
      name: `Deshacer Comunicación de ${person}: 2 XP`,
      exact: true,
    })
    .click();
  await expect(page.getByTestId("xp-total")).toHaveText("0");
  await expect(
    page.getByRole("region", { name: "Historial privado de XP" }),
  ).toContainText("Deshecho");
  await page
    .getByRole("combobox", { name: "Grupo activo" })
    .selectOption({ index: 2 });
  await expect(
    page.getByRole("region", { name: "Historial privado de XP" }),
  ).toContainText("Aún no hay observaciones");
  await expect(page.locator(".quick-panel")).toContainText("Elige un alumno");
});
test("XP: RT pendiente se conserva, fallo recuperable y doble clic sin duplicado", async ({
  page,
}) => {
  await enter(page);
  await page.locator(".rt-table-row select").first().selectOption("5");
  await xpSection(page).click();
  await page.locator(".student-row").first().click();
  let calls = 0;
  await page.route("**/api/groups/*/xp", async (route) => {
    calls++;
    if (calls === 1) {
      await route.fetch();
      await route.abort("failed");
    } else await route.continue();
  });
  const action = page.getByRole("button", {
    name: "Precisión: registrar 1 XP base",
    exact: true,
  });
  await action.click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(action).toBeEnabled();
  await action.click();
  await expect(page.getByTestId("xp-total")).toHaveText("1");
  await expect(
    page.locator(".xp-history-entry").filter({ hasText: "Precisión" }),
  ).toHaveCount(1);
  await page.unroute("**/api/groups/*/xp");
  await page.route("**/api/groups/*/xp", async (route) => {
    await new Promise((r) => setTimeout(r, 200));
    await route.continue();
  });
  await action.evaluate((button) => {
    button.click();
    button.click();
  });
  await expect(page.getByTestId("xp-total")).toHaveText("2");
  await expect(
    page.locator(".xp-history-entry").filter({ hasText: "Precisión" }),
  ).toHaveCount(2);
  await page
    .getByRole("navigation", { name: "Cambiar sección", exact: true })
    .getByRole("button", { name: "Tareas · RT", exact: true })
    .click();
  await expect(page.locator(".rt-table-row select").first()).toHaveValue("5");
  await expect(page.getByText(/Cambios sin guardar/)).toBeVisible();
});
test("XP móvil: panel, descriptores, búsqueda vacía y teclado", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enter(page);
  await xpSection(page).click();
  await page.locator(".student-row").first().click();
  await expect(
    page.getByRole("button", { name: "Constancia: registrar 3 XP base" }),
  ).toContainText("Supera una dificultad");
  await page.keyboard.press("Escape");
  await expect(page.locator(".quick-panel")).toBeHidden();
  await page.keyboard.press("Control+k");
  await expect(
    page.getByRole("searchbox", { name: "Buscar alumno por nombre o alias" }),
  ).toBeFocused();
  await page
    .getByRole("searchbox", { name: "Buscar alumno por nombre o alias" })
    .fill("inexistente");
  await expect(page.getByText(/No encontramos ese alumno/)).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

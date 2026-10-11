import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
let html = await readFile(resolve(root, "dist/index.html"), "utf8");
const scriptPath = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)?.[1];
const cssPath = html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/)?.[1];
if (!scriptPath || !cssPath)
  throw new Error(
    "Primero ejecuta npm run build. No se encontraron los assets del bundle.",
  );
const js = await readFile(
  resolve(root, "dist", scriptPath.replace(/^\//, "")),
  "utf8",
);
let css = await readFile(
  resolve(root, "dist", cssPath.replace(/^\//, "")),
  "utf8",
);
const island = await readFile(resolve(root, "public/island.svg"));
css = css.replaceAll(
  /url\((?:["'])?\/island\.svg(?:["'])?\)/g,
  `url("data:image/svg+xml;base64,${island.toString("base64")}")`,
);
html = html.replace(
  /<script[^>]+src="[^"]+"[^>]*><\/script>/,
  () =>
    `<script type="module">${js.replaceAll("</script", "<\\/script")}</script>`,
);
html = html.replace(
  /<link[^>]+href="[^"]+\.css"[^>]*>/,
  () => `<style>${css}</style>`,
);
if (/(?:src|href)="\/assets\//.test(html) || css.includes("/island.svg"))
  throw new Error("Quedan dependencias externas en el HTML exportado.");
const target = resolve(root, "deliverables/EclipseGames-cuatro-disenos.html");
await mkdir(resolve(root, "deliverables"), { recursive: true });
await writeFile(target, html);
console.log(`Demo autónoma generada: ${target}`);

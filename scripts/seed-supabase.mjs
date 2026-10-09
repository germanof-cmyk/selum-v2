import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const root = new URL("../", import.meta.url);
const read = async (name) => JSON.parse(await readFile(new URL(`data/${name}.json`, root), "utf8"));
const uuid = (scope, slug) => {
  const hex = createHash("sha256").update(`selum:${scope}:${slug}`).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
};
const validUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const fail = (message) => { throw new Error(message); };
const canonical = (value) => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item);

const [catalog, projects, categories] = await Promise.all([read("catalog"), read("projects"), read("categories")]);
const productRows = Object.entries(catalog).map(([slug, product], index) => ({
  id: validUuid(product.id) ? product.id : uuid("product", slug), slug,
  // The legacy public catalog displayed every active product, including four marked "review".
  // Keep that public visibility while retaining the original JSON unchanged in data.
  status: product.active !== false ? "published" : "draft", active: product.active !== false,
  sort_order: index + 1, show_on_home: product.home?.featured === true,
  data: product, draft_data: { ...product, status: product.active !== false ? "approved" : product.status },
}));
const projectRows = Object.entries(projects).map(([slug, project], index) => ({
  id: validUuid(project.id) ? project.id : uuid("project", slug), slug,
  status: project.status === "approved" ? "published" : "draft", active: project.active !== false,
  sort_order: project.projectsOrder ?? index + 1, show_on_home: project.showOnHome === true,
  home_order: project.homeOrder, category: project.categoryId ?? "", name: project.name,
  location: project.location, cover_image: project.coverImage ?? "", data: project, draft_data: project,
}));
const categoryRows = [
  ...categories.products.map((category) => ({ ...category, type: "product" })),
  ...categories.projects.map((category) => ({ ...category, type: "project" })),
].map((category) => ({
  id: category.id, type: category.type, slug: category.slug, name: category.name,
  active: category.active, sort_order: category.order, draft_data: null,
}));
const expected = { products: productRows.length, projects: projectRows.length, categories: categoryRows.length };
console.log("JSON de origem:", expected);
if (process.argv.includes("--dry-run")) process.exit(0);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) fail("Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY antes de executar o seed.");
const db = createClient(url, key, { auth: { persistSession: false } });
const before = {};
for (const table of ["products", "projects", "categories"]) {
  const { count, error } = await db.from(table).select("id", { count: "exact", head: true });
  if (error) fail(`${table}: ${error.message}. Aplique supabase/migrations/002_content_cms.sql antes do seed.`);
  before[table] = count;
}
console.log("Antes:", before);
if (Object.values(before).some((count) => count > 0) && !process.argv.includes("--force")) {
  const [existingProducts, existingProjects, existingCategories] = await Promise.all([
    db.from("products").select("id,slug,data"),
    db.from("projects").select("id,slug,data"),
    db.from("categories").select("id,type,slug,name,active,sort_order"),
  ]);
  for (const result of [existingProducts, existingProjects, existingCategories]) if (result.error) fail(result.error.message);
  const sameContent = (found, expectedRows, fields) => found.length === expectedRows.length && expectedRows.every((row) => {
    const match = found.find((item) => item.id === row.id);
    return match && fields.every((field) => canonical(match[field]) === canonical(row[field]));
  });
  if (sameContent(existingProducts.data, productRows, ["slug", "data"]) &&
      sameContent(existingProjects.data, projectRows, ["slug", "data"]) &&
      sameContent(existingCategories.data, categoryRows, ["type", "slug", "name", "active", "sort_order"])) {
    console.log("Dados já migrados e conferidos. Nenhum registro foi criado ou alterado.");
    process.exit(0);
  }
  fail("As tabelas contêm dados diferentes dos JSON. Seed interrompido para preservar edições. Use --force somente após conferir um backup.");
}
for (const [table, rows] of [["categories", categoryRows], ["products", productRows], ["projects", projectRows]]) {
  const { error } = await db.from(table).upsert(rows, { onConflict: "id" });
  if (error) fail(`${table}: ${error.message}`);
}
const after = {};
for (const table of ["products", "projects", "categories"]) {
  const { count, error } = await db.from(table).select("id", { count: "exact", head: true });
  if (error) fail(`${table}: ${error.message}`);
  after[table] = count;
  if (count !== expected[table]) fail(`${table}: esperado ${expected[table]}, encontrado ${count}.`);
}
for (const [table, rows] of [["products", productRows], ["projects", projectRows]]) {
  const { data, error } = await db.from(table).select("slug,data");
  if (error) fail(error.message);
  const actual = new Map(data.map((row) => [row.slug, row.data]));
  for (const row of rows) if (canonical(actual.get(row.slug)) !== canonical(row.data)) fail(`${table}/${row.slug}: conteúdo diferente após a migração.`);
}
console.log("Depois:", after);
console.log("Conteúdo conferido. Nenhum arquivo JSON foi modificado.");

import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const allowed = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

function matchesFormat(bytes: Buffer, type: string) {
  if (type === "image/png") return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/webp") return bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (type === "image/avif") return bytes.toString("ascii", 4, 8) === "ftyp" && /^(avif|avis)$/.test(bytes.toString("ascii", 8, 12));
  return false;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return new NextResponse(null, { status: 404 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("Selecione uma imagem.");
    const extension = allowed.get(file.type);
    if (!extension) throw new Error("Use PNG, JPG, WebP ou AVIF.");
    if (file.size === 0 || file.size > 15 * 1024 * 1024) throw new Error("A imagem deve ter até 15 MB.");
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!matchesFormat(bytes, file.type)) throw new Error("O arquivo não corresponde ao formato da imagem.");

    const directory = path.join(process.cwd(), "public", "images", "projects");
    const oldImage = await readFile(path.join(directory, "luan-santana-1.png"));
    const digest = (value: Buffer) => createHash("sha256").update(value).digest("hex");
    if (digest(bytes) === digest(oldImage)) throw new Error("Esta imagem é igual aos três arquivos antigos e não comprova o projeto.");

    const base = path.parse(file.name).name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "projeto";
    const name = `${base}-${randomUUID().slice(0, 8)}.${extension}`;
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, name), bytes, { flag: "wx" });
    return NextResponse.json({ path: `/images/projects/${name}`, name });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Falha ao enviar imagem." }, { status: 400 });
  }
}

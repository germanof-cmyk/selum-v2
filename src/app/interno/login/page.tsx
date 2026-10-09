import { redirect } from "next/navigation";
import { editorContentClient } from "@/lib/content-backend";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Acessar painel — Selum", robots: "noindex, nofollow" };

export default async function LoginPage() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const db = await editorContentClient();
    const { data } = await db.auth.getUser();
    if (data.user) {
      const { data: admin } = await db.from("content_admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
      if (admin) redirect("/interno");
    }
  }
  return <LoginForm />;
}

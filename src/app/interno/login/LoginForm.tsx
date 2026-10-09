"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) throw new Error("O painel ainda não foi configurado.");
      const client = createBrowserClient(url, key);
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: admin } = await client.from("content_admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
      if (!admin) { await client.auth.signOut(); throw new Error("Sem acesso ao painel."); }
      window.location.assign("/interno");
    } catch { setError("Não foi possível entrar. Confira o email e a senha."); setBusy(false); }
  }
  return <main style={{ minHeight: "100vh", background: "#f5f7fa", display: "grid", placeItems: "center", padding: 20, fontFamily: "Arial, sans-serif" }}>
    <form onSubmit={login} style={{ width: "100%", maxWidth: 390, background: "white", border: "1px solid #e0e5ec", borderRadius: 10, padding: 32, display: "grid", gap: 16 }}>
      <strong style={{ color: "#102b4e", letterSpacing: 2 }}>SELUM / INTERNO</strong><h1 style={{ margin: 0, color: "#102b4e", fontSize: 24 }}>Acessar conteúdo</h1>
      <label style={{ display: "grid", gap: 6 }}>Email<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} style={{ height: 44, padding: "0 12px", border: "1px solid #dce2e9", borderRadius: 7 }} /></label>
      <label style={{ display: "grid", gap: 6 }}>Senha<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} style={{ height: 44, padding: "0 12px", border: "1px solid #dce2e9", borderRadius: 7 }} /></label>
      {error && <p role="alert" style={{ color: "#b42318", margin: 0 }}>{error}</p>}
      <button disabled={busy} style={{ height: 44, background: "#0875c9", border: 0, borderRadius: 7, color: "white", fontWeight: 700, cursor: "pointer" }}>{busy ? "Entrando..." : "Entrar"}</button>
    </form>
  </main>;
}

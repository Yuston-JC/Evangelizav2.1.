import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL || "https://tspnzxqyptakmiuujcqh.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "sb_publishable__8eY8BBDy2CcUGqclJ8DEw_UyAfq41l";
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = 3000;

app.use(express.json());

// Health Check & DB Verification
app.get("/api/health", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("count").limit(1);
    if (error) throw error;
    res.json({ status: "ok", database: "connected", message: "Servidor e Banco de Dados estão operacionais." });
  } catch (err: any) {
    res.status(500).json({ status: "error", database: "disconnected", message: err.message });
  }
});

// Auth Routes
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, role, status, contact")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error;
    }

    if (user) {
      if ((user.role === 'evangelista' || user.role === 'acompanhante') && user.status !== 'approved') {
        console.log(`Login negado: Usuário ${email} (${user.role}) não aprovado.`);
        return res.status(403).json({ error: "Sua conta está aguardando aprovação de um administrador." });
      }
      console.log(`Login bem-sucedido: ${email} (${user.role})`);
      res.json(user);
    } else {
      res.status(401).json({ error: "Credenciais inválidas" });
    }
  } catch (err: any) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: `Erro interno: ${err.message}` });
  }
});

app.post("/api/register", async (req, res) => {
  const { name, email, password, role, contact } = req.body;
  const { data, error } = await supabase
    .from("users")
    .insert([{ 
      name, 
      email, 
      password, 
      contact,
      role: role || 'evangelista', 
      status: 'pending' 
    }])
    .select()
    .single();

  if (error) {
    console.error("Erro no registro:", error);
    res.status(400).json({ 
      error: error.code === '23505' ? "Este e-mail já está cadastrado." : `Erro no banco de dados: ${error.message}` 
    });
  } else {
    res.json({ message: "Cadastro realizado com sucesso! Aguarde a aprovação de um administrador." });
  }
});

// Admin User Management
app.get("/api/admin/users", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("role", ["evangelista", "acompanhante"])
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/admin/users/approve", async (req, res) => {
  const { userId, status } = req.body;
  const { data, error } = await supabase
    .from("users")
    .update({ status })
    .eq("id", userId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Evangelizados Routes
app.get("/api/evangelizados", async (req, res) => {
  const { evangelista_id, acompanhante_id, role } = req.query;
  
  let query = supabase
    .from("evangelizados")
    .select(`
      *,
      evangelista:users!evangelista_id ( name ),
      acompanhante:users!acompanhante_id ( name )
    `)
    .order("created_at", { ascending: false });

  if (role === 'evangelista' && evangelista_id) {
    query = query.eq("evangelista_id", evangelista_id);
  } else if (role === 'acompanhante') {
    if (acompanhante_id) {
      // Show ONLY assigned to this acompanhante
      query = query.eq("acompanhante_id", acompanhante_id);
    } else {
      // Show ONLY unassigned
      query = query.is("acompanhante_id", null);
    }
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Flatten the names
  const formattedData = data.map((item: any) => ({
    ...item,
    evangelista_name: item.evangelista?.name,
    acompanhante_name: item.acompanhante?.name
  }));

  res.json(formattedData);
});

app.post("/api/evangelizados", async (req, res) => {
  const { 
    name, 
    contact, 
    location, 
    age_range,
    address,
    religion,
    church,
    prayer_request,
    prayed_for,
    evangelista_id, 
    accepted_jesus, 
    follow_up, 
    follow_up_person, 
    notes 
  } = req.body;
  const { data, error } = await supabase
    .from("evangelizados")
    .insert([{ 
      name, 
      contact, 
      location, 
      age_range,
      address,
      religion,
      church,
      prayer_request,
      prayed_for: prayed_for || false,
      evangelista_id, 
      accepted_jesus, 
      follow_up, 
      follow_up_person, 
      notes 
    }])
    .select()
    .single();

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.json(data);
  }
});

app.patch("/api/evangelizados/:id/pray", async (req, res) => {
  const { id } = req.params;
  const { prayed_for } = req.body;
  const { data, error } = await supabase
    .from("evangelizados")
    .update({ prayed_for })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.get("/api/admin/acompanhantes", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name")
    .eq("role", "acompanhante")
    .eq("status", "approved");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/admin/evangelizados/assign", async (req, res) => {
  const { evangelizadoId, acompanhanteId } = req.body;
  
  // Get acompanhante name for follow_up_person field
  const { data: acUser } = await supabase
    .from("users")
    .select("name")
    .eq("id", acompanhanteId)
    .single();

  const { data, error } = await supabase
    .from("evangelizados")
    .update({ 
      acompanhante_id: acompanhanteId,
      follow_up: true,
      follow_up_person: acUser?.name || ''
    })
    .eq("id", evangelizadoId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Stats Route
app.get("/api/stats", async (req, res) => {
  const { data: allData, error: allErr } = await supabase.from("evangelizados").select("*");
  const { data: usersData, error: usersErr } = await supabase.from("users").select("id, name").eq("role", "evangelista");

  if (allErr || usersErr) {
    return res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }

  const total = allData.length;
  const accepted = allData.filter(d => d.accepted_jesus).length;
  const followUp = allData.filter(d => d.follow_up).length;
  
  const byEvangelist = usersData.map(u => ({
    name: u.name,
    count: allData.filter(d => d.evangelista_id === u.id).length
  }));

  res.json({ total, accepted, followUp, byEvangelist });
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

// Only listen if not in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;

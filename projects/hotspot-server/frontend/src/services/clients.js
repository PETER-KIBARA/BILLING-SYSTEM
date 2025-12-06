const API = "http://localhost:5000";

export async function getActiveClients() {
  const res = await fetch(`${API}/clients`);
  return res.json();
}

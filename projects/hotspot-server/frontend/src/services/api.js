const API = "http://localhost:5000";

export async function getDashboardStats() {
  const res = await fetch(`${API}/stats`);
  return res.json();
}

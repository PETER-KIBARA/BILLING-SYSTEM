const API = "http://localhost:5000";

export async function getVouchers() {
  const res = await fetch(`${API}/vouchers`);
  return res.json();
}

export async function createVoucher(data) {
  const res = await fetch(`${API}/vouchers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

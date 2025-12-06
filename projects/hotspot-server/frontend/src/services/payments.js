const API = "http://localhost:5000";

export async function initPayment(data) {
  const res = await fetch(`${API}/payments/mpesa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

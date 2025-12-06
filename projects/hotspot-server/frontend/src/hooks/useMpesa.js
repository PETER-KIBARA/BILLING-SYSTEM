import api from "../services/api";

export function useMpesa() {
  const initiateStk = async (amount) => {
    try {
      const res = await api.post("/payments/stk", { amount });
      alert("STK Push sent! Complete payment on your phone.");
    } catch (error) {
      alert("Payment failed.");
      console.error(error);
    }
  };

  return { initiateStk };
}

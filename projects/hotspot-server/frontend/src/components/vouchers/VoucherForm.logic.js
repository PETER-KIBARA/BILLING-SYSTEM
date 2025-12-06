import { useState } from "react";
import { createVoucher } from "../../services/vouchers";

export default function useVoucherFormLogic() {
  const [amount, setAmount] = useState("");
  const [hours, setHours] = useState("");

  const submit = async () => {
    return await createVoucher({ amount, hours });
  };

  return { amount, setAmount, hours, setHours, submit };
}

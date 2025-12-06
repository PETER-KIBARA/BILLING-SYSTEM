import { useEffect, useState } from "react";
import { getVouchers } from "../../services/vouchers";

export default function useVoucherListLogic() {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => load(), []);

  const load = async () => {
    const res = await getVouchers();
    setVouchers(res);
  };

  return { vouchers };
}

import { useEffect, useState } from "react";
import { getActiveClients } from "../../services/clients";

export default function useActiveClientsLogic() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    const res = await getActiveClients();
    setClients(res);
  };

  return { clients };
}

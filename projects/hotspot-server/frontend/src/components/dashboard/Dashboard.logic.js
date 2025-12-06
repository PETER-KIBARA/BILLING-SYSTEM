import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/api";

export default function useDashboardLogic() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getDashboardStats();
    setStats(res);
  };

  return { stats };
}

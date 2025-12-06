import useDashboardLogic from "./Dashboard.logic";
import StatsCard from "./StatsCard";

export default function Dashboard() {
  const { stats } = useDashboardLogic();

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard label="Active Users" value={stats.activeUsers} />
      <StatsCard label="Total Revenue" value={`KES ${stats.revenue}`} />
      <StatsCard label="Total Vouchers" value={stats.vouchers} />
    </div>
  );
}

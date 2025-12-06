import useActiveClientsLogic from "./ActiveClients.logic";
import ClientCard from "./ClientCard";

export default function ActiveClients() {
  const { clients } = useActiveClientsLogic();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {clients.map((c) => (
        <ClientCard key={c.mac} client={c} />
      ))}
    </div>
  );
}

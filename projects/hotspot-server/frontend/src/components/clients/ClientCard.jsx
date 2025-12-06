export default function ClientCard({ client }) {
  return (
    <div className="p-4 border bg-white shadow rounded">
      <p className="font-bold">{client.ip}</p>
      <p>MAC: {client.mac}</p>
      <p>Uptime: {client.uptime}</p>
      <p>Data Used: {client.data}</p>
    </div>
  );
}

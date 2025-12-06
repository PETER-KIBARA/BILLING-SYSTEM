import useVoucherFormLogic from "./VoucherForm.logic";

export default function VoucherForm() {
  const { amount, setAmount, hours, setHours, submit } =
    useVoucherFormLogic();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit();
    alert("Voucher Created!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      <input
        className="border p-2 w-full mb-3"
        placeholder="Amount (KES)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-3"
        placeholder="Hours"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />
      <button className="bg-blue-600 text-white p-2 rounded w-full">
        Create Voucher
      </button>
    </form>
  );
}

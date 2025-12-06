export default function VoucherItem({ voucher }) {
  return (
    <div className="p-4 border bg-white rounded shadow">
      <p className="font-bold">{voucher.code}</p>
      <p>{voucher.amount} KES – {voucher.hours} hrs</p>
      <p className={voucher.used ? "text-red-500" : "text-green-600"}>
        {voucher.used ? "USED" : "ACTIVE"}
      </p>
    </div>
  );
}

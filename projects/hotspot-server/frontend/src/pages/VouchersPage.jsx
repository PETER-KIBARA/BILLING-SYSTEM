import VoucherForm from "../components/vouchers/VoucherForm";
import VoucherList from "../components/vouchers/VoucherList";

export default function VouchersPage() {
  return (
    <div className="p-6 grid gap-4 md:grid-cols-2">
      <VoucherForm />
      <VoucherList />
    </div>
  );
}

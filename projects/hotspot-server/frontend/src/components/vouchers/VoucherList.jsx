import useVoucherListLogic from "./VoucherList.logic";
import VoucherItem from "./VoucherItem";

export default function VoucherList() {
  const { vouchers } = useVoucherListLogic();

  return (
    <div className="grid gap-3">
      {vouchers.map((v) => (
        <VoucherItem key={v.code} voucher={v} />
      ))}
    </div>
  );
}

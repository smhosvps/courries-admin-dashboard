import CouponForm from "@/components/CouponForm";
import CouponList from "@/components/CouponList";
import {
  Coupon,
  CouponInput,
  useAddCouponMutation,
  useGetCouponsQuery,
  useUpdateCouponMutation,
} from "@/redux/features/couponApi/couponApi";
import { useState } from "react";

export default function ManageCoupons() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [addCoupon] = useAddCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const { refetch } = useGetCouponsQuery();

  const handleAdd = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };
  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };
  const handleSubmit = async (data: CouponInput) => {
    if (editingCoupon) {
      await updateCoupon({ id: editingCoupon._id, ...data });
    } else {
      await addCoupon(data);
    }
    await refetch(); // force refresh after add/edit
    setModalOpen(false);
  };

  return (
    <div className="p-4">
      <CouponList onAddClick={handleAdd} onEditClick={handleEdit} />
      <CouponForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCoupon}
        isEditing={!!editingCoupon}
      />
    </div>
  );
}

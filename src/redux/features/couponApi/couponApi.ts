import { api } from "@/redux/api/apiSlice";
import { City } from "../cityApi/cityApi";

export interface Coupon {
  _id: string;
  startDate: string;
  endDate: string;
  valueType: "fixed" | "percentage";
  discountAmount: number;
  cityType: "all" | "specific";
  city: string[] | City[];
  status: "enable" | "disable";
  createdAt: string;
  updatedAt: string;
}

export interface CouponInput {
  startDate: string;
  endDate: string;
  valueType: "fixed" | "percentage";
  discountAmount: number;
  cityType: "all" | "specific";
  city: string[]; // array of city IDs
  status: "enable" | "disable";
}

export const couponApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query<Coupon[], void>({
      query: () => "get-coupons",
    }),
    getCouponById: builder.query<Coupon, string>({
      query: (id) => `get-coupon/${id}`,
    }),
    addCoupon: builder.mutation<Coupon, CouponInput>({
      query: (coupon) => ({
        url: "create-coupon",
        method: "POST",
        body: coupon,
      }),
    }),
    updateCoupon: builder.mutation<
      Coupon,
      { id: string } & Partial<CouponInput>
    >({
      query: ({ id, ...patch }) => ({
        url: `update-coupon/${id}`,
        method: "PUT",
        body: patch,
      }),
    }),
    deleteCoupon: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `delete-coupon/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useAddCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;

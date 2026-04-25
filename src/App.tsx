import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFoundScreen from "./screens/NotFoundScreen";
import IsNotLoginAuth from "./redux/features/auth/IsNotLoginAuth";
import SignInScreen from "./screens/auth/SignInScreen";
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";
import AdminRoute from "./redux/features/auth/AdminRoutes";
import { setCredentials } from "./redux/features/auth/authSlice"; 
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUserQuery } from "./redux/api/apiSlice"; 
import { Loader } from "lucide-react";
import UserProfilePage from "./screens/UserProfilePage";
import NotificationPage from "./NotificationPage";
import AdminLayout from "./screens/screenlayouts/AdminLayout";
import PublicPrivacy from "./screens/admin/privacy/PublicPrivacy";
import FaqManagement from "./screens/admin/faq/FaqManagement";
import ContactSupportManagement from "./screens/admin/contactus/ContactSupportManagement";
import ReportManagement from "./screens/admin/ReportManagement/ReportManagement";
import CustomerAccounts from "./screens/admin/accounts/CustomerAccounts";
import UserDetails from "./screens/admin/accounts/UserDetails";
import DeliveryPartners from "./screens/admin/accounts/DeliveryPartners";
import SuperAdminPage from "./screens/admin/accounts/SuperAdminPage";
import AdminAccount from "./screens/admin/accounts/AdminAccount";
import DeliveryOptionsAdmin from "./screens/admin/deliveryOptionsManagement/DeliveryOptionsAdmin";
import ManagePackage from "./screens/admin/package/ManagePackage";
import ManageDeliveries from "./screens/admin/accounts/ManageDeliveries";
import DeliveryDetailPage from "./screens/admin/accounts/DeliveryDetailPage";
import AddAccount from "./screens/admin/accounts/AddAccount";
import UploadUsersCSV from "./screens/admin/accounts/UploadUsersCSV";
import AdminDrivers from "./screens/admin/accounts/AdminDrivers";
import ManageUserWithdraws from "./screens/ManageUserWithdraws";
import ApiKeys from "./screens/admin/apikeys/ApiKeys";
import ManageUserPayment from "./screens/ManageUserPayment";
import GeofencingPage from "./screens/GeofencingPage";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import ManageCountry from "./ManageCountry";
import AdminDashboard from "./AdminDasboard";
import ManageCity from "./ManageCity";
import ManageCoupons from "./screens/ManageCoupons";
import AllOrders from "./screens/admin/deliveryStatusOrder/AllOrders";
import CanceledOrders from "./screens/admin/deliveryStatusOrder/CanceledOrders";
import OrderDetail from "./screens/admin/deliveryStatusOrder/OrderDetail";
import TodayOrders from "./screens/admin/deliveryStatusOrder/TodayOrders";
import { DeliveredOrders } from "./screens/admin/deliveryStatusOrder/DeliveredOrders";
import { ActiveOrders } from "./screens/admin/deliveryStatusOrder/ActiveOrders";
import { PendingOrders } from "./screens/admin/deliveryStatusOrder/PendingOrders";
import { AssignedOrders } from "./screens/admin/deliveryStatusOrder/AssignedOrders";
import { AdminEarnings } from "./screens/admin/earnings/AdminEarnings";
import { DeliveryEarnings } from "./screens/admin/earnings/DeliveryEarnings";
import OrderReport from "./screens/admin/earnings/OrderReport";


function App() {
  const dispatch = useDispatch();
  const { data: user, isLoading } = useGetUserQuery();

  useEffect(() => {
    if (user) {
      dispatch(
        setCredentials({ user, token: localStorage.getItem("token") || "" })
      );
    }
  }, [user, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader className="animate-spin text-blue-600" size={64} />
        </div>
      </div>
    );
  }
  return (
    <>
      <BrowserRouter>
        {/* <Header /> */}
        <Routes>
          <Route path="*" element={<NotFoundScreen />} />
          <Route element={<IsNotLoginAuth />}>
            <Route path="/" element={<SignInScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route path="/reset-password" element={<ResetPasswordScreen />} />
          </Route>
          <Route
            element={
              <AdminRoute allowedRoles={["customer", "super admin", "admin"]} />
            }
          >
            <Route path="/dashboard-super-admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="manage-customer" element={<CustomerAccounts />} />
              <Route path="manage-partners" element={<DeliveryPartners />} />
              <Route path="manage-super-admins" element={<SuperAdminPage />} />
              <Route path="manage-keys" element={<ApiKeys />} />
              <Route path="manage-admins" element={<AdminAccount />} />
              <Route path="user-detail/:id" element={<UserDetails />} />
              <Route path="manage-policy" element={<PublicPrivacy />} />
              <Route path="all-order" element={<AllOrders />} />
              <Route path="ongoing-order" element={<ActiveOrders />} />
              <Route path="cancelled-order" element={<CanceledOrders />} />
              <Route path="today-order" element={<TodayOrders />} />
              <Route path="assigned-order" element={<AssignedOrders />} />
              <Route path="pending-order" element={<PendingOrders />} />
              <Route path="delivered-order" element={<DeliveredOrders />} />
              <Route path="order-details/:id" element={<OrderDetail />} />
              <Route path="notifications" element={<NotificationPage />} />
              <Route path="admin-earnings" element={<AdminEarnings />} />
              <Route path="order-report" element={<OrderReport />} />
              <Route path="delivery-man-earnings" element={<DeliveryEarnings />} />
              <Route
                path="manage-delivery-options"
                element={<DeliveryOptionsAdmin />}
              />
              <Route path="add-admin-account" element={<AddAccount />} />
              <Route
                path="admin-add-account-csv"
                element={<UploadUsersCSV />}
              />
              <Route path="manage-deliveries" element={<ManageDeliveries />} />
              <Route path="deliveries/:id" element={<DeliveryDetailPage />} />
              <Route
                path="complete-payment/:id"
                element={<ManageUserPayment />}
              />
              <Route path="my-riders" element={<AdminDrivers />} />
              <Route path="manage-package" element={<ManagePackage />} />
              <Route path="manage-faq" element={<FaqManagement />} />
              <Route path="country" element={<ManageCountry />} />
              <Route path="city" element={<ManageCity />} />
              <Route path="coupon-list" element={<ManageCoupons />} />
              <Route path="manage-withdraw" element={<ManageUserWithdraws />} />
              <Route path="geofencing" element={<GeofencingPage />} />
              <Route path="profile" element={<UserProfilePage />} />
              <Route
                path="manage-contact-us"
                element={<ContactSupportManagement />}
              />
              <Route path="manage-report" element={<ReportManagement />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import {
  ArrowLeft,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Building,
  MapPinned,
  Bike,
  Car,
  Truck,
  Star,
  DollarSign,
  Calendar,
  FileText,
  Image,
  Navigation,
  Clock3,
  Users,
  Globe,
  CreditCard,
  BadgeCheck,
  Package,
  Activity,
  Banknote,
  MessageSquare,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import UpgradeUserType from "@/components/UpgradeUserType";
import { ToggleVerificationSwitch } from "@/components/ToggleVerificationSwitch";
import { useGetUserQuery } from "@/redux/api/apiSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: fetch, isLoading, refetch } = useGetUserByIdQuery(id!, {
    skip: !id,
    pollingInterval: 30000, // 30 seconds in milliseconds
  });;
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const navigate = useNavigate();

  const { data } = useGetUserQuery();
  const isSuperAdmin = data?.user?.userType === "super admin";

  // Helper: format user type for display
  const formatUserType = (type: string): string => {
    const types: Record<string, string> = {
      customer: "Customer",
      delivery_partner: "Delivery Partner",
      admin: "Admin",
      "super admin": "Super Admin",
    };
    return types[type] || type;
  };

  const InfoItem = ({
    label,
    value,
    icon: Icon,
    className = "",
  }: {
    label: string;
    value?: string;
    icon: React.ElementType;
    className?: string;
  }) =>
    value ? (
      <div className={`flex items-center gap-3 p-3 bg-slate-50 rounded-[6px] ${className}`}>
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-medium truncate">{value}</p>
        </div>
      </div>
    ) : null;

  const DocumentItem = ({
    label,
    value,
    imageUrl,
  }: {
    label: string;
    value?: string;
    imageUrl?: string;
  }) => (
    <div className="bg-slate-50 p-4 rounded-2xl border border-blue-100">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      {value && <p className="font-medium text-sm mb-2">{value}</p>}
      {imageUrl && (
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Image className="h-4 w-4" />
          View Document
        </a>
      )}
    </div>
  );

  const StatCard = ({
    label,
    value,
    icon: Icon,
    trend,
  }: {
    label: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
  }) => (
    <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-2xl border border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5 text-blue-600" />
        {trend && <Badge variant="outline" className="bg-green-50">{trend}</Badge>}
      </div>
      <p className="text-2xl font-bold text-blue-700">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "bike":
        return <Bike className="h-5 w-5" />;
      case "car":
        return <Car className="h-5 w-5" />;
      case "van":
        return <Truck className="h-5 w-5" />;
      default:
        return <Bike className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      case "on_break":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Loading user details...</p>
      </div>
    );
  }

  if (!fetch?.user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="inline-flex h-20 w-20 rounded-full bg-red-100 items-center justify-center mx-auto">
            <User className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Account Not Found</h1>
          <p className="text-muted-foreground">
            The user account you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
            <Link to="/dashboard/accounts">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const user = fetch.user;
  const isDeliveryPartner = user.userType === "delivery_partner";
  const deliveryInfo = user.deliveryPartnerInfo;
  const stats = deliveryInfo?.stats || {};
  const hasCurrentDelivery = !!deliveryInfo?.currentDelivery;
  const averageRating = stats.averageRating ?? deliveryInfo?.averageRating ?? 0;
  const reviews = deliveryInfo?.reviews || [];
  const totalReviews = reviews.length;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const getInitials = () => {
    if (!user.firstName && !user.lastName) return "U";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  const handleViewDelivery = () => {
    if (deliveryInfo?.currentDelivery) {
      navigate(`/dashboard-super-admin/order-details/${deliveryInfo.currentDelivery}`);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-2 sm:px-4">
      <div className="">
        {/* Header with Back Button */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="w-fit border-blue-200 text-blue-600 hover:bg-blue-50 rounded-[6px] text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Accounts
          </Button>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden mb-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            <Button
              variant={activeTab === "personal" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("personal")}
              className={activeTab === "personal" ? "bg-blue-600 text-white rounded-xl" : "border-blue-200 text-blue-600 rounded-xl"}
            >
              <User className="mr-2 h-4 w-4" />
              Personal
            </Button>
            {isDeliveryPartner && (
              <Button
                variant={activeTab === "delivery" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("delivery")}
                className={activeTab === "delivery" ? "bg-blue-600 text-white rounded-xl" : "border-blue-200 text-blue-600 rounded-xl"}
              >
                <Bike className="mr-2 h-4 w-4" />
                Delivery Info
              </Button>
            )}
            <Button
              variant={activeTab === "addresses" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("addresses")}
              className={activeTab === "addresses" ? "bg-blue-600 text-white rounded-xl" : "border-blue-200 text-blue-600 rounded-xl"}
            >
              <Home className="mr-2 h-4 w-4" />
              Addresses
            </Button>
            {user.bank && user.bank.length > 0 && (
              <Button
                variant={activeTab === "banks" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("banks")}
                className={activeTab === "banks" ? "bg-blue-600 text-white rounded-xl" : "border-blue-200 text-blue-600 rounded-xl"}
              >
                <Banknote className="mr-2 h-4 w-4" />
                Banks
              </Button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Profile Card */}
          <Card className={`${activeTab === "personal" ? "block" : "hidden"} lg:block lg:col-span-1 border-blue-100 bg-white rounded-2xl`}>
            <CardHeader className="pb-2 border-b border-blue-100 p-4 sm:p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                {/* Clickable Avatar */}
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                >
                  {user?.avatar?.url ? (
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-md mb-4 cursor-pointer hover:opacity-90 transition">
                      <img
                        src={user.avatar.url}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mb-4 border-4 border-blue-100 cursor-pointer hover:opacity-90 transition">
                      <AvatarFallback className="text-xl sm:text-2xl bg-blue-100 text-blue-600">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </button>

                <h2 className="text-lg sm:text-xl font-bold break-words">
                  {user.firstName} {user.lastName}
                </h2>

                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {formatUserType(user.userType)}
                  </Badge>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                  {isDeliveryPartner && deliveryInfo?.status && (
                    <Badge className={getAvailabilityColor(deliveryInfo.status)}>
                      {deliveryInfo.status}
                    </Badge>
                  )}
                </div>

                <div className="w-full mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm break-all">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Verified Status</span>
                    <div className="flex items-center gap-1">
                      {user.isVerified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-xs sm:text-sm font-medium text-green-600">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-xs sm:text-sm font-medium text-red-600">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Deletion Requested</span>
                    <Badge
                      variant="outline"
                      className={user.deletionRequested ? "bg-red-50 text-red-600 text-xs" : "bg-gray-50 text-xs"}
                    >
                      {user.deletionRequested ? "Yes" : "No"}
                    </Badge>
                  </div>

                  {isDeliveryPartner && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Online Status</span>
                        <Badge
                          variant="outline"
                          className={deliveryInfo?.online ? "bg-green-50 text-green-600" : "bg-gray-50"}
                        >
                          {deliveryInfo?.online ? "Online" : "Offline"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Delivery</span>
                        {hasCurrentDelivery ? (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={handleViewDelivery}
                            className="p-0 h-auto text-blue-600 hover:text-blue-800"
                          >
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 cursor-pointer hover:bg-blue-100">
                              Active <Eye className="h-3 w-3 ml-1" />
                            </Badge>
                          </Button>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50">None</Badge>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card className={`${activeTab === "personal" ? "block" : "hidden"} lg:block lg:col-span-2 border-blue-100 bg-white rounded-2xl`}>
            <CardHeader className="pb-2 border-b border-blue-100 p-4 sm:p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InfoItem label="First Name" value={user?.firstName} icon={User} />
                <InfoItem label="Last Name" value={user?.lastName} icon={User} />
                <InfoItem label="Email Address" value={user?.email} icon={Mail} />
                <InfoItem label="Phone Number" value={user?.phone} icon={Phone} />
                <InfoItem label="User Type" value={formatUserType(user?.userType)} icon={Building} />
                <InfoItem label="Status" value={user?.status} icon={Shield} />
                {user?.gender && <InfoItem label="Gender" value={user?.gender} icon={Users} />}
                {user?.dateOfBirth && (
                  <InfoItem label="Date of Birth" value={formatDate(user.dateOfBirth).split(",")[0]} icon={Calendar} />
                )}
                <InfoItem label="Created At" value={user?.createdAt ? formatDate(user.createdAt) : undefined} icon={Clock} />
                <InfoItem label="Last Updated" value={user?.updatedAt ? formatDate(user.updatedAt) : undefined} icon={Clock} />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Partner Information */}
          {isDeliveryPartner && (
            <Card className={`${activeTab === "delivery" ? "block" : "hidden"} lg:block lg:col-span-3 border-blue-100 bg-white rounded-2xl`}>
              <CardHeader className="pb-2 border-b border-blue-100 p-4 sm:p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bike className="h-5 w-5 text-blue-600" />
                  Delivery Partner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <StatCard label="Rating" value={averageRating.toFixed(1)} icon={Star} />
                  <StatCard label="Total Deliveries" value={deliveryInfo.totalDeliveries ?? deliveryInfo?.totalDeliveries ?? 0} icon={Package} />
                  <StatCard label="Completed" value={deliveryInfo.completedDeliveries ?? deliveryInfo?.completedDeliveries ?? 0} icon={CheckCircle} trend="Success" />
                  <StatCard label="Cancelled" value={deliveryInfo.cancelledDeliveries ?? deliveryInfo?.cancelledDeliveries ?? 0} icon={XCircle} />
                  <StatCard label="Total Earnings" value={`₦${deliveryInfo?.earnings?.total?.toLocaleString() ?? 0}`} icon={DollarSign} />
                  <StatCard label="Pending Earnings" value={`₦${deliveryInfo?.earnings?.pending?.toLocaleString() ?? 0}`} icon={Banknote} />
                  <StatCard label="Available" value={`₦${deliveryInfo?.earnings?.available?.toLocaleString() ?? 0}`} icon={CreditCard} />
                </div>

                {/* Vehicle Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-blue-100">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      {getVehicleIcon(deliveryInfo?.vehicle?.type)}
                      Vehicle Details
                    </h3>
                    <div className="space-y-2">
                      <InfoItem label="Vehicle Type" value={deliveryInfo?.vehicle?.type} icon={Bike} className="p-2" />
                      <InfoItem label="Model" value={deliveryInfo?.vehicle?.model} icon={Car} className="p-2" />
                      <InfoItem label="Plate Number" value={deliveryInfo?.vehicle?.plateNumber} icon={CreditCard} className="p-2" />
                      <InfoItem label="Color" value={deliveryInfo?.vehicle?.color} icon={Activity} className="p-2" />
                      <InfoItem label="Year" value={deliveryInfo?.vehicle?.year?.toString()} icon={Calendar} className="p-2" />
                    </div>
                  </div>

                  {/* Working Hours & Location */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-blue-100">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <Clock3 className="h-5 w-5" />
                      Working Hours & Location
                    </h3>
                    <div className="space-y-2">
                      <InfoItem
                        label="Working Hours"
                        value={`${deliveryInfo?.workingHours?.start} - ${deliveryInfo?.workingHours?.end}`}
                        icon={Clock}
                        className="p-2"
                      />
                      <InfoItem label="Timezone" value={deliveryInfo?.workingHours?.timezone} icon={Globe} className="p-2" />
                      <InfoItem
                        label="Last Updated"
                        value={deliveryInfo?.location?.lastUpdated ? formatDate(deliveryInfo.location.lastUpdated) : undefined}
                        icon={Clock}
                        className="p-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Languages */}
                {deliveryInfo?.languages && deliveryInfo.languages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <Globe className="h-5 w-5" />
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {deliveryInfo.languages.map((lang: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="mb-6 rounded-2xl">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5" />
                    Documents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {deliveryInfo?.documents?.license && (
                      <DocumentItem
                        label="Driver's License"
                        value={`Number: ${deliveryInfo.documents.license.number}`}
                        imageUrl={deliveryInfo.documents.license.image}
                      />
                    )}
                    {deliveryInfo?.documents?.vehicleRegistration && (
                      <DocumentItem
                        label="Vehicle Registration"
                        imageUrl={deliveryInfo.documents.vehicleRegistration.image}
                      />
                    )}
                    {deliveryInfo?.documents?.nin && (
                      <DocumentItem
                        label="NIN"
                        value={`Number: ${deliveryInfo.documents.nin.number}`}
                        imageUrl={deliveryInfo.documents.nin.image}
                      />
                    )}
                    {deliveryInfo?.documents?.insurance && (
                      <DocumentItem
                        label="Insurance"
                        value={`Number: ${deliveryInfo.documents.insurance.number}`}
                        imageUrl={deliveryInfo.documents.insurance.image}
                      />
                    )}
                  </div>
                </div>

                {/* Next of Kin Information */}
                {deliveryInfo?.other_information && (
                  <div className="mb-6">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <Users className="h-5 w-5" />
                      Next of Kin Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <InfoItem label="Name" value={deliveryInfo.other_information.next_of_kin_name} icon={User} />
                      <InfoItem label="Phone" value={deliveryInfo.other_information.next_of_kin_phone} icon={Phone} />
                      <InfoItem label="NIN" value={deliveryInfo.other_information.next_of_kin_nin} icon={FileText} />
                      <InfoItem label="Address" value={deliveryInfo.other_information.next_of_kin_address} icon={Home} />
                      <InfoItem label="Occupation" value={deliveryInfo.other_information.next_of_kin_occupation} icon={Briefcase} />
                    </div>
                  </div>
                )}

                {/* Preferences & Verification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-slate-50 p-4 rounded-[12px] border border-blue-100">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <Settings className="h-5 w-5" />
                      Preferences
                    </h3>
                    <div className="space-y-2">
                      <InfoItem
                        label="Max Distance"
                        value={`${deliveryInfo?.preferences?.maxDistance} km`}
                        icon={Navigation}
                        className="p-2"
                      />
                      <InfoItem
                        label="Min Delivery Fee"
                        value={`₦${deliveryInfo?.preferences?.minDeliveryFee}`}
                        icon={DollarSign}
                        className="p-2"
                      />
                      <InfoItem
                        label="Accepted Packages"
                        value={deliveryInfo?.preferences?.acceptedPackageTypes?.join(", ") || "None"}
                        icon={Package}
                        className="p-2"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-[12px] border border-blue-100">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <BadgeCheck className="h-5 w-5" />
                      Verification Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                        <div>
                          <span className="text-sm font-medium">Overall Verified</span>
                          <p className="text-xs text-muted-foreground">Manually mark as fully verified</p>
                        </div>
                        {isSuperAdmin ? (
                          <ToggleVerificationSwitch
                            userId={user._id}
                            currentVerified={deliveryInfo?.verificationStatus?.verified || false}
                            onToggleSuccess={() => refetch()}
                          />
                        ) : (
                          <Badge
                            variant="outline"
                            className={deliveryInfo?.verificationStatus?.verified ? "bg-green-100 text-green-800" : "bg-gray-50"}
                          >
                            {deliveryInfo?.verificationStatus?.verified ? "Verified" : "Pending"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Reviews Section */}
                {reviews.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Customer Reviews ({reviews.length})
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentPage(1);
                          setShowReviewModal(true);
                        }}
                        className="text-blue-600 border-blue-200 rounded-2xl"
                      >
                        View All Reviews
                      </Button>
                    </div>
                    {/* Show first 2 reviews inline */}
                    <div className="space-y-3">
                      {reviews.slice(0, 2).map((review: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-[12px] border border-blue-100">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">{review.rating} / 5</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {review.images.map((img: string, imgIdx: number) => (
                                <a key={imgIdx} href={img} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                  <Image className="h-4 w-4 inline mr-1" />
                                  Image {imgIdx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {reviews.length > 2 && (
                        <Button
                          variant="ghost"
                          className="w-full text-blue-600"
                          onClick={() => {
                            setCurrentPage(1);
                            setShowReviewModal(true);
                          }}
                        >
                          + {reviews.length - 2} more reviews
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Addresses Card */}
          {user?.addresses && user.addresses.length > 0 && (
            <Card className={`${activeTab === "addresses" ? "block" : "hidden"} lg:block lg:col-span-3 border-blue-100 bg-white rounded-2xl`}>
              <CardHeader className="pb-2 border-b border-blue-100 p-4 sm:p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="h-5 w-5 text-blue-600" />
                  Addresses ({user.addresses.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {user.addresses.map((address: any, index: number) => (
                    <div key={address._id || index} className="bg-slate-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-blue-100 text-blue-800">{address.addressType || "Address"}</Badge>
                      </div>
                      <div className="space-y-2">
                        {address.street && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm break-words">{address.street}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPinned className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span className="break-words">
                            {[address.city, address.state, address.zipCode, address.country].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Banks Card */}
          {user?.bank && user.bank.length > 0 && (
            <Card className={`${activeTab === "banks" ? "block" : "hidden"} lg:block lg:col-span-3 border-blue-100 bg-white rounded-2xl`}>
              <CardHeader className="pb-2 border-b border-blue-100 p-4 sm:p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-blue-600" />
                  Bank Accounts ({user.bank.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {user.bank.map((bank: any, index: number) => (
                    <div key={bank._id || index} className="bg-slate-50 p-4 rounded-[12px] border border-blue-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-blue-100 text-blue-800">{bank.bank_name}</Badge>
                        {bank.isActive && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">{bank.account_number}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4 text-blue-600" />
                          <span>{bank.account_name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Statistics Card */}
          <Card className="lg:col-span-3 border-blue-100 bg-white rounded-2xl">
            <CardHeader className="pb-2 border-b border-blue-100 p-4 sm:p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-2xl border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-600 mb-1">Account ID</p>
                  <p className="font-mono text-xs sm:text-sm break-all">{user._id}</p>
                </div>
                <div className="bg-blue-50 p-3 sm:p-4 rounded-2xl border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-600 mb-1">Email Verification</p>
                  <div className="flex items-center gap-1">
                    {user.isVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-green-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-red-600">Not Verified</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 sm:p-4 rounded-2xl border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-600 mb-1">Account Status</p>
                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Avatar Modal */}
      <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profile Picture</DialogTitle>
            <DialogDescription>
              {user.firstName} {user.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={`${user.firstName} ${user.lastName}`}
                className="max-w-full max-h-[70vh] rounded-lg object-contain"
              />
            ) : (
              <Avatar className="w-48 h-48">
                <AvatarFallback className="text-4xl bg-blue-100 text-blue-600">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reviews Modal with Pagination */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white !rounded-2xl">
          <DialogHeader>
            <DialogTitle>All Customer Reviews ({reviews.length})</DialogTitle>
            <DialogDescription>
              Feedback from customers about this delivery partner
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {paginatedReviews.map((review: any, idx: number) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-[12px] border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{review.rating} / 5</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                </div>
                <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {review.images.map((img: string, imgIdx: number) => (
                      <a key={imgIdx} href={img} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                        <Image className="h-4 w-4 inline mr-1" />
                        Image {imgIdx + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade User Dialog */}
      {isSuperAdmin && (
        <UpgradeUserType
          userId={user._id}
          currentUserType={user.userType}
          open={showUpgradeDialog}
          onOpenChange={setShowUpgradeDialog}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}

// Helper components
const Separator = ({ className }: { className?: string }) => (
  <hr className={`border-t border-gray-200 ${className || ""}`} />
);

const Briefcase = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const Settings = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="15" x2="12" y2="3"></line>
    <circle cx="12" cy="12" r="3"></circle>
    <line x1="3" y1="12" x2="9" y2="12"></line>
    <line x1="15" y1="12" x2="21" y2="12"></line>
  </svg>
);
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Bell,
  SirenIcon,
  Layers,
  LockKeyhole,
  DollarSign,
  BanknoteIcon,
  HeadsetIcon,
  CarFrontIcon,
  CuboidIcon,
  UserRound,
  UserPlus,
  Bike,
  Globe,
  Building2,
  Box,
  BookPlusIcon,
} from "lucide-react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useLogoutMutation } from "@/redux/api/apiSlice";
import { clearCredentials } from "@/redux/features/auth/authSlice";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "../../assets/COURIES l.png";
import { useGetUserNotificationsQuery } from "@/redux/features/notificationsApi/notificationApi";

interface LayoutProps {
  children?: React.ReactNode;
}

// Define types for the new menu structure
interface SubMenuItem {
  label: string;
  section: string;
  link: string;
  icon?: React.ElementType;
}

interface MenuItem {
  menuTitle: string;
  icon: React.ElementType;
  submenu: SubMenuItem[];
}

interface MainSection {
  sectionTitle: string;
  mainSectionList: MenuItem[];
}

// Proper menu data structure with mainSectionList
const mainSections: MainSection[] = [
  {
    sectionTitle: "MAIN MENU",
    mainSectionList: [
      {
        menuTitle: "Dashboard",
        icon: LayoutDashboard,
        submenu: [
          {
            label: "Overview",
            section: "overview",
            link: "/dashboard-super-admin",
          },
        ],
      },
      {
        menuTitle: "Country",
        icon: Globe,
        submenu: [
          {
            label: "All Countries",
            section: "countries",
            link: "/dashboard-super-admin/country",
          },
        ],
      },
      {
        menuTitle: "City",
        icon: Building2,
        submenu: [
          {
            label: "All Cities",
            section: "city",
            link: "/dashboard-super-admin/city",
          },
        ],
      },
      {
        menuTitle: "Order",
        icon: Box,
        submenu: [
          {
            label: "All Order",
            section: "orders",
            link: "/dashboard-super-admin/all-order",
          },
          {
            label: "Today Order",
            section: "orders",
            link: "/dashboard-super-admin/today-order",
          },
          {
            label: "Pending Order",
            section: "orders",
            link: "/dashboard-super-admin/pending-order",
          },
          {
            label: "Asssigned Order",
            section: "orders",
            link: "/dashboard-super-admin/assigned-order",
          },
          {
            label: "Ongoing Order",
            section: "orders",
            link: "/dashboard-super-admin/ongoing-order",
          },
          {
            label: "Delivered Order",
            section: "orders",
            link: "/dashboard-super-admin/delivered-order",
          },
          {
            label: "Cancelled Order",
            section: "orders",
            link: "/dashboard-super-admin/cancelled-order",
          },
        ],
      },
      {
        menuTitle: "Reports",
        icon: BookPlusIcon,
        submenu: [
          {
            label: "Admin Earnings",
            section: "audit-log",
            link: "/dashboard-super-admin/admin-earnings",
          },
          {
            label: "Delivery Man Earnings",
            section: "audit-log",
            link: "/dashboard-super-admin/delivery-man-earnings",
          },
          {
            label: "Order Report",
            section: "audit-log",
            link: "/dashboard-super-admin/order-report",
          }
        ],
      },
    ],
  },

  {
    sectionTitle: "User & Role Management",
    mainSectionList: [
      {
        menuTitle: "All Users",
        icon: UserRound,
        submenu: [
          {
            label: "All customers",
            section: "access-control",
            link: "/dashboard-super-admin/manage-customer",
          },
        ],
      },
      {
        menuTitle: "Admin",
        icon: UserPlus,
        submenu: [
          {
            label: "Admin",
            section: "roles",
            link: "/dashboard-super-admin/manage-admins",
          },
          {
            label: "All sub admins",
            section: "access-control",
            link: "/dashboard-super-admin/manage-super-admins",
          },
        ],
      },
      {
        menuTitle: "Delivery Partners",
        icon: Bike,
        submenu: [
          {
            label: "Delivery Men",
            section: "audit-log",
            link: "/dashboard-super-admin/manage-partners",
          },
          {
            label: "Courries Riders",
            section: "drivers",
            link: "/dashboard-super-admin/my-riders",
          },
        ],
      },
    ],
  },
  {
    sectionTitle: "Operations & Logistics",
    mainSectionList: [
      {
        menuTitle: "Vehicles & Deliveries",
        icon: CarFrontIcon,
        submenu: [
          {
            label: "Delivery Options",
            section: "access-control",
            link: "/dashboard-super-admin/manage-delivery-options",
          },
          {
            label: "Geofencing",
            section: "geofencing",
            link: "/dashboard-super-admin/geofencing",
          },
        ],
      },
      {
        menuTitle: "Parcel Options",
        icon: CuboidIcon,
        submenu: [
          {
            label: "Package Types",
            section: "access-control",
            link: "/dashboard-super-admin/manage-package",
          },
        ],
      },
    ],
  },
  {
    sectionTitle: "FINANCE & PAYMENT",
    mainSectionList: [
      {
        menuTitle: "Withdrawal Requests",
        icon: DollarSign,
        submenu: [
          {
            label: "All Requests",
            section: "access-control",
            link: "/dashboard-super-admin/manage-withdraw",
          },
        ],
      },
      {
        menuTitle: "Coupons & Promotions",
        icon: BanknoteIcon,
        submenu: [
          {
            label: "Coupon List",
            section: "audit-log",
            link: "/dashboard-super-admin/coupon-list",
          },
        ],
      },
    ],
  },
  {
    sectionTitle: "COMMUNICATION & SUPPORT",
    mainSectionList: [
      {
        menuTitle: "Customer Support",
        icon: HeadsetIcon,
        submenu: [
          {
            label: "Manage FAQ",
            section: "access-control",
            link: "/dashboard-super-admin/manage-faq",
          },
          {
            label: "Manage Report",
            section: "audit-log",
            link: "/dashboard-super-admin/manage-report",
          },
        ],
      },
    ],
  },
  {
    sectionTitle: "GENERAL SETTINGS",
    mainSectionList: [
      {
        menuTitle: "Policies",
        icon: SirenIcon,
        submenu: [
          {
            label: "Manage Policy",
            section: "access-control",
            link: "/dashboard-super-admin/manage-policy",
          },
        ],
      },
      {
        menuTitle: "Pages",
        icon: Layers,
        submenu: [
          {
            label: "Contact Us",
            section: "audit-log",
            link: "/dashboard-super-admin/manage-contact-us",
          },
        ],
      },
      {
        menuTitle: "API Keys",
        icon: LockKeyhole,
        submenu: [
          {
            label: "API Keys",
            section: "api-keys",
            link: "/dashboard-super-admin/manage-keys",
          },
        ],
      },
    ],
  },
];

const bottomItems = [
  {
    id: "profile",
    label: "Profile & Update",
    icon: User,
    section: "help",
    link: "/dashboard-super-admin/profile",
  },
  {
    id: "logout",
    label: "Logout",
    icon: LogOut,
    section: null,
    link: null,
  },
];

export default function AdminLayout({ children }: LayoutProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useGetUserNotificationsQuery();

  const unreadCount = data?.unreadCount || 0;


  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Track expanded menus by menuTitle – only one can be true at a time
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );
  const location = useLocation();

  // Set expanded state based on current path (only the matching menu)
  useEffect(() => {
    const path = location.pathname;
    let foundMenuTitle: string | null = null;

    for (const section of mainSections) {
      for (const menu of section.mainSectionList) {
        const foundSubItem = menu.submenu.find((sub) => sub.link === path);
        if (foundSubItem) {
          foundMenuTitle = menu.menuTitle;
          break;
        }
      }
      if (foundMenuTitle) break;
    }

    // Reset all to false, then open only the found menu
    const newExpandedState: Record<string, boolean> = {};
    if (foundMenuTitle) {
      newExpandedState[foundMenuTitle] = true;
    }
    setExpandedMenus(newExpandedState);
  }, [location]);

  const toggleMenu = (menuTitle: string) => {
    setExpandedMenus((prev) => {
      // If the clicked menu is already open, close it; otherwise, close all and open this one
      if (prev[menuTitle]) {
        return { ...prev, [menuTitle]: false };
      } else {
        // Close all menus, then open the clicked one
        const newState: Record<string, boolean> = {};
        newState[menuTitle] = true;
        return newState;
      }
    });
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  // Helper to get page title based on current path
  const getPageTitle = () => {
    for (const section of mainSections) {
      for (const menu of section.mainSectionList) {
        for (const subItem of menu.submenu) {
          if (subItem.link === location.pathname) {
            // return `${section.sectionTitle} / ${menu.menuTitle} / ${subItem.label}`;
            return `${menu.menuTitle}`;
          }
        }
      }
    }

    const bottomItem = bottomItems.find(
      (item) => item.link === location.pathname
    );
    if (bottomItem) return bottomItem.label;

    return "Dashboard";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white w-64 fixed h-full transition-transform duration-300 ease-in-out transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static z-30 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <Link to="http://localhost:3000/dashboard-super-admin">
            <img
              src={logo}
              alt="Courries Admin"
              className="rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl"
            />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Scrollable Menu Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <nav className="p-4">
            {mainSections.map((section) => (
              <div key={section.sectionTitle} className="mb-6">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.sectionTitle}
                </p>
                <ul className="space-y-1">
                  {section.mainSectionList.map((menu) => (
                    <li key={menu.menuTitle}>
                      <div>
                        <button
                          onClick={() => toggleMenu(menu.menuTitle)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] font-medium text-sm transition-colors ${expandedMenus[menu.menuTitle]
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <menu.icon size={18} className="flex-shrink-0" />
                            <span className="text-sm truncate">
                              {menu.menuTitle}
                            </span>
                          </div>
                          <ChevronDown
                            size={16}
                            className={`flex-shrink-0 transition-transform ${expandedMenus[menu.menuTitle] ? "rotate-180" : ""
                              }`}
                          />
                        </button>

                        {/* Submenu Items */}
                        {expandedMenus[menu.menuTitle] && (
                          <div className="mt-1 ml-2 space-y-1 border-l-2 border-gray-200 pl-2">
                            {menu.submenu.map((subitem) => (
                              <Link
                                key={subitem.link}
                                to={subitem.link}
                                onClick={() => setSidebarOpen(false)}
                                className={`block w-full text-left px-3 py-1.5 rounded-[6px] text-sm transition-colors truncate ${location.pathname === subitem.link
                                  ? "bg-blue-100 text-blue-600 font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                                  }`}
                                title={subitem.label}
                              >
                                {subitem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Items */}
        <div className="border-t flex-shrink-0">
          <nav className="p-4">
            <ul className="space-y-1">
              {bottomItems.map((item) => (
                <li key={item.id}>
                  {item.id === "logout" ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      title={item.label}
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      <span className="text-sm truncate">{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.link!}
                      onClick={() => setSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-[6px] text-sm transition-colors ${location.pathname === item.link
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                      title={item.label}
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      <span className="text-sm truncate">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm flex-shrink-0">
          <div className="w-full px-4 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden flex-shrink-0"
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <div className="min-w-0">
                  <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                    {getPageTitle()}
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
                {/* Notification Bell */}

                <Link to="/dashboard-super-admin/notifications">
                  <div className="flex relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-gray-700 hover:bg-gray-100 flex-shrink-0"
                    >
                      <Bell size={20} />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                    </Button>
                    {unreadCount > 0 && (
                      <div className="absolute top-1 right-0 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                        <p className="text-white text-xs font-bold">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>


                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0">
                      <Avatar className="w-9 h-9 lg:w-10 lg:h-10 flex-shrink-0">
                        <AvatarImage
                          src={user?.user?.avatar?.url || user?.avatar?.url}
                          alt={user?.user?.name || user?.name || "User"}
                        />
                        <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs lg:text-sm">
                          {user?.user?.name
                            ? user.user.name.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left min-w-0">
                        <div className="text-xs lg:text-sm font-semibold text-gray-900 truncate">
                          {user?.user?.name || user?.name || "User"}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user?.user?.role || user?.role || "Admin"}
                        </div>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white rounded-2xl"
                  >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard-super-admin/profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content – extra bottom padding to prevent content hiding behind fixed footer */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f4f5ff] pb-20">
          <div className="py-6 px-4">
            <Outlet />
            {children}
          </div>
        </main>
      </div>

      {/* Fixed Footer – responsive alignment and left offset */}
      <footer className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-gray-200 py-4 px-6 z-10 shadow-md">
        <p className="text-sm text-gray-500 text-center md:text-right">
          &copy; {new Date().getFullYear()} Courries. All rights reserved.
        </p>
      </footer>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

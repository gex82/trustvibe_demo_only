import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import {
  Home,
  Search,
  FolderOpen,
  MessageCircle,
  Hammer,
  DollarSign,
  LayoutDashboard,
  Scale,
} from "lucide-react";

interface Tab {
  path: string;
  icon: React.ElementType;
  labelKey: string;
}

const customerTabs: Tab[] = [
  { path: "/home", icon: Home, labelKey: "nav.home" },
  { path: "/search", icon: Search, labelKey: "nav.explore" },
  { path: "/projects", icon: FolderOpen, labelKey: "nav.projects" },
  { path: "/messages", icon: MessageCircle, labelKey: "nav.messages" },
];

const contractorTabs: Tab[] = [
  { path: "/home", icon: Home, labelKey: "nav.home" },
  { path: "/browse", icon: Search, labelKey: "nav.browse" },
  { path: "/jobs", icon: Hammer, labelKey: "nav.jobs" },
  { path: "/earnings", icon: DollarSign, labelKey: "nav.earnings" },
  { path: "/messages", icon: MessageCircle, labelKey: "nav.messages" },
];

const adminTabs: Tab[] = [
  { path: "/admin", icon: LayoutDashboard, labelKey: "nav.dashboard" },
  { path: "/admin/projects", icon: FolderOpen, labelKey: "nav.projects" },
  { path: "/admin/cases", icon: Scale, labelKey: "nav.cases" },
];

export default function BottomNav() {
  const { currentUser } = useAuth();
  const { t } = useApp();

  const tabs =
    currentUser?.role === "contractor"
      ? contractorTabs
      : currentUser?.role === "admin"
      ? adminTabs
      : customerTabs;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-40 border-t border-gray-100"
      style={{
        height: 82,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="flex h-full items-start pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-[2px] py-1 transition-all duration-150 ${
                  isActive ? "text-teal-600" : "text-gray-400"
                }`
              }
              end={tab.path === "/admin"}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={isActive ? "text-teal-600" : "text-gray-400"}
                  />
                  <span
                    className={`text-[10px] font-medium ${
                      isActive ? "text-teal-600" : "text-gray-400"
                    }`}
                  >
                    {t(tab.labelKey)}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

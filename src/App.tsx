import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PhoneFrame from "./components/layout/PhoneFrame";
import DevSwitcher from "./components/ui/DevSwitcher";

// Auth
import LoginScreen from "./screens/auth/LoginScreen";

// Customer
import CustomerHomeScreen from "./screens/customer/CustomerHomeScreen";
import SearchScreen from "./screens/customer/SearchScreen";
import ContractorProfileScreen from "./screens/customer/ContractorProfileScreen";
import MyProjectsScreen from "./screens/customer/MyProjectsScreen";
import ProjectDetailScreen from "./screens/customer/ProjectDetailScreen";
import FundEscrowScreen from "./screens/customer/FundEscrowScreen";
import ApproveReleaseScreen from "./screens/customer/ApproveReleaseScreen";
import SubmitReviewScreen from "./screens/customer/SubmitReviewScreen";
import MessagesScreen from "./screens/customer/MessagesScreen";
import NewProjectScreen from "./screens/customer/NewProjectScreen";

// Contractor
import ContractorHomeScreen from "./screens/contractor/ContractorHomeScreen";
import BrowseProjectsScreen from "./screens/contractor/BrowseProjectsScreen";
import ProjectBidScreen from "./screens/contractor/ProjectBidScreen";
import MyJobsScreen from "./screens/contractor/MyJobsScreen";
import EarningsScreen from "./screens/contractor/EarningsScreen";

// Admin
import AdminDashboardScreen from "./screens/admin/AdminDashboardScreen";
import AdminProjectsScreen from "./screens/admin/AdminProjectsScreen";
import AdminCasesScreen from "./screens/admin/AdminCasesScreen";

function AppRoutes() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (currentUser.role === "customer") {
    return (
      <Routes>
        <Route path="/home" element={<CustomerHomeScreen />} />
        <Route path="/search" element={<SearchScreen />} />
        <Route path="/contractor/:id" element={<ContractorProfileScreen />} />
        <Route path="/projects" element={<MyProjectsScreen />} />
        <Route path="/projects/new" element={<NewProjectScreen />} />
        <Route path="/project/:id" element={<ProjectDetailScreen />} />
        <Route path="/project/:id/fund" element={<FundEscrowScreen />} />
        <Route path="/project/:id/release" element={<ApproveReleaseScreen />} />
        <Route path="/project/:id/review" element={<SubmitReviewScreen />} />
        <Route path="/messages" element={<MessagesScreen />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  }

  if (currentUser.role === "contractor") {
    return (
      <Routes>
        <Route path="/home" element={<ContractorHomeScreen />} />
        <Route path="/browse" element={<BrowseProjectsScreen />} />
        <Route path="/project/:id/bid" element={<ProjectBidScreen />} />
        <Route path="/jobs" element={<MyJobsScreen />} />
        <Route path="/earnings" element={<EarningsScreen />} />
        <Route path="/messages" element={<MessagesScreen />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  }

  // Admin
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboardScreen />} />
      <Route path="/admin/projects" element={<AdminProjectsScreen />} />
      <Route path="/admin/cases" element={<AdminCasesScreen />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <PhoneFrame>
        <AppRoutes />
      </PhoneFrame>
      <DevSwitcher />
    </>
  );
}

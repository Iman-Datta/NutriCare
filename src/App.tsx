
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BMICalculator from "./pages/BMICalculator";
import DietaryPreferences from "./pages/DietaryPreferences";
import DietPlan from "./pages/DietPlan";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<AboutUs />} />
              
              <Route 
                path="/bmi-calculator" 
                element={
                  <ProtectedRoute>
                    <BMICalculator />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dietary-preferences" 
                element={
                  <ProtectedRoute>
                    <DietaryPreferences />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/diet-plan" 
                element={
                  <ProtectedRoute>
                    <DietPlan />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Organizer from "./pages/Organizer";
import Unauthorized from "./pages/Unauthorized";
import Theory from "./pages/Theory";
import Decision from "./pages/Decision";
import Confirm from "./pages/Confirm";
import Results from "./pages/Results";
import Rank from "./pages/Rank";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/organizer" element={
              <ProtectedRoute requiredRole="organizer">
                <Organizer />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute requiredRole="participant">
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/theory" element={
              <ProtectedRoute requiredRole="participant">
                <Theory />
              </ProtectedRoute>
            } />
            <Route path="/decision" element={
              <ProtectedRoute requiredRole="participant">
                <Decision />
              </ProtectedRoute>
            } />
            <Route path="/confirm" element={
              <ProtectedRoute requiredRole="participant">
                <Confirm />
              </ProtectedRoute>
            } />
            <Route path="/results/:roundId" element={
              <ProtectedRoute requiredRole="participant">
                <Results />
              </ProtectedRoute>
            } />
            <Route path="/rank" element={
              <ProtectedRoute requiredRole="participant">
                <Rank />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

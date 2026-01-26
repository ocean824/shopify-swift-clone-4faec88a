import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import BundlePage from "./pages/BundlePage";
import NotFound from "./pages/NotFound";
import { useCartSync } from "./hooks/useCartSync";

const queryClient = new QueryClient();

function AppContent() {
  // Sync cart with Shopify on page load and visibility change
  useCartSync();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/product/:handle" element={<ProductPage />} />
      <Route path="/bundle" element={<BundlePage />} />
      <Route path="/products" element={<Index />} />
      <Route path="/collections/:collection" element={<Index />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
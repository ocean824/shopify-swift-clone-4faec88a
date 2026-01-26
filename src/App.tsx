import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import MerchPage from "./pages/MerchPage";
import DrumKitsPage from "./pages/DrumKitsPage";
import MidiKitsPage from "./pages/MidiKitsPage";
import AllKitsBundlePage from "./pages/AllKitsBundlePage";
import TermsPage from "./pages/TermsPage";
import CreditsPage from "./pages/CreditsPage";
import ContactPage from "./pages/ContactPage";
import BeatsPage from "./pages/BeatsPage";
import ApplyPage from "./pages/ApplyPage";
import SocietyPage from "./pages/SocietyPage";
import SubscribePage from "./pages/SubscribePage";
import NotFound from "./pages/NotFound";
import { useCartSync } from "./hooks/useCartSync";

const queryClient = new QueryClient();

function AppContent() {
  useCartSync();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/product/:handle" element={<ProductPage />} />
      <Route path="/merch" element={<MerchPage />} />
      <Route path="/drum-kits" element={<DrumKitsPage />} />
      <Route path="/midi-kits" element={<MidiKitsPage />} />
      <Route path="/bundle" element={<AllKitsBundlePage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/credits" element={<CreditsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/beats" element={<BeatsPage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/society" element={<SocietyPage />} />
      <Route path="/subscribe" element={<SubscribePage />} />
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

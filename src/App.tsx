import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          {/* AnimatePresence enables the exit animation of the loader */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
            ) : (
              <Routes>
                <Route path="/" element={<Index />} />
                {/* Add other routes here if needed */}
              </Routes>
            )}
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
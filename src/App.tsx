import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { FloatingChatWidget } from "./components/FloatingChatWidget";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useWeatherStore } from "./lib/stores/weatherStore";
import { LiveBookingNotifications } from "./components/LiveBookingNotifications";
import { SocialProofNotification } from "./components/SocialProofNotification";
import { RoomComparisonTool } from "./components/RoomComparisonTool";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import { BookingFlow } from "./components/BookingFlow";
import { useGlobalBookingStore } from "./lib/stores/globalBookingStore";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const { theme } = useWeatherStore();
  const { activeRoom, isBookingOpen, closeBooking } = useGlobalBookingStore();

  useEffect(() => {
    try {
      document.body.className = `theme-${theme}`;
    } catch (error) {
      console.error('Theme error:', error);
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
            <FloatingChatWidget />
            <LiveBookingNotifications />
            <SocialProofNotification />
            <RoomComparisonTool />
            {activeRoom && (
              <BookingFlow
                open={isBookingOpen}
                onOpenChange={(open) => {
                  if (!open) closeBooking();
                }}
                room={activeRoom}
              />
            )}
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

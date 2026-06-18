import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './PageTransition';
import { Suspense, lazy } from 'react';
import { PageSkeleton } from './LoadingSkeleton';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Rooms = lazy(() => import('@/pages/Rooms'));
const RoomDetails = lazy(() => import('@/pages/RoomDetails'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const Property3D = lazy(() => import('@/pages/Property3D'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Auth = lazy(() => import('@/pages/Auth'));
const Profile = lazy(() => import('@/pages/Profile'));
const Promotions = lazy(() => import('@/pages/Promotions'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Wishlist = lazy(() => import('@/pages/Wishlist'));

// New Travel Ecosystem Pages
const DiscoverDestinations = lazy(() => import('@/pages/DiscoverDestinations'));
const TripPlanner = lazy(() => import('@/pages/TripPlanner'));
const ExpenseManager = lazy(() => import('@/pages/ExpenseManager'));
const TravelMemories = lazy(() => import('@/pages/TravelMemories'));
const Experiences = lazy(() => import('@/pages/Experiences'));

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageSkeleton />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/rooms" element={<PageTransition><Rooms /></PageTransition>} />
          <Route path="/rooms/:id" element={<PageTransition><RoomDetails /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="/3d-explorer" element={<PageTransition><Property3D /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/promotions" element={<PageTransition><Promotions /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
          {/* Travel Ecosystem Routes */}
          <Route path="/discover" element={<PageTransition><DiscoverDestinations /></PageTransition>} />
          <Route path="/trip-planner" element={<PageTransition><TripPlanner /></PageTransition>} />
          <Route path="/expenses" element={<PageTransition><ExpenseManager /></PageTransition>} />
          <Route path="/memories" element={<PageTransition><TravelMemories /></PageTransition>} />
          <Route path="/experiences" element={<PageTransition><Experiences /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

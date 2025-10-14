import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import BlogPostDetail from "./pages/BlogPostDetail";
import NotFound from "./pages/NotFound";
import AuthScreens from "./pages/AuthScreens";
import { AuthProvider, useAuth } from "./context/AuthContext";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Profile from "./pages/Profile";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
 <QueryClientProvider client={queryClient}>
  <TooltipProvider>
   <Toaster />
   <Sonner />
   <AuthProvider>
    <BrowserRouter>
     <ScrollToTop />

     <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/product-detail" element={<ProductDetail />} />
      <Route
       path="/cart"
       element={
        <ProtectedRoute>
         <Cart />
        </ProtectedRoute>
       }
      />
      <Route
       path="/checkout"
       element={
        <ProtectedRoute>
         <Checkout />
        </ProtectedRoute>
       }
      />
      <Route
       path="/order-confirmation"
       element={
        <ProtectedRoute>
         <OrderConfirmation />
        </ProtectedRoute>
       }
      />
      {/* <Route path="/blog-post-detail" element={<BlogPostDetail />} /> */}
      <Route path="/blog/:slug" element={<BlogPostDetail />} />
      <Route
       path="/profile"
       element={
        <ProtectedRoute>
         <Profile />
        </ProtectedRoute>
       }
      />
      <Route path="/login" element={<AuthScreens />} /> {/* keep /login */}
      <Route path="*" element={<NotFound />} />
     </Routes>
    </BrowserRouter>
   </AuthProvider>
  </TooltipProvider>
 </QueryClientProvider>
);

export default App;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
 const { isAuthenticated, isLoading } = useAuth();
 const location = useLocation();

 if (isLoading) return null; // or a spinner

 if (!isAuthenticated) {
  return (
   <Navigate
    to="/login"
    replace
    state={{ from: location.pathname + location.search }} // remember where they were headed
   />
  );
 }
 return <>{children}</>;
}

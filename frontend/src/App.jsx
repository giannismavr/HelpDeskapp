import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CreateTicket from "./pages/CreateTicket";
import MyTickets from "./pages/MyTickets";
import TicketDetails from "./pages/TicketDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyAccount from "./pages/MyAccount";


import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";
import AdminUsers from "./pages/AdminUsers";


export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <div className="mt-4">
          {/* W3Schools: React Router uses Routes + Route to map paths to components */}
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes: must be logged in */}
            <Route
              path="/tickets"
              element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tickets/:id"
              element={
                <ProtectedRoute>
                  <TicketDetails />
                </ProtectedRoute>
              }
            />

            {/* Create Ticket
              - user: δημιουργεί ticket για τον εαυτό του
              - agent/admin: μπορούν να δημιουργήσουν ticket και για λογαριασμό user
            */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <RoleRoute allow={["user", "agent", "admin"]}>
                    <CreateTicket />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            {/* Admin route */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <RoleRoute allow={["admin"]}>
                    <AdminUsers />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <MyAccount />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

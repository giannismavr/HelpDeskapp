// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
// import Home from "./pages/Home";

// function App() {
//   return (
//     <div className="container mt-4">
//       <Home />
//     </div>
//   );
// }

// export default App;

// import CreateTicket from "./pages/CreateTicket";

// export default function App() {
//   return <CreateTicket />;
// }

// import MyTickets from "./pages/MyTickets";

// export default function App() {
//   return <MyTickets />;
// }



// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import CreateTicket from "./pages/CreateTicket";
// import MyTickets from "./pages/MyTickets";
// import TicketDetails from "./pages/TicketDetails";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <div className="app-container">
//         <Navbar />

//         <div className="mt-4">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/create" element={<CreateTicket />} />
//             <Route path="/tickets" element={<MyTickets />} />
//             <Route path="/tickets/:id" element={<TicketDetails />} />
//           </Routes>
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateTicket from "./pages/CreateTicket";
import MyTickets from "./pages/MyTickets";
import TicketDetails from "./pages/TicketDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

// const API_BASE = "http://localhost:5001";

// export async function createTicket(payload) {
//   const res = await fetch(`${API_BASE}/api/tickets`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });  

//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     const msg = data?.message || "Αποτυχία δημιουργίας ticket.";
//     throw new Error(msg);
//   }
//   return data;
// }

// export async function getTickets() {
//   const res = await fetch("http://localhost:5001/api/tickets");

//   const data = await res.json();
//   if (!res.ok) {
//     throw new Error("Αποτυχία φόρτωσης tickets");
//   }

//   return data.tickets;
// }

// export async function getTicketById(id) {
//   const res = await fetch(`${API_BASE}/api/tickets/${id}`);
//   if (!res.ok) throw new Error("Ticket not found");
//   return res.json();
// }

const API_BASE = "http://localhost:5001";

// WlocalStorage usage
function getToken() {
  return localStorage.getItem("token") || "";
}

// Fetch API + headers
async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

// -------- AUTH --------
export const login = (payload) =>
  apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });

export const register = (payload) =>
  apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });

// -------- TICKETS --------
export const createTicket = (payload) =>
  apiFetch("/api/tickets", { method: "POST", body: JSON.stringify(payload) });

export const getTickets = async () => {
  const data = await apiFetch("/api/tickets");
  return data.tickets;
};

export const getTicketById = (id) => apiFetch(`/api/tickets/${id}`);

// -------- USERS (ADMIN) --------
export const getUsers = async () => {
  const data = await apiFetch("/api/users");
  return data.users;
};

export const createUser = (payload) =>
  apiFetch("/api/users", { method: "POST", body: JSON.stringify(payload) });

export const updateUserRole = (id, role) =>
  apiFetch(`/api/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) });

export const deleteUser = (id) =>
  apiFetch(`/api/users/${id}`, { method: "DELETE" });


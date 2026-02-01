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

// -------- TICKETS (ACTIONS) --------

// Add comment to a ticket (user: own tickets, staff: all)
export const addTicketComment = (id, message) =>
  apiFetch(`/api/tickets/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });

// Update ticket status (agent/admin)
export const updateTicketStatus = (id, status) =>
  apiFetch(`/api/tickets/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// Update ticket priority (agent/admin)
export const updateTicketPriority = (id, priority) =>
  apiFetch(`/api/tickets/${id}/priority`, {
    method: "PATCH",
    body: JSON.stringify({ priority }),
  });

// Delete tickets only agent/admin
export const deleteTicket = (id) =>
  apiFetch(`/api/tickets/${id}`, { method: "DELETE" });



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

// USER: change my password
export const changeMyPassword = ({ oldPassword, newPassword }) =>
  apiFetch("/api/auth/change-password", { method: "PATCH", body: JSON.stringify({ oldPassword, newPassword }) });

// ADMIN: reset user password
export const adminResetUserPassword = (id, newPassword) =>
  apiFetch(`/api/users/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify({ newPassword }),
  });

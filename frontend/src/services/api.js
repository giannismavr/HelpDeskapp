const API_BASE = "http://localhost:5001";

export async function createTicket(payload) {
  const res = await fetch(`${API_BASE}/api/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });  

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || "Αποτυχία δημιουργίας ticket.";
    throw new Error(msg);
  }
  return data;
}

export async function getTickets() {
  const res = await fetch("http://localhost:5001/api/tickets");

  const data = await res.json();
  if (!res.ok) {
    throw new Error("Αποτυχία φόρτωσης tickets");
  }

  return data.tickets;
}

export async function getTicketById(id) {
  const res = await fetch(`/api/tickets/${id}`);
  if (!res.ok) throw new Error("Ticket not found");
  return res.json();
}


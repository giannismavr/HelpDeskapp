export const getTicketById = async (id) => {
  const res = await fetch(`/api/tickets/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch ticket");
  }

  return res.json();
};

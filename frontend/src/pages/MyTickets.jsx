// import { useEffect, useState } from "react";
// import { getTickets } from "../services/api";

// export default function MyTickets() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchTickets() {
//       try {
//         const data = await getTickets();
//         setTickets(data);
//       } catch (err) {
//         setError("Σφάλμα κατά τη φόρτωση των tickets.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTickets();
//   }, []);

//   if (loading) {
//     return <div className="text-center mt-4">Φόρτωση tickets...</div>;
//   }

//   if (error) {
//     return <div className="alert alert-danger mt-4">{error}</div>;
//   }

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-3">Τα Tickets μου</h2>

//       {tickets.length === 0 ? (
//         <p>Δεν υπάρχουν tickets.</p>
//       ) : (
//         <table className="table table-bordered table-hover">
//           <thead className="table-light">
//             <tr>
//               <th>Θέμα</th>
//               <th>Κατηγορία</th>
//               <th>Προτεραιότητα</th>
//               <th>Κατάσταση</th>
//               <th>Ημερομηνία</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tickets.map((ticket) => (
//               <tr key={ticket._id}>
//                 <td>{ticket.subject}</td>
//                 <td>{ticket.category}</td>
//                 <td>{ticket.priority}</td>
//                 <td>
//                   <span className="badge bg-secondary">
//                     {ticket.status}
//                   </span>
//                 </td>
//                 <td>
//                   {new Date(ticket.createdAt).toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getTickets } from "../services/api";

function StatusBadge({ status }) {
  const cls =
    status === "Pending"
      ? "bg-warning text-dark"
      : status === "Resolved"
      ? "bg-success"
      : "bg-secondary";

  return <span className={`badge ${cls}`}>{status}</span>;
}

function PriorityBadge({ priority }) {
  const cls =
    priority === "High"
      ? "bg-danger"
      : priority === "Medium"
      ? "bg-primary"
      : "bg-secondary";

  return <span className={`badge ${cls}`}>{priority}</span>;
}

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (err) {
        setError("Σφάλμα κατά τη φόρτωση των tickets.");
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  if (loading) return <div className="text-center mt-4">Φόρτωση tickets...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="page-title">Τα Tickets μου</h2>

      {tickets.length === 0 ? (
        <p>Δεν υπάρχουν tickets.</p>
      ) : (
        <>
          {/* ✅ MOBILE VIEW (cards) */}
          <div className="d-lg-none">
            <div className="row g-3">
              {tickets.map((t) => (
                <div className="col-12" key={t._id}>
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1">{t.subject}</h5>
                        <StatusBadge status={t.status} />
                      </div>
                      <p className="mb-3 text-muted ticket-desc">
                        {t.description}
                      </p>

                      <div className="text-muted small mb-3">{t.email}</div>

                      <div className="d-flex gap-2 flex-wrap mb-3">
                        <span className="badge bg-light text-dark border">
                          {t.category}
                        </span>
                        <PriorityBadge priority={t.priority} />
                      </div>

                      <div className="text-muted small">
                        {new Date(t.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ DESKTOP/TABLET VIEW (table) */}
          <div className="d-none d-lg-block">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Θέμα</th>
                    <th>Email</th>
                    <th>Κατηγορία</th>
                    <th>Προτεραιότητα</th>
                    <th>Κατάσταση</th>
                    <th>Ημερομηνία</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t._id}>
                      <td style={{ maxWidth: 320 }}>
                        <div className="fw-semibold text-truncate">{t.subject}</div>
                        <div className="text-muted small mt-1 ticket-desc-2lines">
                            {t.description}
                        </div>
                      </td>
                      <td style={{ maxWidth: 220 }}>
                        <div className="text-truncate">{t.email}</div>
                      </td>
                      <td>{t.category}</td>
                      <td>
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td>{new Date(t.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

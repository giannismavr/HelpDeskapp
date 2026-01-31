import { useEffect, useState } from "react";
import { getTickets } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



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
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [fStatus, setFStatus] = useState("All");
  const [fPriority, setFPriority] = useState("All");
  const [fCategory, setFCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");




  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (err) {
        console.log("getTickets error:", err);
        setError("Σφάλμα κατά τη φόρτωση των tickets.");
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);



  if (loading) return <div className="text-center mt-4">Φόρτωση tickets...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  const filteredTickets = (tickets || [])
    .filter((t) => {
      const q = search.trim().toLowerCase();

      const okSearch =
        !q ||
        (t.subject || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.name || "").toLowerCase().includes(q) ||
        (t.email || "").toLowerCase().includes(q) ||
        (t.category || "").toLowerCase().includes(q) ||
        (t.status || "").toLowerCase().includes(q) ||
        (t.priority || "").toLowerCase().includes(q);

      if (!okSearch) return false;

      const okStatus = fStatus === "All" || t.status === fStatus;
      const okPriority = fPriority === "All" || t.priority === fPriority;
      const okCategory = fCategory === "All" || t.category === fCategory;

      return okStatus && okPriority && okCategory;
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? db - da : da - db;
    });


  return (
    <div className="container mt-4">
      <h2 className="page-title">Τα Tickets μου</h2>

      <div className="row align-items-center g-2 mb-3">
        <div className="col-12 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Αναζήτηση (θέμα, περιγραφή, email, κατηγορία...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-auto">
          <span className="text-muted small">
            Εμφάνιση: {filteredTickets.length} / {tickets.length}
          </span>
        </div>
      </div>
  
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-3">
          <label className="form-label mb-1">Status</label>
          <select 
            className="form-select" 
            value={fStatus} 
            onChange={(e) => setFStatus(e.target.value)}>

            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="col-12 col-md-3">
          <label className="form-label mb-1">Priority</label>
          <select 
            className="form-select" 
            value={fPriority} 
            onChange={(e) => setFPriority(e.target.value)}>

            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="col-12 col-md-3">
          <label className="form-label mb-1">Category</label>
          <select 
            className="form-select" 
            value={fCategory} 
            onChange={(e) => setFCategory(e.target.value)}>

            <option value="All">All</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Billing">Billing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="col-12 col-md-3">
          <label className="form-label mb-1">Sort</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div className="col-12 d-flex justify-content-end">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setSearch("");
              setFStatus("All");
              setFPriority("All");
              setFCategory("All");
              setSortBy("newest");
            }}
          >
            Reset
          </button>
        </div>
      </div>  

      {filteredTickets.length === 0 ? (
        <p>Δεν υπάρχουν tickets.</p>
      ) : (
        <>
          {/* ✅ MOBILE VIEW (cards) */}
          <div className="d-lg-none">
            <div className="row g-3">
              {filteredTickets.map((t) => (
                <div className="col-12" key={t._id}>
                  <div className="card shadow-sm border-0" role="button" onClick={() => navigate(`/tickets/${t._id}`)} >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1">
                          <Link to={`/tickets/${t._id}`} className="text-decoration-none">
                            {t.subject}
                          </Link>
                        </h5>
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
                  {filteredTickets.map((t) => (
                    <tr key={t._id}>
                      {/* <td style={{ maxWidth: 320 }}>
                        <div className="fw-semibold text-truncate">{t.subject}</div>
                        <div className="text-muted small mt-1 ticket-desc-2lines">
                            {t.description}
                        </div>
                      </td> */}
                      <td>
                        <Link to={`/tickets/${t._id}`} className="text-decoration-none fw-semibold">
                          {t.subject}
                        </Link>

                        {t.description && (
                          <div className="text-muted small mt-1">
                            {t.description.length > 80 ? t.description.slice(0, 80) + "..." : t.description}
                          </div>
                        )}
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

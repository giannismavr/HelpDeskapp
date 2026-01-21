// function Home() {
//   return (
//     <div className="text-center">
//       <h1 className="mb-4">Help Desk Ticketing System</h1>

//       <p className="lead">
//         Υποβάλετε ένα αίτημα υποστήριξης ή δείτε την κατάσταση των αιτημάτων σας.
//       </p>

//       <div className="d-flex justify-content-center gap-3 mt-4">
//         <button className="btn btn-primary">
//           Δημιουργία Νέου Ticket
//         </button>

//         <button className="btn btn-outline-secondary">
//           Τα Tickets μου
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Home;


// import { Link } from "react-router-dom";

// function Home() {
//   return (
//     <div className="text-center">
//       <h1 className="mb-4">Help Desk Ticketing System</h1>

//       <p className="lead">
//         Υποβάλετε ένα αίτημα υποστήριξης ή δείτε την κατάσταση των αιτημάτων σας.
//       </p>

//       <div className="d-flex justify-content-center gap-3 mt-4">
//         <Link className="btn btn-primary" to="/create">
//           Δημιουργία Νέου Ticket
//         </Link>

//         <Link className="btn btn-outline-secondary" to="/tickets">
//           Τα Tickets μου
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Home;


import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8">
        <div className="card shadow-sm border-0 p-4 p-md-5 text-center">
          <div className="badge bg-primary-subtle text-primary mb-3 align-self-center">
            Customer Support Ticketing
          </div>

          <h1 className="display-6 fw-bold mb-3">Help Desk Ticketing System</h1>

          <p className="lead text-muted mb-4">
            Υποβάλετε ένα αίτημα υποστήριξης ή δείτε την κατάσταση των αιτημάτων σας.
          </p>

          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Link className="btn btn-primary btn-lg px-4" to="/create">
              Δημιουργία Νέου Ticket
            </Link>

            <Link className="btn btn-outline-primary btn-lg px-4" to="/tickets">
              Τα Tickets μου
            </Link>
          </div>

          <hr className="my-4" />

          <div className="row text-start g-3">
            <div className="col-12 col-md-4">
              <div className="p-3 bg-light rounded-3 h-100">
                <div className="fw-semibold">Κατηγορίες</div>
                <div className="text-muted small">Hardware / Software / Network</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-3 bg-light rounded-3 h-100">
                <div className="fw-semibold">Προτεραιότητα</div>
                <div className="text-muted small">Low / Medium / High</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-3 bg-light rounded-3 h-100">
                <div className="fw-semibold">Κατάσταση</div>
                <div className="text-muted small">Pending / In Progress / Resolved</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-muted small mt-3">
          © HelpDesk App
        </p>
      </div>
    </div>
  );
}


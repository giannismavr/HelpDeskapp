import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import { changeMyPassword } from "../services/api";


export default function MyAccount() {
    const { user } = useAuth();

    if (!user) {
        return (
        <div className="container mt-4 alert alert-warning">
            Not logged in.
        </div>
        );
    }
    async function onChangePassword() {
        const oldPassword = prompt("Current password:");
        if (oldPassword === null) return;

        const newPassword = prompt("New password (min 6 chars):");
        if (newPassword === null) return;

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        try {
            await changeMyPassword({ oldPassword, newPassword });
            alert("✅ Password updated!");
        } catch (e) {
            alert(e.message || "Error updating password");
        }
    }


    return (
    <div className="container mt-4" style={{ maxWidth: 720 }}>
        <h3 className="mb-3">My Account</h3>

        <div className="card shadow-sm">
            <div className="card-body">
            <div className="mb-2"><strong>Name:</strong> {user.name || "-"}</div>
            <div className="mb-2"><strong>Email:</strong> {user.email}</div>
            <div className="mb-3"><strong>Role:</strong> {user.role}</div>

            <div className="d-flex gap-2">
                <button className="btn btn-outline-primary" onClick={onChangePassword}>
                Change Password
                </button>

                <Link className="btn btn-outline-secondary" to="/tickets">
                Go to Tickets
                </Link>
            </div>
            </div>
        </div>
    </div>
  );
}

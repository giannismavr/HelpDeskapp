export default function Footer() {
  return (
    <footer className="app-footer border-top bg-white">
      <div className="container py-3 d-flex flex-column flex-md-row gap-2 justify-content-between align-items-center">
        <div className="text-muted small">© {new Date().getFullYear()} HelpDesk App</div>
        <div className="text-muted small">
          Support Ticketing System
        </div>
      </div>
    </footer>
  );
}
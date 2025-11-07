import ThemeToggle from "../components/ThemeToggle";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const UI : React.FC = () => {

    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout();
        navigate("/", { replace: true });
    };

    return (

        
        <div className="p-3 w-full flex items-center bg-[var(--secondary)]/40 shadow-md rounded-b-md">
            <div>
                <p className="text-xm font-bold tracking-widest mb-2 mx-5 text-[var(--text)] hover:text-[var(--text)]/70 hover:underline transition"><Link to="/">Home</Link></p>
            </div>
            <div>
                <p className="text-xm font-bold tracking-widest mb-2 text-[var(--text)] hover:text-[var(--text)]/70 hover:underline transition"><Link to="/dashboard">Dashboard</Link></p>
            </div>
            <div className="absolute right-15 flex items-center">
                {auth.checking ? (
          <span className="text-[var(--text)]/80">...</span>
        ) : auth.isAuthenticated ? (
          
          <button onClick={handleLogout} aria-label="Logout" className="text-[var(--text)] hover:opacity-80 flex items-center gap-1 hover:underline transition">
            <label>Logout</label>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 12h9" />
            </svg>
          </button>
        ) : (
          
          <Link to="/auth/login" aria-label="Login" className="text-[var(--text)] hover:opacity-80 flex items-center gap-1 hover:underline transition">
            <label>Login</label>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M3 12h12" />
            </svg>
          </Link>
        )}
            </div>
            <div className="ml-auto">
                <ThemeToggle />
            </div>
        </div>
        
    );

}
export default UI;
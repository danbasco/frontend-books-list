import { useNavigate } from "react-router";
import darkLogo from "~/assets/dark.png";
import lightLogo from "~/assets/light.png";
import { useAuth } from "~/context/AuthContext";


export default function Home() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[var(--background)] text-[var(--text)]">
      {/* topo com ações (manter pequeno para não competir com a logo central) */}
      

      {/* hero central com logo grande */}
      <section className="w-full max-w-5xl mx-auto text-center flex flex-col items-center gap-6">
        <h1 className="flex flex-col items-center">
          {/* logo grande e responsiva; imagem já contém o texto do título */}
          <img
            src={lightLogo}
            alt="Litly"
            className="w-40 sm:w-56 md:w-72 lg:w-80 h-auto dark:hidden mx-auto"
          />
          <img
            src={darkLogo}
            alt="Litly"
            className="w-40 sm:w-56 md:w-72 lg:w-80 h-auto hidden dark:block mx-auto"
          />
          {/* elemento h1 sem texto visual (logo contém o título) para SEO/acessibilidade */}
          <span className="sr-only">Litly</span>
        </h1>

        <p className="text-md md:text-lg text-[var(--muted)] max-w-2xl mx-auto">
          Organize and track your literary journey. Register, Edit, and Discover your favorite books in an elegant and simple way.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-lg bg-[var(--accent)] text-[var(--text)] font-semibold shadow-md hover:scale-[1.02] transition"
          >
            Get Started
          </button>

          {!auth.isAuthenticated && <button
            onClick={() => navigate("/auth/register")}
            className="px-6 py-3 rounded-lg bg-transparent border border-[var(--accent)] text-[var(--text)] hover:bg-[var(--accent)]/10 transition"
          >
            Create Account
          </button>}
          
        </div>
      </section>

      {/* features e CTA mais abaixo */}
      <section className="w-full max-w-5xl mx-auto mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <article className="p-4 rounded-lg border border-[var(--accent)] bg-[var(--primary)]/30">
            <h3 className="font-semibold">Manage Your Books</h3>
            <p className="text-sm text-[var(--muted)]">Add, edit and organize your reading list.</p>
          </article>

          <article className="p-4 rounded-lg border border-[var(--accent)] bg-[var(--primary)]/30">
            <h3 className="font-semibold">Track Your Progress</h3>
            <p className="text-sm text-[var(--muted)]">Monitor reading status and achievements.</p>
          </article>

          <article className="p-4 rounded-lg border border-[var(--accent)] bg-[var(--primary)]/30">
            <h3 className="font-semibold">Discover New Reads</h3>
            <p className="text-sm text-[var(--muted)]">Find and explore new books to enjoy.</p>
          </article>
        </div>

        {!auth.isAuthenticated && 
        <div className="mt-6 p-6 rounded-lg bg-[var(--secondary)]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold">Start your digital library with Litly</p>
            <p className="text-sm text-[var(--muted)] hidden sm:block">Register, manage and enjoy your personal collection. Already have an account?</p>
          </div>
          <div>
            <button
              onClick={() => navigate("/auth/login")}
              className="px-5 py-2 rounded-md bg-[var(--accent)] text-[var(--text)] font-semibold hover:scale-[1.02] transition hover:bg-[var(--accent)]/90 hover:cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
        
        }
        
      </section>

      <footer className="w-full max-w-5xl mx-auto mt-10 text-center text-sm text-[var(--muted)]">
        © {new Date().getFullYear()} Litly. All rights reserved.
      </footer>
    </main>
  );
}
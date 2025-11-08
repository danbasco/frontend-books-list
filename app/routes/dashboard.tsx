import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router";
import Loader from "~/components/Loader";
import { useAuth } from "~/context/AuthContext";
import Books from "~/components/dashboard/Books";
import "~/styles/loader.css";
import { type Book } from "~/types/book.type";
import FilterBook from "~/components/dashboard/FilterBook";


const Dashboard: React.FC = () => {

    const BASEURL = import.meta.env.VITE_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const TOKEN_KEY = "token";

    const normalizeBook = (b: any): Book => {
        const {_id, id, ...rest} = b?? {};
        return {
        ...rest,
        id: id ?? (_id ? String(_id) : undefined),
        } as Book;
    };


    const [books, setBooks] = React.useState<Book[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [viewFilter, setViewFilter] = React.useState<boolean>(false);
    const [filterValue, setFilterValue] = React.useState<string>("");

    const originalBooksRef = useRef<Book[]>([]);

    useEffect(() => {

        setLoading(true);

        const fetchBooks = async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) return;

            const response = await fetch(`${BASEURL}/books`, {
                headers: {
                "Authorization": `Bearer ${token}`
                }
            });

            if(response.status === 404) {
                originalBooksRef.current = [];
                setBooks([]);
                return;
            }

            if (!response.ok) {
                console.error("Error fetching books:", response.statusText);
                return;
            }

            const data = await response.json();
            const list = Array.isArray(data?.data) ? data.data.map((item: any) => normalizeBook(item)) : [];
            
            originalBooksRef.current = list;
            setBooks(list);
        };

        fetchBooks();
        setLoading(false);

    }, []);

    const auth = useAuth();

    if (auth.checking) {
        return <Loader />;
    }

    if (!auth.isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    const handleCreated = (book: Book) => {
        const isTemp = typeof book.id === "string" && book.id.startsWith("temp-");

        // Se for um temp id, insere otimisticamente (se ainda não existir)
        if (isTemp) {
            originalBooksRef.current = originalBooksRef.current.some((b) => b.id === book.id)
                ? originalBooksRef.current.map((b) => (b.id === book.id ? book : b))
                : [book, ...originalBooksRef.current];

            setBooks((prev) => {
                if (prev.some((b) => b.id === book.id)) return prev;
                return [book, ...prev];
            });
            return;
        }

        // Se for o livro real, tenta substituir um item existente (por id, por title+author ou por temp id)
        setBooks((prev) => {
            // 1) substitui por id exato
            if (prev.some((b) => b.id === book.id)) {
                return prev.map((b) => (b.id === book.id ? book : b));
            }

            // 2) procura por correspondência title+author (fallback) ou por temp id e substitui
            const idx = prev.findIndex(
                (b) =>
                    (b.title === book.title && b.author === book.author) ||
                    (typeof b.id === "string" && b.id.startsWith("temp-"))
            );
            if (idx !== -1) {
                const copy = [...prev];
                copy[idx] = book;
                return copy;
            }

            // 3) se não achar nada, adiciona no topo
            return [book, ...prev];
        });

        // Atualiza também a ref que o FilterBook usa como fonte completa
        if (originalBooksRef.current.some((b) => b.id === book.id)) {
            originalBooksRef.current = originalBooksRef.current.map((b) => (b.id === book.id ? book : b));
        } else {
            const idxRef = originalBooksRef.current.findIndex(
                (b) =>
                    (b.title === book.title && b.author === book.author) ||
                    (typeof b.id === "string" && b.id.startsWith("temp-"))
            );
            if (idxRef !== -1) {
                const copy = [...originalBooksRef.current];
                copy[idxRef] = book;
                originalBooksRef.current = copy;
            } else {
                originalBooksRef.current = [book, ...originalBooksRef.current];
            }
        }
    };

    const handleEdited = (book: Book) => {
        originalBooksRef.current = originalBooksRef.current.map(b => b.id === book.id ? book : b);
        setBooks(prev => prev.map(b => b.id === book.id ? book : b));
    };

    const handleDeleted = (bookId: string) => {
        originalBooksRef.current = originalBooksRef.current.filter(b => b.id !== bookId);
        setBooks(prev => prev.filter(b => b.id !== bookId));
    };

    return (
        <div className="p-6">
            {loading ? <Loader /> : null}

            <div className={`${!viewFilter ? "hidden" : ""}`}>
            <FilterBook onClose={() => setViewFilter(false)} books={originalBooksRef.current} handleFilter={setBooks} filterValue={filterValue} setFilterValue={setFilterValue} />
            </div>
            <div className="bg-[var(--secondary)]/40 p-6 rounded-md shadow-md">
                <div className="flex">
                    <h3 className="text-2xl font-bold mb-4 text-[var(--text)]">Litly</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 my-auto ml-auto text-[var(--text)] hover:cursor-pointer hover:text-[var(--text)]/40 transition hover:scale-110"
                    onClick={() => {setViewFilter(!viewFilter);}}
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
                <div className="bg-[var(--primary)]/40 p-6 rounded-md shadow-md">

                    <Books 
                    books={books} 
                    onCreated={handleCreated}
                    onEdited={handleEdited}
                    onDeleted={handleDeleted}
                    />

                </div>
            </div>
        </div>
    );
};

export default Dashboard;

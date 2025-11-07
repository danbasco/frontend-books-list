import React, { useEffect } from "react";
import { Navigate } from "react-router";
import Loader from "~/components/Loader";
import { useAuth } from "~/context/AuthContext";
import Books from "~/components/dashboard/Books";
import "~/styles/loader.css";
import { type Book } from "~/types/book.type";


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
                setBooks([]);
                return;
            }

            if (!response.ok) {
                console.error("Error fetching books:", response.statusText);
                return;
            }

            const data = await response.json();
            const list = Array.isArray(data?.data) ? data.data.map((item: any) => normalizeBook(item)) : [];
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

    return (
        <div className="p-6">
            {loading ? <Loader /> : null}
            <div className="bg-[var(--secondary)]/40 p-6 rounded-md shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-[var(--text)]">Litly</h3>
                <div className="bg-[var(--primary)]/40 p-6 rounded-md shadow-md">

                    <Books books={books} />

                </div>
            </div>
        </div>
    );
};

export default Dashboard;

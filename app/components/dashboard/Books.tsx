import { useState, useEffect } from "react";
import { type Book } from "~/types/book.type";
import ViewDetails from "./ViewDetails";
import AddBookButton from "./AddBookButton";
import AddBook from "./AddBook";
import DeleteBook from "./DeleteBook";
import EditBook from "./EditBook";
import "~/styles/scrollbar.css";

interface Props {
    books: Book[];
    onCreated?: (book: Book) => void;
    onEdited?: (book: Book) => void;
    onDeleted?: (bookId: string) => void;
}

const Books: React.FC<Props> = ({ books, onCreated, onEdited, onDeleted }: Props) => {

    const BASEURL = import.meta.env.VITE_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const TOKEN_KEY = "token";


    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [bookDetails, setBookDetails] = useState<Book>();

    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [localBooks, setLocalBooks] = useState<Book[]>(books);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [bookToDelete, setBookToDelete] = useState<string>("");

    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [bookToEdit, setBookToEdit] = useState<Book>();

    useEffect(() => {
        setLocalBooks(books);
    }, [books]);


    // Função para mostrar/ocultar detalhes do livro

    const onClickShow = (book: Book) => {

        if (book.id !== bookDetails?.id) {
            setBookDetails(book);
            setShowDetails(true);
            setShowEdit(false);
            return;
        }

        setShowDetails(!showDetails);
        setBookDetails(book);

        setShowEdit(false);
    };

    // Função para editar um livro

    const editBook = (book: Book) => {

        setShowDetails(false);
        setShowEdit(true);
        setBookToEdit(book);
    };

    const handleEdited = (updatedBook: Book) => {

        const normalized: Book = {
            ...updatedBook,
            id: (updatedBook as any).id ?? (updatedBook as any)._id ?? updatedBook.id,
        } as Book;

        setLocalBooks((prev) => prev.map((book) => (book.id === normalized.id ? normalized : book)));
        
        onEdited?.(normalized);
        setBookDetails(normalized);


        console.log("Book edited:", normalized);
        setShowDetails(true);
        setShowEdit(false);
    };

    // Função para deletar um livro

    const deleteBook = (bookId: string) => {
        console.log("Delete book with ID:", bookId);
        setShowDeleteConfirm(true);
        setBookToDelete(bookId);
    }

    const handleDeleted = (bookId: string) => {

        setLocalBooks((prev) => prev.filter((book) => book.id !== bookId));
        onDeleted?.(bookId);
        setShowDetails(false);
        setShowDeleteConfirm(false);
        setShowEdit(false);
    };

    // Função para abrir o formulário de adicionar livro

    const addBook = () => {
        setShowAddForm(true);
    };

    const handleCreated = async (newBook: Book) => {

        setShowAddForm(false);
        console.log("New book added:", newBook);
        setLocalBooks((prev) => [newBook, ...prev]);
        onCreated?.(newBook);

        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return;

        // Fetch updated list from server to get the real ID
        const fetchBooks = async (): Promise<Book | null> => {

            try {
                const response = await fetch(`${BASEURL}/books`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error("Failed to fetch books");

                const data = await response.json();
                const list: Book[] = Array.isArray(data?.data)
                    ? data.data.map((item: any) => {
                        const { _id, id, ...rest } = item ?? {};
                        return { ...rest, id: id ?? (_id ? String(_id) : undefined) } as Book;
                    })
                    : [];
                    
                const found = list.find((b) => b.title === newBook.title && b.author === newBook.author);
                return found ?? null;

            } catch (error) {
                console.error("Error fetching books:", error);
                return null;
            }

        };

        const maxAttempts = 3;
        const delayMs = 800;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const real = await fetchBooks();
            if (real && real.id) {
                setLocalBooks((prev) => prev.map((b) => (b.id === newBook.id ? real : b)));
                onCreated?.(real);
                console.log("Replaced temp book with real book from server:", real);
                return;
            }
            await new Promise((res) => setTimeout(res, delayMs));
        }

    };

    return (
        <div className="flex flex-col md:flex-row items-stretch w-full h-full">
            <div className="w-full md:w-1/2 md:mr-2">

            <div className="max-h-[60vh] md:max-h-[80vh] overflow-auto pr-2 custom-scrollbar">
                {localBooks.length === 0 && (
                <p className="text-[var(--text)] items-center">No books found.</p>
                )}
                {localBooks.map((book: Book) => (
                <li key={book.id} className="flex gap-2 z-0 list-none">
                    <div className="p-3 bg-[var(--accent)] w-full my-2 rounded-md shadow-md text-[var(--text)] flex">
                    <div>
                        <p className="text-lg font-bold">{book.title}</p>
                        <p className="text-sm">{book.author}</p>

                    </div>

                    <div className="w-full flex flex-row-reverse">

                        {/* Show details button */}
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-10 hover:text-[var(--text)]/40 transition hover:cursor-pointer"
                        onClick={() => onClickShow(book)}
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>


                        {/* Edit button */}
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-10 mx-3 hover:text-[var(--text)]/40 transition hover:cursor-pointer"
                        onClick={() => editBook(book)}
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>


                        {/* Delete button */}
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-10 hover:text-[var(--text)]/40 transition hover:cursor-pointer"
                        onClick={() => deleteBook(book.id)}
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </div>
                    </div>
                </li>
                ))}
                </div>

                <div className="flex mt-4">
                <AddBookButton onClick={addBook} label="Add Book" />
                </div>
            </div>

            <div className="bg-[var(--accent)] w-full md:w-1/2 md:ml-2 mt-4 md:mt-0 rounded-md shadow-md">

                {localBooks.length === 0 && (
                <div className="p-4">
                    <p className="text-xl font-bold mb-4 text-[var(--text)]">Book Details</p>
                </div>
                )}

                {showDetails && (
                <div>
                    {bookDetails && <ViewDetails book={bookDetails} />}
                </div>
                )}

                {showEdit && (
                <div>
                    <EditBook book={bookToEdit!} onClose={() => setShowEdit(false)} onEdited={handleEdited} />
                </div>
                )}

            </div>

            {showDeleteConfirm && (<DeleteBook onClose={() => setShowDeleteConfirm(false)} onDeleted={handleDeleted} bookId={bookToDelete}/>)}
            {showAddForm && <AddBook onClose={() => setShowAddForm(false)} onCreated={handleCreated} />}
        </div>
    );
};

export default Books;

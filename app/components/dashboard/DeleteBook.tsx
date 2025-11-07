import Loader from "../Loader";
import { successNotification, errorNotification } from "../ToasterComponents/ToasterNotifications";
import { useState } from "react";


interface Props {

    onClose: () => void;
    onDeleted: (bookId: string) => void;
    bookId: string;

}

const DeleteBook : React.FC<Props> = ({ onClose, onDeleted, bookId }: Props) => {

    const BASEURL = import.meta.env.VITE_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const TOKEN_KEY = "token";

    const [loading, setLoading] = useState<boolean>(false);

    const deleteBook = async (bookId: string) => {

        try {

            setLoading(true);

            const response = await fetch(`${BASEURL}/api/books/${bookId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete book");
            }

            const data = await response.json();
            onDeleted(bookId);
            successNotification(data.message || "Book deleted successfully");

        } catch (err: any) {

            errorNotification(err.message || "An unexpected error occurred");
            console.error("Error deleting book:", err);

        } finally {

            setLoading(false);
        }
    };


    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Delete Book</h2>
            <p>Are you sure you want to delete this book?</p>
            <div className="flex justify-end mt-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => deleteBook(bookId)}>
                Delete
                </button>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2" onClick={onClose}>
                Cancel
                </button>
            </div>
        </div>
    );
};

export default DeleteBook;

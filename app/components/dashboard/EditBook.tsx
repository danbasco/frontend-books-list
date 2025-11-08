import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { type Book } from "~/types/book.type";
import StatusList from "./StatusList";
import { GENRES } from "~/types/genre.type";
import { successNotification, errorNotification } from "~/components/ToasterComponents/ToasterNotifications";
import Loader from "../Loader";

interface Props {
    book: Book;
    onClose: () => void;
    onEdited: (updatedBook: Book) => void;
}


const EditBook: React.FC<Props> = ({ book, onClose, onEdited }: Props) => {

    const BASEURL = import.meta.env.VITE_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const TOKEN_KEY = "token";

    const { register, handleSubmit, control, formState: { errors } } = useForm<Book>({
        defaultValues: book
    });


    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: Book) => {

        try {

            setLoading(true);
            const response = await fetch(`${BASEURL}/books/${book.id}`, {

                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                },

                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update book");
            }

            const updatedBook = await response.json();
            onEdited(updatedBook.data);
            successNotification("Book updated successfully");
            onClose();
        } catch (error) {
            console.error(error);
            errorNotification("Failed to update book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
        <div className=" w-full p-3 text-[var(--text)]">
        
            <h2 className="text-lg font-bold mb-2">Edit Book</h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>

                {/** Title */}

                <div className="mb-2">
                    <input
                        id="title"
                        type="text"
                        {...register("title", {required: "Title is required."})}
                        className="border-none focus:border-[var(--text)] focus:outline-none border border-[var(--primary)] p-2 w-full bg-[var(--secondary)]/30 rounded-md shadow-md "
                        placeholder={book.title}
                    />
                    {errors?.title && <p className="text-red-500 text-sm mt-2 wid">{errors.title?.message}</p>}
                </div>


                {/** Author */}


                <div className="mb-2">
                    <input
                        id="author"
                        type="text"
                        {...register("author", {required: "Author is required."})}
                        className="border-none focus:border-[var(--text)] focus:outline-none border border-[var(--primary)] p-2 w-full bg-[var(--secondary)]/30 rounded-md shadow-md"
                        placeholder={book.author}
                    />
                    {errors?.author && <p className="text-red-500 text-sm mt-2 wid">{errors.author?.message}</p>}
                </div>


                {/** Description */}


                <div className="mb-2">
                    <textarea
                        id="description"
                        {...register("description")}
                        className="border-none focus:border-[var(--text)] focus:outline-none border border-[var(--primary)] p-2 w-full bg-[var(--secondary)]/30 rounded-md shadow-md"
                        placeholder={book.description}
                    />
                </div>
                <div className="mb-2">
                    <StatusList control={control} errors={errors}/>
                </div>


                {/** Genres */}

                <div className="mb-4">

                    {/* Genres - checkbox group */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                    {GENRES.map((g) => (
                        <label key={g} className="inline-flex items-center gap-2 p-2 rounded bg-[var(--accent)]">
                        <input
                            type="checkbox"
                            value={g}
                            {...register("genre", {
                            validate: (v) =>
                                Array.isArray(v) && v.length > 0 || "At least one genre is required."
                            })}
                            className="w-4 h-4"
                        />
                        {g}
                        </label>
                        
                    ))}

                    </div>
                    {errors?.genre && <p className="text-red-500 text-sm mt-1">{String(errors.genre?.message)}</p>}
                </div>

                
                {/** Buttons */}


                <div className="flex justify-end">
                    <button type="button" onClick={onClose} className="mr-2 bg-[var(--primary)] text-[var(--text)] p-2 rounded-md shadow-md hover:bg-[var(--primary)]/80 hover:cursor-pointer">Cancel</button>
                    <button type="submit" className="bg-[var(--secondary)] text-[var(--text)] px-4 py-2 rounded-md shadow-md hover:bg-[var(--secondary)]/80 hover:cursor-pointer">Save</button>
                </div>
            </form>
        </div>
        {loading && <Loader />}
        </div>
    );

};

export default EditBook;
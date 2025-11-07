import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { GENRES, type Genre } from "~/types/genre.type";
import { STATUS, type Status } from "~/types/status.type";
import type { Book } from "~/types/book.type";
import { successNotification, errorNotification } from "~/components/ToasterComponents/ToasterNotifications";
import StatusList from "./StatusList";
import Loader from "../Loader";
import "~/styles/loader.css";


type Props = {
  onClose: () => void;
  onCreated?: (book: Book) => void;
};

interface PropsForm {
  title: string;
  author: string;
  description: string;
  status: Status;
  genre: Genre[];
}


const AddBook: React.FC<Props> = ({ onClose, onCreated }) => {

  const BASEURL = import.meta.env.VITE_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost");
  const TOKEN_KEY = "token";

  const [loading, setLoading] = useState<boolean>(false);
  
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);


  // form

  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<PropsForm>({
    defaultValues: { genre: [], status: STATUS[0] as Status }
  });


  const onSubmit = async (data: PropsForm) => {

    
    try {
      setLoading(true);
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("No token found");

      const response = await fetch(`${BASEURL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const ct = response.headers.get("content-type") ?? "";
      const parsed = ct.includes("application/json") ? await response.json() : await response.text();
      const message = typeof parsed === "string" ? parsed : (parsed?.message ?? JSON.stringify(parsed));

      if (!response.ok) {
        throw new Error(message);
      }
      
      let createdBook: Book;
      if (parsed && typeof parsed === "object" && (parsed as any).id) {
        createdBook = parsed as Book;
      } else {
        createdBook = {
          id: `temp-${Date.now()}`,
          title: data.title,
          author: data.author,
          description: data.description,
          status: data.status,
          genre: data.genre
        } as Book;
      }

      successNotification(message);
      onCreated?.(createdBook);
      onClose();

    } catch (err: any) {
      console.error("Error creating book:", err);
      errorNotification(err.message ?? "An unexpected error occurred");
    } finally {
      setLoading(false);
    }

  }


  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {loading && (<div className="absolute inset-0 flex items-center justify-center z-50">
        <Loader />
      </div>)}

      <div
        ref={ref}
        className="relative z-10 w-[min(720px,95%)] max-h-[90vh] overflow-auto custom-scrollbar bg-[var(--primary)] text-[var(--text)] rounded-md shadow-xl p-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Book</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-[var(--text)]/70 hover:opacity-80 hover:cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


          {/* Title */}
          <div>
            <label htmlFor="title" className={`block text-sm font-medium mb-1 ${errors?.title ? "text-red-500" : ""}`}>Title</label>
            <input className={`w-full p-2 rounded shadow-md bg-[var(--accent)] ${errors?.title ? "border-red-500 outline-red-500 focus:outline-red-500 focus:border-red-500" : "border-none focus:border-[var(--text)] focus:outline-none"} text-[var(--text)]`}
            id="title"
            {...register("title", {required: "Title is required."})}
            />
            {errors?.title && <p className="text-red-500 text-sm mt-2 wid">{errors.title?.message}</p>}
          </div>


          {/* Author */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${errors?.author ? "text-red-500" : ""}`}>Author</label>
            <input className={`w-full p-2 rounded shadow-md bg-[var(--accent)] ${errors?.author ? "border-red-500 outline-red-500 focus:outline-red-500 focus:border-red-500" : "border-none focus:border-[var(--text)] focus:outline-none"} text-[var(--text)]`}
            id="author"
            {...register("author", {required: "Author is required."})}
            />
            {errors?.author && <p className="text-red-500 text-sm mt-2 wid">{errors.author?.message}</p>}
          </div>


          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description (opcional)</label>
            <textarea className="w-full p-2 shadow-md rounded bg-[var(--accent)] text-[var(--text)] focus:outline-[var(--accent)] focus:border-[var(--text)]" rows={4}
            id="description"
            {...register("description")}
            />

          </div>
          
          {/* Status */}
          <StatusList control={control} errors={errors}/>

          {/* Genres - checkbox group */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${errors?.genre ? "text-red-500" : ""}`}>Genres</label>
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
                  <span className="text-sm">{g}</span>
                </label>
                ))}
            </div>
            {errors?.genre && <p className="text-red-500 text-sm mt-1">{String(errors.genre?.message)}</p>}
          </div>

          <div>
              <button className="bg-[var(--accent)] px-3 shadow-md py-1 rounded-md hover:cursor-pointer hover:bg-[var(--accent)]/70">Save</button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default AddBook;
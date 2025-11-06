import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { GENRES, type Genre } from "~/types/genre.type";
import { STATUS, type Status } from "~/types/status.type";
import type { Book } from "~/types/book.type";
import { successNotification, errorNotification } from "~/components/ToasterComponents/ToasterNotifications";
import { error } from "console";

const BASEURL = import.meta.env.VITE_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost");
const TOKEN_KEY = "token";

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

  const {register, handleSubmit, formState: {errors} } = useForm<PropsForm>();


  const onSubmit = async (data: PropsForm) => {
  }


  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

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
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <input className={`w-full p-2 rounded bg-[var(--accent)] ${errors?.title ? "border-red-500" : ""} text-[var(--text)] focus:outline-[var(--accent)] focus:border-[var(--text)]`}
            id="title"
            {...register("title", {required: "Title is required."})}
            />
            {errors?.title && <p className="text-red-500 text-sm mt-2 wid">{errors.title?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input className="w-full p-2 rounded bg-[var(--accent)] text-[var(--text)] focus:outline-[var(--accent)] focus:border-[var(--text)]"
            id="author"
            {...register("author", {required: "Author is required."})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description (opcional)</label>
            <textarea className="w-full p-2 rounded bg-[var(--accent)] text-[var(--text)] focus:outline-[var(--accent)] focus:border-[var(--text)]" rows={4}
            id="description"
            {...register("description")}
            />

          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
            id="status"
            {...register("status", {required: "Status is required"})}
            className="w-full p-2 rounded bg-[var(--accent)] text-[var(--text)] hover:cursor-pointer appearance-none outline-none border-none focus:outline-none focus:ring-0 focus:border-transparent shadow-none">
              
              {STATUS.map((s) => (
                <option key={s} value={s} className="hover:bg-[var(--primary)]">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
              <button>Save</button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default AddBook;
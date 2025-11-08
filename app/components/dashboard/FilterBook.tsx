import React, { useEffect, useRef } from "react";
import { set } from "react-hook-form";
import type { Book } from "~/types/book.type";

interface Props {
    onClose: () => void;
    books: Book[];
    handleFilter: (filteredBooks: Book[]) => void;
    filterValue: string;
    setFilterValue: (v: string) => void;
}


const FilterBook: React.FC<Props> = ({ onClose, handleFilter, books, filterValue, setFilterValue }: Props) => {

    const ref = useRef<HTMLDivElement | null>(null);
    const [bookId, setBookId] = React.useState<string>("");

    const originalBooksRef = useRef<Book[] | null>(null);

    useEffect(() => {

        setBookId(filterValue ?? "");
    }, [filterValue]);

    useEffect(() => {

        if (originalBooksRef.current === null) {
            originalBooksRef.current = books;
            return;
        }

        if (books.length !== originalBooksRef.current.length) {
            console.log("livro deletado");
            originalBooksRef.current = books;
            return;
        }

        const prevMap = new Map(originalBooksRef.current.map((b) => [b.id, JSON.stringify(b)]));
        let changed = false;
        for (const b of books) {
            const prev = prevMap.get(b.id);
            if (prev === undefined) {
                changed = true;
                break;
            }
            if (prev !== JSON.stringify(b)) {
                changed = true;
                break;
            }
        }
        if (changed) {
            originalBooksRef.current = books;
        }

    }, [books]);

    useEffect(() => {
            function onMouseDown(e: MouseEvent) {
                if (ref.current && !ref.current.contains(e.target as Node)) {
                    filterBooks(bookId);
                    onClose();
                }
            }
            function onKeyDown(e: KeyboardEvent) {
                if (e.key === "Escape" || e.key === "Enter") {
                    filterBooks(bookId);
                    onClose();
                }
            }
    
            document.addEventListener("mousedown", onMouseDown);
            document.addEventListener("keydown", onKeyDown);
            return () => {
                document.removeEventListener("mousedown", onMouseDown);
                document.removeEventListener("keydown", onKeyDown);
            };
        }, [onClose, bookId]); 


    const filterBooks = (id: string) => {

        const source = originalBooksRef.current ?? books;

        if (!id) {
            handleFilter(source);
            return;
        }

        const filtered = source.filter((book) => book.id.toLowerCase().startsWith(id.toLowerCase()));
        handleFilter(filtered);
    };
    

    return (
        
        <div className="fixed inset-x-0 z-30 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" 
            onClick={() => {
                filterBooks(bookId);
                onClose();
            }}/>
            <div className="bg-[var(--primary)] rounded-lg p-6 z-40 w-1/2 shadow-md">
            <input type="text" placeholder={`${bookId.length !== 0 ? bookId : "Filter books by id..."}`} className="border-none p-2 rounded w-full mb-4 bg-[var(--accent)]" 
                value={bookId}
                onChange={(e) => {
                    const val = e.target.value;

                    console.log("FilterBook - input changed:", val);
                    setBookId(val);
                    filterBooks(val);
                }}
            />
            </div>
        </div>
    );
}

export default FilterBook;
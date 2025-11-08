import React, { useEffect, useRef } from "react";
import type { Book } from "~/types/book.type";
import Filters, { type PropsForm } from "./Filters";
import { STATUS, type Status } from "~/types/status.type";

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

    // controle simples para o botão de settings (abre opções depois)
    const [showSettings, setShowSettings] = React.useState<boolean>(false);

    const originalBooksRef = useRef<Book[] | null>(null);

    const [searchFilter, setSearchFilter] = React.useState<PropsForm>(
        {
            title: "",
            author: "",
            description: "",
            genre: [],
            status: STATUS[0] as Status
        }
    );

    useEffect(() => {
        setBookId(filterValue ?? "");
    }, [filterValue]);

    useEffect(() => {

        if (originalBooksRef.current === null) {
            originalBooksRef.current = books;
            return;
        }

        if (books.length !== originalBooksRef.current.length) {
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
        const idTrim = (id ?? "").trim();
        const hasId = idTrim.length > 0;

        const hasTitle = Boolean(searchFilter?.title && searchFilter.title.trim() !== "");
        const hasAuthor = Boolean(searchFilter?.author && searchFilter.author.trim() !== "");
        const hasDescription = Boolean(searchFilter?.description && searchFilter.description.trim() !== "");
        const hasGenre = Boolean(searchFilter?.genre && searchFilter.genre.length > 0);
        const hasStatus = Boolean(searchFilter?.status !== undefined && searchFilter?.status !== null && String(searchFilter?.status).trim() !== "");

        // se nenhum critério, retorna fonte completa
        if (!hasId && !hasTitle && !hasAuthor && !hasDescription && !hasGenre && !hasStatus) {
            handleFilter(source);
            return;
        }

        const filtered = source.filter((book) => {
            let ok = true;

            if (hasId) {
                ok = ok && String(book.id ?? "").toLowerCase().startsWith(idTrim.toLowerCase());
            }

            if (hasTitle) {
                ok = ok && String(book.title ?? "").toLowerCase().includes(searchFilter.title.trim().toLowerCase());
            }

            if (hasAuthor) {
                ok = ok && String(book.author ?? "").toLowerCase().includes(searchFilter.author.trim().toLowerCase());
            }

            if (hasDescription) {
                ok = ok && String(book.description ?? "").toLowerCase().includes(searchFilter.description.trim().toLowerCase());
            }

            if (hasGenre) {
                // pelo menos um gênero selecionado deve estar presente no livro
                const bookGenres = Array.isArray(book.genre) ? book.genre : [];
                ok = ok && searchFilter.genre.some((g) => bookGenres.includes(g));
            }

            if (hasStatus) {
                ok = ok && (book.status === searchFilter.status);
            }

            return ok;
        });

        handleFilter(filtered);
    };

    const handleFilterParams = (filters: PropsForm) => {
        console.log("Filter params received:", filters);
        setSearchFilter(filters);
        // reaplica filtro usando o valor atual do ID
        filterBooks(bookId);
    };

    return (

        <div className="fixed inset-x-0 z-30 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                onClick={() => {
                    filterBooks(bookId);
                    onClose();
                }} />
            <div ref={ref} className="bg-[var(--primary)] rounded-lg p-6 z-40 w-1/2 shadow-md">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={`${bookId.length !== 0 ? bookId : "Filter books by id..."}`}
                        className="border-none p-2 rounded w-full mb-4 bg-[var(--accent)] pr-10"
                        value={bookId}
                        onChange={(e) => {
                            const val = e.target.value;
                            setBookId(val);
                            try { setFilterValue(val); } catch { /* noop */ }
                            filterBooks(val);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                filterBooks(bookId);
                            }
                        }}
                        aria-label="Filter books by id"
                    />

                    {/* SVG de settings posicionado no fim do input */}
                    <button
                        type="button"
                        aria-label="Opções de filtro"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text)]"
                        onClick={() => setShowSettings((s) => !s)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mb-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
                        </svg>
                    </button>
                </div>

                {showSettings && <Filters setFilters={setSearchFilter} filters={searchFilter} onFilter={handleFilterParams} onClose={() => setShowSettings(false)} />}

            </div>
        </div>
    );
}

export default FilterBook;
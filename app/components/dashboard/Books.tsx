import { useState } from "react";
import { type Book } from "~/types/book.type";
import ViewDetails from "./ViewDetails";
import AddBookButton from "./AddBookButton"; // botão simples
import AddBook from "./AddBook"; // modal / formulário de adicionar livro

interface Props {
  books: Book[];
}

const Books: React.FC<Props> = ({ books }: Props) => {
  const templateBook: Book = {
    id: 0,
    title: "Book",
    author: "Author",
    description: "Description of a book",
    genre: ["Adventure"],
    status: "FINISHED",
  };

  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [bookDetails, setBookDetails] = useState<Book>(templateBook);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const onClickShow = (book: Book) => {
    if (book.id !== bookDetails.id) {
      setBookDetails(book);
      setShowDetails(true);
      return;
    }

    setShowDetails(!showDetails);
    setBookDetails(book);
  };

  const addBook = () => {
    setShowAddForm(true);
  };

  const handleCloseAdd = () => setShowAddForm(false);

  const handleCreated = (newBook: Book) => {
    // Aqui você pode:
    // - fechar o modal (feito abaixo)
    // - notificar o pai para atualizar a lista (refetch), se necessário
    setShowAddForm(false);
    // Se quiser atualizar a UI localmente, teria que receber e manter 'books' no estado do pai
  };

  return (
    <div className="flex items-stretch">
      <div className="w-1/2 mr-2">
        {books.map((book: Book) => (
          <li key={book.id} className="flex gap-2 z-0 list-none">
            <div className="p-3 bg-[var(--accent)] w-full my-2 rounded-md shadow-md text-[var(--text)] flex">
              <div>
                <p className="text-lg font-bold">{book.title}</p>
                <p className="text-sm">{book.author}</p>
              </div>

              <div className="w-full flex flex-row-reverse">
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

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-10 mx-3 hover:text-[var(--text)]/40 transition hover:cursor-pointer"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-10 hover:text-[var(--text)]/40 transition hover:cursor-pointer"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
            </div>
          </li>
        ))}

        <div className="flex mt-10">
          <AddBookButton onClick={addBook} label="Add Book" />
        </div>
      </div>

      <div className="bg-[var(--accent)] w-1/2 ml-2 rounded-md shadow-md">
        {showDetails && (
          <div>
            <ViewDetails book={bookDetails} />
          </div>
        )}
      </div>

      {showAddForm && <AddBook onClose={handleCloseAdd} onCreated={handleCreated} />}
    </div>
  );
};

export default Books;
import { type Book } from "~/types/book.type"
import { type Genre } from "~/types/genre.type"

interface Props {
    book: Book
}


const ViewDetails: React.FC<Props> = ({ book }: Props) => {
    return (
        <div className=" w-full p-3 text-[var(--text)]">
            <p className="font-bold text-lg">{book.title}</p>
            <p className="text-sm mb-5">{book.author}</p>
            <p className="text-sx mb-5">{book.id}</p>
            <p className ="font-bold">Description</p>
            <p className="mb-3">{book.description}</p>
            <p className ="font-bold">Genre</p>
            {book.genre.map((genre: Genre) => (
                <li className="flex" key={genre}>{genre}</li>
            ))}
            <p className="mt-3 font-bold">Status</p>
            <div className="flex">
                <p className="bg-[var(--accent)] px-2 rounded-md shadow-md">{book.status}</p>
                <p></p>
            </div>
            
        </div>
    );
}

export default ViewDetails;
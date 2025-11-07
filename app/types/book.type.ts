import { type Genre } from "~/types/genre.type";
import { type Status } from "~/types/status.type";

type Book = {
    id: number,
    title: string,
    author: string,
    genre: Genre[],
    status: Status,
    description: string
    
}

export type { Book };
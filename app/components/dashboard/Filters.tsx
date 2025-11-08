import { useForm } from "react-hook-form";
import { GENRES, type Genre } from "~/types/genre.type";
import { STATUS, type Status } from "~/types/status.type";
import StatusList from "./StatusList";

export interface PropsForm {
    title: string;
    author: string;
    description: string;
    genre: Genre[];
    status: Status;
}

interface Props {
    filters: PropsForm;
    setFilters: (filters: PropsForm) => void;
    onFilter?: (filters: PropsForm) => void;
    onClose?: () => void;
}

const Filters: React.FC<Props> = ({ filters, setFilters, onFilter, onClose }: Props) => {

    const { register, handleSubmit, control, formState: { errors } } = useForm<PropsForm>({

            defaultValues: {
                title: "",
                author: "",
                description: "",
                genre: [],
                status: STATUS[0] as Status
            }
        });

    const onSubmit = (data: PropsForm) => {
        setFilters(data);
        onFilter && onFilter(data);
        onClose && onClose();
    };

    return (

        <div className="">
            <p className="font-bold text-lg">Filters</p>


            <form onSubmit={handleSubmit(onSubmit)}>

            <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-[var(--text)]" htmlFor="title">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    className="w-full p-2 border border-none rounded bg-[var(--accent)] text-[var(--text)] focus:outline-none focus:border-none"
                    placeholder="Title"
                    {...register("title")}
                />
            </div>


            <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-[var(--text)]" htmlFor="author"> 
                    Author
                </label>
                <input
                    type="text"
                    id="author"
                    className="w-full p-2 border border-none rounded bg-[var(--accent)] text-[var(--text)] focus:outline-none focus:border-none"
                    placeholder="Author"
                    {...register("author")}
                />
            </div>



            <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-[var(--text)]" htmlFor="description">
                    Description
                </label>
                <textarea
                    id="description"
                    className="w-full p-2 border border-none rounded bg-[var(--accent)] text-[var(--text)] focus:outline-none focus:border-none" rows={3}
                    placeholder="Description"
                    {...register("description")}
                />
            </div>

            <div className="mt-4">
                <StatusList control={control} errors={errors}/>
            </div>

            {/* Genres - checkbox group */}
            <div className="mt-4">
                <label className={`block text-sm font-medium mb-2 ${errors?.genre ? "text-red-500" : ""}`}>Genres</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {GENRES.map((g) => (
                    <label key={g} className="inline-flex items-center gap-2 p-2 rounded bg-[var(--accent)]">
                    <input
                        type="checkbox"
                        value={g}
                        {...register("genre")}
                    />
                    <span className="text-sm">{g}</span>
                    </label>
                    ))}
                </div>
            </div>

            <div>
                <button type="submit" className="bg-[var(--accent)] px-3 shadow-md py-1 rounded-md hover:cursor-pointer hover:bg-[var(--accent)]/70">Save</button>
            </div>
            </form>
        </div>
    );


}

export default Filters;
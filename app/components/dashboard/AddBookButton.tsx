import type React from "react";

interface Props {
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    label?: string;
}


const AddBookButton : React.FC<Props> = ({ onClick, label }: Props) => {
    

    return (

        <button type="button" onClick={onClick} className="flex items-center p-2 text-[var(--text)] bg-[var(--accent)] rounded-md shadow-md hover:cursor-pointer hover:bg-[var(--accent)]/70">   
                <div className = "flex ml-2 mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </div>{label}
        </button>
    );
}


export default AddBookButton;
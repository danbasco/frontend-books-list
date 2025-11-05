interface Props {
    message: string
}


const RegisterButton : React.FC<Props> = ( { message }: Props) => {
    return (
        <div className="relative flex items-center mt-10 mb-4">
            <button type="submit" 
            className=" sm:translate-x-0 bg-[var(--accent)]/80 p-3 sm:p-3 rounded-md hover:bg-[var(--accent)] focus:outline-none w-full text-[var(--text)]">
                { message }
            </button>
        </div>
    );
}

export default RegisterButton;
const RegisterButton : React.FC = () => {
    return (
        <div className="relative flex items-center my-10">
            <button type="submit" 
            className=" sm:translate-x-0 bg-[#9675a3] p-3 sm:p-3 rounded-md hover:bg-[#CAA0DB] focus:outline-none w-full text-[#e6eaef]">
                Register
            </button>
        </div>
    );
}

export default RegisterButton;
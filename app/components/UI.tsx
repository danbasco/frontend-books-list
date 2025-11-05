import ThemeToggle from "./ThemeToggle";

const UI : React.FC = () => {

    return (

        
        <div className="p-3 w-full flex items-center">
            <div>
                <p className="text-xm font-bold tracking-widest mb-2 mx-5 text-[var(--text)]">Home</p>
            </div>
            <div>
                <p className="text-xm font-bold tracking-widest mb-2 text-[var(--text)]">Dashboard</p>
            </div>
            <div className="ml-auto">
                <ThemeToggle />
            </div>
        </div>
        
    );

}
export default UI;
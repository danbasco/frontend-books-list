import { type UseFormRegister, type FieldErrors, type UseFormWatch } from "react-hook-form";

type Data = {
    email: string,
    password: string,
}

interface Props {
    register: UseFormRegister<Data>;
    errors: FieldErrors<Data>;
    
}

const LoginForm : React.FC<Props> = ({ register, errors }) => {

    return (
    <div className="flex flex-col gap-4">

        { /* email */ }

        <div className="flex flex-col">
            <label htmlFor="email" className="text-xs font-bold tracking-widest mb-2  text-[var(--text)]">Email</label>
            <input id="email" placeholder="email" 
            className={`${errors.email ? "border-red-500" : "border-[var(--text)]/40  focus:border-[var(--text)]"} text-[var(--text)] p-2 border rounded-lg w-full sm:w-110 text-md font-bold focus:outline-none`}
            
            {...register("email", {required: "Email is required." }
            )}></input>
            {errors?.email && <p className="text-red-500 text-sm mt-2 whitespace-normal break-words max-w-full sm:max-w-md">{errors.email.message}</p>}
        </div>

        { /* password */ }

        <div className="flex flex-col">
            <label htmlFor="password" className="text-xs font-bold tracking-widest mb-2  text-[var(--text)]">Password</label>
            <input id="password" type="password" placeholder="password" 
            className={`${errors.password ? "border-red-500" : "border-[var(--text)]/40  focus:border-[var(--text)]"} text-[var(--text)] p-2 border rounded-lg w-full sm:w-110 text-md font-bold focus:outline-none`} 

            {...register("password", {required: "Password is required."}

                )}></input>
            {errors?.password && <p className="text-red-500 text-sm mt-2 wid">{errors.password?.message}</p>}
        </div>
        
    </div>
);
};

export default LoginForm;
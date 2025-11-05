import { type UseFormRegister, type FieldErrors, type UseFormWatch } from "react-hook-form";

type Data = {
    name: string,
    email: string,
    password: string,
    confirmpassword: string
}

interface Props {
    register: UseFormRegister<Data>;
    errors: FieldErrors<Data>;
    watch: UseFormWatch<Data>;
    
}


const RegisterForm : React.FC<Props> = ({ register, errors, watch }) => {


    const validatePassword = (password: string): { valid: boolean; message?: string } => {
        // 1) spaces
        if (/\s/.test(password)) {
            return { valid: false, message: "Password must not contain spaces." };
        }

        // 2) accented or non-ASCII characters
        if (/[^\x00-\x7F]/.test(password)) {
            return { valid: false, message: "Password must not contain accented or non-ASCII characters." };
        }

        // 3) characters not allowed (only A-Za-z0-9 and @$!%*?&_. allowed)
        const allowedRegex = /^[A-Za-z\d@$!%*?&_.]+$/;
        if (!allowedRegex.test(password)) {
            return { valid: false, message: "Password contains invalid characters. Allowed: letters, numbers, and @ $ ! % * ? & _ ." };
        }

        // 4) length
        if (password.length < 8) {
            return { valid: false, message: "Password must be at least 8 characters long." };
        }

        // 5) composition requirements
        if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[@$!%*?&_.]/.test(password)) {
            return { valid: false, message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@ $ ! % * ? & _ .)." };
        }

        return { valid: true };
    };

    const watchPassword = watch("password");

    return (
    <div className="flex flex-col gap-4">

        { /* name */ }
        
        <div className="flex flex-col">
            <label htmlFor="name" className="text-xs font-bold tracking-widest mb-2  text-[#e6eaef]">Name</label>
            <input id="name" placeholder="name" 
            className={`${errors.name ? "border-red-500" : "border-[#e6eaef]/40  focus:border-[#9675a3]"} text-[#e6eaef] p-2 border rounded-lg w-full sm:w-110 text-md font-bold focus:outline-none`} 
            
            {...register("name", {required: true})}></input>
            {errors?.name?.type === 'required' && <p className="text-red-500 text-sm mt-2">Name is required.</p>}
        </div>

        { /* email */ }

        <div className="flex flex-col">
            <label htmlFor="email" className="text-xs font-bold tracking-widest mb-2  text-[#e6eaef]">Email</label>
            <input id="email" placeholder="email" 
            className={`${errors.email ? "border-red-500" : "border-[#e6eaef]/40  focus:border-[#9675a3]"} text-[#e6eaef] p-2 border rounded-lg w-full sm:w-110 text-md font-bold focus:outline-none`}
            
            {...register("email", {required: "Email is required.", 
                validate: (value) => {
                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return regex.test(value) || "Invalid email format.";
            }
            })}></input>
            {errors?.email && <p className="text-red-500 text-sm mt-2 whitespace-normal break-words max-w-full sm:max-w-md">{errors.email.message}</p>}
        </div>

        { /* password */ }

        <div className="flex flex-col">
            <label htmlFor="password" className="text-xs font-bold tracking-widest mb-2  text-[#e6eaef]">Password</label>
            <input id="password" type="password" placeholder="password" 
            className={`${errors.password ? "border-red-500" : "border-[#e6eaef]/40  focus:border-[#9675a3]"} text-[#e6eaef] p-2 border rounded-lg w-full sm:w-110 text-md font-bold focus:outline-none`} 

            {...register("password", {required: "Password is required.", 

                validate: (value) => {

                    let passwordTest = validatePassword(value);
                    if(passwordTest.valid) { return true; }

                    return passwordTest.message;

                }

            })}></input>
            {errors?.password && <p className="text-red-500 text-sm mt-2 wid">{errors.password?.message}</p>}
        </div>

        { /* password */ }

        <div className="flex flex-col">
            <label htmlFor="confirm-password" className="text-xs font-bold tracking-widest mb-2  text-[#e6eaef]">Confirm Password</label>
            <input id="confirm-password" type="password" placeholder="confirm password" 
            className={`${errors.confirmpassword ? "border-red-500" : "border-[#e6eaef]/40  focus:border-[#9675a3]"} text-[#e6eaef] p-2 border rounded-lg w-full sm:w-110 text-md font-bold focus:outline-none`} 

            {...register("confirmpassword", {required: "Password is required.", 

                validate: (value) => {

                    if(value !== watchPassword) {return "Passwords must match.";}
                    return true;

                }

            })}></input>
            {errors?.confirmpassword && <p className="text-red-500 text-sm mt-2 wid">{errors.confirmpassword?.message}</p>}
        </div>
        
    </div>
);
};

export default RegisterForm;
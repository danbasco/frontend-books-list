import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import RegisterButton from "~/components/AuthButton";
import Loader from "~/components/Loader";
import RegisterForm from "~/components/register/RegisterForm";
import { errorNotification, successNotification } from "~/components/ToasterComponents/ToasterNotifications";
import "~/styles/loader.css";

interface Props {
    name: string,
    email: string,
    password: string,
    confirmpassword: string
}

const Register : React.FC = () => {

    const navigate = useNavigate();

    const { register, handleSubmit, formState: {errors}, watch } = useForm<Props>();
    const BASEURL = import.meta.env.VITE_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost"); 

    const [loading, setLoading] = useState<boolean>(false);
    
    const onSubmit = async (data: Props) => {

        setLoading(true);

        try {

            const resp = await fetch(`${BASEURL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            

            const ct = resp.headers.get("content-type") || "";
            let body: any = null;

            if (ct.includes("application/json")) {
                body = await resp.json();

            } else {
                body = await resp.text();

            }
            
            const message = typeof body === "string" ? body : (body?.message ?? JSON.stringify(body));
            console.log(message)

            if(resp.status === 201) {

                successNotification(message);
                navigate("/auth/login");

            }

            else {

                errorNotification(message);
                console.log(message);
            }

        }catch(err) {

            console.error("Erro na requisição:", err);

        } finally {

            setLoading(false);
        }
        
    };


    return (

        <main className="min-h-screen flex items-center justify-center p-4">

            <div className="bg-[var(--secondary)]/40 p-6 rounded-md shadow-md">
                <div>
                <h4 className="text-[var(--text)] my-2">Register</h4>
                <div className="relative max-w-lg">
                    <form className={`bg-[var(--primary)]/40 p-8 w-full h-full max-h-full rounded-md shadow-md ${loading ? 'opacity-60 pointer-events-none' : ''}`}
                    onSubmit={handleSubmit(onSubmit)}>

                        <RegisterForm register={register} errors={errors} watch={watch}/>
                        <RegisterButton message="Register"/>
                        <p className="text-[var(--text)]/80">Already have an account? <a href="/auth/login" className="text-[var(--primary)]">Login</a></p>
                    </form>
                    {loading && (
                        <Loader />
                      )}

                </div>
                </div>
            </div>
        </main>
    );

}

export default Register;
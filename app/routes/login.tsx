import React, { useState } from "react";
import { useForm } from "react-hook-form";
import LoginButton from "~/components/AuthButton";
import Loader from "~/components/Loader";
import { errorNotification, successNotification } from "~/components/ToasterComponents/ToasterNotifications";
import LoginForm from "~/components/login/LoginForm";
import "~/styles/loader.css";

interface Props {
    email: string,
    password: string
}

const Login : React.FC = () => {

    const { register, handleSubmit, formState: {errors} } = useForm<Props>();
    const BASEURL = import.meta.env.VITE_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost"); 
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: Props) => {

        try {

            setLoading(true);

            const resp = await fetch(`${BASEURL}/auth/login`, {
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
            
            console.log(body);

            const message = typeof body === "string" ? body : (body?.message ?? JSON.stringify(body));
            console.log(message)

            if(resp.status === 200) {
                
                successNotification(message);
            }

            else {
                errorNotification(message);
            }

        } catch (err) {

        } finally {
            setLoading(false);
        }


    }
    
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-[var(--secondary)]/40 p-6 rounded-md shadow-md">
            <div>
                <h4 className="text-[var(--text)] my-2">Login</h4>
                <div className="relative max-w-lg">   
                    <form className={`bg-[var(--primary)]/40 p-8 w-full h-full max-h-full rounded-md shadow-md ${loading ? 'opacity-60 pointer-events-none' : ''}`}
                    onSubmit={handleSubmit(onSubmit)}>

                        <LoginForm register={register} errors={errors} />
                        <LoginButton message="Login"/>
                        <p className="text-[var(--text)]/80">Dont have an account? <a href="/auth/register" className="text-[var(--primary)]">Register</a></p>
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

export default Login;
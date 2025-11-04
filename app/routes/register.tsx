import React, { useState } from "react";
import { useForm } from "react-hook-form";
import RegisterButton from "~/components/AuthButton";
import RegisterForm from "~/components/register/RegisterForm";


interface Props {
    name: string,
    email: string,
    password: string
}

const Register : React.FC = () => {

    const { register, handleSubmit, formState: {errors} } = useForm<Props>();

    const onSubmit = (data: Props) => {
        console.log(data);
    };


    return (

        <main className="bg-[#060709] min-h-screen flex items-center justify-center p-4">
            <div>
                <div>
                    <form className="bg-[#55476b]/40 p-8 w-full h-full max-h-full rounded-md max-w-lg"
                    onSubmit={handleSubmit(onSubmit)}>
                        <RegisterForm register={register} errors={errors}/>
                        <RegisterButton />
                    </form>
                    
                </div>
            </div>
        </main>
    );

}

export default Register;
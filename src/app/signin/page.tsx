"use client";

import React, { useState } from "react";
import { SignIn, GetSignInErrorMessage } from "../../utils/user";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import AlertComponent from "../../components/AlertComponent";
import { SigninType } from "../../types";
import ButtonComponent from "@/components/button/ButtonComponent";
import Link from "next/link";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninType>();
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<SigninType> = async (data) => {
    setError(null);
    try {
      setIsLoading(true);
      await SignIn(data);
      setIsLoading(false);
      router.push("/");
    } catch (error: any) {
      setIsLoading(false);
      setError(GetSignInErrorMessage(error.code));
    }
  };

  //mengganti tampilan password antara terlihat atau tersembunyi.
  const toggleShowPass = () => {
    setShowPass((prevShowPass) => !prevShowPass);
  };

  return (
    <main className="min-h-screen px-6 py-6 flex items-center md:justify-center bg-cover bg-center bg-[url('/bg-signin.png')]">
      <section className="rounded-3xl mx-auto p-3 shadow-2xl max-w-md w-full bg-white bg-opacity-80">
        <h1 className="px-3 text-black-primary font-bold mb-1 text-lg text-center">
          Masuk Akun
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-3"
        >
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              id="floating_email"
              {...register("email", { required: "Email wajib diisi." })}
              className="block py-2.5 px-0 w-full text-sm text-black-primary bg-transparent border-0 border-b-2 border-gray-primary appearance-none focus:outline-none focus:ring-0 focus:border-black-primary peer"
              placeholder=" "
              autoComplete="email"
              required
            />
            <label
              htmlFor="floating_email"
              className="peer-focus:font-medium absolute text-sm text-gray-primary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black-primary peer-focus:dark:text-black-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <div className="flex items-center relative">
              <input
                type={showPass ? "text" : "password"}
                id="floating_password"
                {...register("password", {
                  required: "Password wajib diisi.",
                  minLength: {
                    value: 6,
                    message:
                      "Password harus memiliki minimal panjang 6 karakter.",
                  },
                })}
                className="block py-2.5 px-0 w-full text-sm text-black-primary bg-transparent border-0 border-b-2 border-gray-primary appearance-none focus:outline-none focus:ring-0 focus:border-black-primary peer"
                placeholder=" "
                autoComplete="new-password"
                required
              />
              <span
                className="absolute right-0 pr-3 flex items-center cursor-pointer"
                onClick={toggleShowPass}
              >
                {showPass ? (
                  <RemoveRedEyeOutlinedIcon className="text-gray-primary" />
                ) : (
                  <VisibilityOffOutlinedIcon className="text-gray-primary" />
                )}
              </span>
              <label
                htmlFor="floating_password"
                className="peer-focus:font-medium absolute text-sm text-gray-primary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black-primary peer-focus:dark:text-black-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <ButtonComponent intent="primary-full" loading={isLoading}>
            Masuk
          </ButtonComponent>
        </form>
        <section>
          <p className="px-3 text-xs text-center text-gray-primary">
            Belum memiliki akun? Hubungi nomor
            <Link
              href="https://wa.me/85335224311"
              target="_blank"
              className="underline ml-1"
            >
              berikut
            </Link>
            .
          </p>
        </section>
        <AlertComponent severity="error" message={error} />
      </section>
    </main>
  );
};

export default LoginPage;

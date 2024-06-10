"use client";

import React, { useState } from "react";
import { SignIn, GetSignInErrorMessage } from "../../utils/user";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CircularProgress from "@mui/material/CircularProgress";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
import AlertComponent from "../../components/AlertComponent";

type FormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError(null);
    try {
      setIsLoading(true);
      await SignIn(data.email, data.password);
      setIsLoading(false);
      router.push("/");
    } catch (error: any) {
      setIsLoading(false);
      setError(GetSignInErrorMessage(error.code));
    }
  };

  const toggleShowPass = () => {
    setShowPass((prevShowPass) => !prevShowPass);
  };

  return (
    <div className="min-h-screen px-6 py-6 md:flex md:items-center md:justify-center">
      <div className="bg-light rounded-3xl mx-auto p-3 shadow-2xl max-w-md md:w-full">
        <h1 className="px-3 text-gray-900 font-bold mb-1 text-lg">
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
              {...register("email", { required: "Email is required" })}
              className={`border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer`}
              placeholder=" "
              autoComplete="email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            <label
              htmlFor="floating_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type={showPass ? "text" : "password"}
              id="floating_password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum length of 6 characters",
                },
              })}
              className={`border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer`}
              placeholder=" "
              autoComplete="new-password"
              required
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={toggleShowPass}
            >
              {showPass ? (
                <RemoveRedEyeOutlinedIcon className="text-gray-300" />
              ) : (
                <VisibilityOffOutlinedIcon className="text-gray-300" />
              )}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div>
          <button
            type="submit"
            className="w-full relative inline-flex items-center justify-center p-0.5 mb-1 me-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-black"
          >
            {isLoading ? (
              <span className="w-full relative px-5 py-2 transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0 ">
                <CircularProgress size="1rem" style={{ color: "#ffffff" }} />
              </span>
            ) : (
              <span className="w-full relative px-5 py-2 transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0 ">
                Masuk
              </span>
            )}
          </button>
        </form>
        <AlertComponent severity="error" message={error} />
      </div>
    </div>
  );
};

export default LoginPage;

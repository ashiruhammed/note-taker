/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import Input from "./input";
import React, { useEffect } from "react";
import { auth } from "../../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithRedirect,
  signInWithPopup,
} from "firebase/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GoogleAuthProvider } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

function SignUp() {
  //   const auth = getAuth();
  const navigate = useNavigate();

  onAuthStateChanged(auth, function (user) {
    if (user) navigate("/");
  });
  const provider = new GoogleAuthProvider();
  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: Yup.object({
        password: Yup.string().required("Password is required"),
        email: Yup.string().email("Invalid email address").required("Required"),
      }),
      onSubmit: async (values) => {
        try {
          const checkUser = await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );
        } catch (err) {
          if (err) {
            toast.error("Email already in use", {
              position: "top-center",
              className: "bg-green-300 h-12",
            });
            console.log(err);
          }
        }
      },
    });

  return (
    <div className="h-screen p-8 md:px-16 md:flex items-center bg-[url('/src/assets/auth-bg-mobile.png')] md:bg-[url('/src/assets/auth-bg-desktop.png')] bg-cover bg-no-repeat">
      <div className="text-center bg-primary-bg py-12 px-4 md:px-12 rounded-2xl max-w-[900px] md:w-[7y00px] max-h-fit mx-auto shadow-lg">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-6xl font-semibold text-white">
            To-Do App
          </h1>
          <p className="text-white">Start organizing your life day by day</p>
        </div>
        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            console.log(e);
            return handleSubmit(e);
          }}>
          <Input
            handleChange={handleChange}
            value={values.email}
            placeholder="Email Address"
            id="email"
            touched={touched}
            errors={errors}
            type="email"
          />

          <Input
            handleChange={handleChange}
            value={values.password}
            placeholder="Password"
            id="password"
            touched={touched}
            type="password"
            errors={errors}
          />

          <button
            type="submit"
            className="bg-primary text-white rounded-md px-4 py-2 mt-10">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-white">
          Already have an account? Sign in{" "}
          <Link to="/sign-in" className="text-primary">
            here
          </Link>
          .
        </p>
        <p>or</p>
        <button
          onClick={() => {
            console.log("clicked");
            signInWithPopup(auth, provider);
          }}
          type="submit"
          className="bg-primary text-white rounded-md px-4 py-2 mt-10">
          Sign Up with Google
        </button>
      </div>
      <Toaster />
    </div>
  );
}

export default SignUp;

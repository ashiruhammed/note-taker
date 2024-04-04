import { Link, useNavigate } from "react-router-dom";
import Input from "./input";

import { auth } from "../../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

function SignIn() {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  onAuthStateChanged(auth, (user) => {
    if (user?.uid) navigate("/");
    console.log(user);
  });
  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      mail: "",
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Password is required"),
      mail: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      // console.log(values);
      try {
        const checkUser = await signInWithEmailAndPassword(
          auth,
          values.mail,
          values.password
        );
        if (checkUser) {
          toast.success("Successfully Logged In", {
            position: "top-center",
            className: "bg-green-300 h-12",
          });
        }
      } catch (err) {
        if (err) {
          toast.error("Please fill in a Valid credentials", {
            position: "top-center",
            className: "bg-green-300 h-12",
          });
        }
      }
    },
  });

  return (
    <div className="h-screen p-8 md:px-16 md:flex items-center bg-[url('/src/assets/auth-bg-mobile.png')] md:bg-[url('/src/assets/auth-bg-desktop.png')] bg-cover bg-no-repeat">
      <div className="text-center bg-white py-12 px-4 md:px-12 rounded-2xl md:w-[700px] max-w-[900px] max-h-fit mx-auto shadow-lg">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-6xl font-semibold text-primary">
            To-Do App
          </h1>
          <p>Start organizing your life day by day</p>
        </div>
        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();

            return handleSubmit(e);
          }}>
          <Input
            placeholder="Enter your email"
            id="mail"
            handleChange={handleChange}
            value={values.mail}
            touched={touched}
            errors={errors}
            type="email"
          />
          <Input
            placeholder="Enter your Password"
            id="password"
            handleChange={handleChange}
            value={values.password}
            touched={touched}
            errors={errors}
            type="text"
          />
          <button
            type="submit"
            className="bg-primary-bg rounded-md px-4 py-2 mt-10">
            Sign In
          </button>
        </form>
        <p className="mt-4">
          Don't have an account? Create{" "}
          <Link to="/sign-up" className="text-primary">
            here
          </Link>
          .
        </p>
        <p>or</p>
        <button
          type="submit"
          onClick={() => {
            console.log("clicked");
            signInWithPopup(auth, provider);
          }}
          className="bg-primary text-white rounded-md px-4 py-2 mt-10">
          Sign In With Google
        </button>
      </div>
      <Toaster />
    </div>
  );
}

export default SignIn;

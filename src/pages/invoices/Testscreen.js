import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, loginUser } from "../../store/userSlice";
import Swal from "sweetalert2";
import Axios from "axios";

const Testscreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const userId = sessionStorage.getItem("user");
  const id = JSON.parse(userId);
  const roles = id?.userrole;

  useEffect(() => {}, []);
  const detail = localStorage.getItem("details");

  const invoiceDetail = JSON.parse(detail);

  const submitHandler = async (e) => {
    e.preventDefault();

    const userInfo = {
      email: email,
      password: password,
    };
    dispatch(loginUser(userInfo)).then(async (result) => {
      const userId = sessionStorage.getItem("user");
      const id = JSON.parse(userId);
      const roles = id?.userrole;

      if (result.payload) {
        if (invoiceDetail) {
          invoiceDetail.userid = result.payload.id;
          const request = await Axios.post(
            "/api/invoices/invoicedetail",
            invoiceDetail
          );
          if (request) {
            setEmail("");
            setPassword("");
            navigate("/invoices");
            localStorage.removeItem("details");
          }
        } else {
          setEmail("");
          setPassword("");
          if (roles === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/invoices");
          }
        }
      } else {
        Swal.fire("Invalid Email or Password");
      }
    });
  };

  return (
    <section className=" flex items-stretch text-black ">
      <div
        className="lg:flex w-1/2 hidden bg-no-repeat bg-cover relative items-center"
        style={{ backgroundImage: "url('  /images/signup_illustration.png')", width:"50%",height:"500px"}}
      >
        <div className="absolute  inset-0 z-0"></div>
      </div>
      <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0">
        <form
          action=""
          className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto"
          onSubmit={submitHandler}
        >
          <div className="pb-2 pt-4">
            <label className="block text-sm text-left font-semibold">
              Email
            </label>
            <input
              id="email"
              placeholder="Enter your email"
              type="email"
              className={`placeholder:text-sm w-full px-4 py-2 solid border-gray-400  text-sm border rounded-md focus:ring-1 focus:outline-none `}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="pb-2 pt-4">
            <label className="block text-left text-sm font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                placeholder="Enter your password "
                className={`placeholder:text-sm w-full  px-4 py-2 text-sm border border-gray-400  rounded-md focus:ring-1 focus:outline-none `}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <a
              // onClick={forgetPassword}
              className="text-sm font-medium cursor-pointer text-teal-900  hover:underline dark:text-primary-500 cursor-pointer"
            >
              Forgot password?
            </a>
          </div>
          <div className=" pb-2 pt-2">
            <button
              className="bg-blue-900 block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue"
              type="submit"
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
      {/* <div class="flex">
      <a
        href="/register"
        class="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center"
      >
        <span>
          <svg
            class="h-6 w-6"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </span>
        <span class="ml-2">You don't have an account?</span>
      </a>
    </div> */}
    </section>
  );
};

export default Testscreen;

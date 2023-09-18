import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { checkemail } from '../../store/otpSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ForgetPassword = () => {

const [email, setEmail] = useState('');
const navigate = useNavigate();
const dispatch = useDispatch();

const updateEmail = useSelector((state) => state.otp);




 const submitHandler = async(e) => {
    e.preventDefault();
    dispatch(checkemail(email)).then((result) => {
        if(result.payload == undefined) {
          Swal.fire('Invalid Email or Password')
        }
        else {
          navigate("/otpScreen");
        }
    })
};

  return (
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-300">
  <div class="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
    <div class="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">Forget Password</div>
    <div class="mt-10">
      <form onSubmit={submitHandler}>
        <div class="flex flex-col mb-6">
          <label for="email" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">E-Mail Address:</label>
          <div class="relative">
            <div class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
              <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>

            <input id="email" type="email" name="email" class="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="E-Mail Address" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
        </div>
       

        {/* <div class="flex items-center mb-6 -mt-4">
          <div class="flex ml-auto">
            <a href="/" class="inline-flex text-xs sm:text-sm text-blue-500 hover:text-blue-700">Forgot Your Password?</a>
          </div>
        </div> */}

        <div class="flex w-full">
          <button type="submit" class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in">
            <span class="mr-2 uppercase">Next</span>
           
          </button>
        </div>
      </form>
    </div>
    {/* <div class="flex justify-center items-center mt-6">
      <a href="/register" class="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center">
        <span>
          <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </span>
        <span class="ml-2">You don't have an account?</span>
      </a>
    </div> */}
  </div>
</div>
  )
}

export default ForgetPassword

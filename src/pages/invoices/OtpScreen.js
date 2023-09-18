import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OtpScreen = () => {

    const [otp, setOtp] = useState('');

   const navigate = useNavigate();
   const updateEmail = useSelector((state) => state.otp)
   const login  = updateEmail;


   useEffect(() => {
    // if (!login)
    //   navigate('/');
  }, [])
  const emailotp = login?.login.sentotp;



  const submitHandler = async(e) => {
        e.preventDefault();
        if (otp == emailotp) {
          navigate('/changePasswordScreen');
        }
        else {
          Swal.fire("OTP Mismatch");
        }
  };

  return (
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-300">
  <div class="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
    <div class="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">OTP</div>
    <div class="mt-10">
      <form onSubmit={submitHandler}>
        <div class="flex flex-col mb-6">
          <label for="email" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Enter OTP:</label>
          <div class="relative">
            <div class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
              <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>

            <input id="otp" type="otp" name="otp" class="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="Enter Otp" value={otp} onChange={(e) => setOtp(e.target.value)}/>
          </div>
        </div>
       

        

        <div class="flex w-full">
          <button type="submit" class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in">
            <span class="mr-2 uppercase">Next</span>
           
          </button>
        </div>
      </form>
    </div>
    
  </div>
</div>
  )
}

export default OtpScreen

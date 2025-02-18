import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-400 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {/* Logo & Heading */}
        <div className="flex justify-center mb-4">
          <img
            src="/src/assets/images/logo-unpak.png"
            alt="Logo"
            className="h-16"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Universitas Pakuan
        </h2>
        <p className="text-center text-gray-600 mb-6">Computer Based test</p>

        {/* Form */}
        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              placeholder="Masukan username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={isVisible ? "text" : "password"} // Toggle antara "password" & "text"
                placeholder="Masukan password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100 pr-10"
              />
              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-purple-500"
              >
                {isVisible ? <HiEye size={20} /> : <HiEyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          {/* <div className="flex justify-between text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-purple-500 hover:underline">
              Forgot password?
            </a>
          </div> */}

          <div className="mb-8"></div>

          {/* Login Button */}
          <button className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition">
            Masuk
          </button>
        </form>

        <div className="text-sm text-center text-gray-400 mt-5">2025 Universitas Pakuan All Right Reserved.</div>

        {/* Register Option */}
        {/* <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="#" className="text-purple-500 hover:underline">
            Sign Up
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;

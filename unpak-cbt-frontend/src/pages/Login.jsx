import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import logo from "@assets/images/logo-unpak.png";
import { useAuth } from "../context/authContext";
import { apiProduction, apiSelectProduction } from "@src/Constant"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    setLoading(true);
    try {
      const response = await apiProduction.post("/api/Authentication", {
        username,
        password,
      },{
        validateStatus: () => true,
      });

      const contentType = response.headers["content-type"] || "";
      const isJson = contentType?.includes("application/json") || contentType.includes("application/problem+json");

      if (!isJson) {
        alert("ada masalah pada server");
        return;
      }

      const status = response.status;
      const data = response.data;
      if(status>=400){
        alert(data.detail);
        return;
      }

      const token = data;
      // console.log("Token:", token);

      if (token) {
        login(token);
      } else {
        setError("Login gagal, silakan coba lagi.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat login.");
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-400 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {/* Logo & Heading */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
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
          <Input
            label="Username"
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

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

          {/* Pesan Error */}
          {error && (
            <div className="text-sm text-center text-red-600 bg-red-100 rounded-md py-2 px-4">
              {error}
            </div>
          )}

          <div className="mb-4"></div>

          {/* Login Button */}
          <Button loading={loading} onClick={handleLogin} className="w-full">
            Masuk
          </Button>
        </form>

        <div className="text-sm text-center text-gray-400 mt-5">
          © {new Date().getFullYear()} Universitas Pakuan. All Rights Reserved.
        </div>

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

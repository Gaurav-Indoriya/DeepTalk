import React, { useState } from "react";
import { verifyLogin } from "../services/UserServices"
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user.username || !user.password) {
            toast.error("Please enter username and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await verifyLogin(user);

            console.log(response.data);

            toast.success(response.data.message);

            // Save logged-in user
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            // Redirect to chat page
            navigate("/Home");

        } catch (error) {

            console.log(error);

            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Unable to connect to server.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 p-24">

            <nav className="fixed top-0 left-0 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 z-50">

                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    <div className="flex items-center gap-3">

                        <i className="fa-solid fa-comments text-4xl text-blue-500"></i>

                        <h1 className="text-3xl font-bold text-white">

                            DeepTalk

                        </h1>

                    </div>

                    <div className="flex items-center gap-4">

                        <Link
                            to="/"
                            className="text-slate-300 hover:text-blue-500 transition font-medium"
                        >

                            Homepage

                        </Link>

                        <Link
                            to="/Login"
                            className="text-slate-300 hover:text-blue-500 transition font-medium"
                        >

                            Login

                        </Link>

                        <Link
                            to="/Register"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                        >

                            Register

                        </Link>

                    </div>

                </div>

            </nav>

            <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8">

                {/* Logo */}

                <div className="text-center mb-8">

                    <div className="flex justify-center">

                        <div className="h-20 w-20 rounded-full bg-blue-600/20 flex items-center justify-center">

                            <i className="fa-solid fa-comments text-blue-500 text-4xl"></i>

                        </div>

                    </div>

                    <h1 className="text-4xl font-bold text-white mt-4">

                        <span className="text-blue-500">Deep</span>Talk

                    </h1>

                    <p className="text-slate-400 mt-2">
                        Login to continue
                    </p>

                </div>

                {/* Form */}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Username */}

                    <div>

                        <label className="text-slate-300 text-sm">
                            Username
                        </label>

                        <div className="relative mt-2">

                            <i className="fa-solid fa-user absolute left-4 top-4 text-slate-500"></i>

                            <input
                                type="text"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500"
                            />

                        </div>

                    </div>

                    {/* Password */}

                    <div>

                        <label className="text-slate-300 text-sm">
                            Password
                        </label>

                        <div className="relative mt-2">

                            <i className="fa-solid fa-lock absolute left-4 top-4 text-slate-500"></i>

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-12 text-white outline-none focus:border-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-slate-400"
                            >
                                <i
                                    className={`fa-solid ${showPassword
                                        ? "fa-eye-slash"
                                        : "fa-eye"
                                        }`}
                                ></i>
                            </button>

                        </div>

                    </div>

                    {/* Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-white font-semibold transition"
                    >

                        {loading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                Logging In...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-right-to-bracket mr-2"></i>
                                Login
                            </>
                        )}

                    </button>

                </form>

                <p className="text-center text-slate-400 mt-8">

                    Don't have an account?

                    <span
                        onClick={() => navigate("/Register")}
                        className="text-blue-500 cursor-pointer ml-2 hover:underline"
                    >
                        Register
                    </span>

                </p>

            </div>

        </div>
    );
};

export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../services/UserServices";

const Register = () => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        name: "",
        mobile: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        // Username
        if (name === "username") {

            const username = value.toLowerCase();

            if (!/^[a-z0-9._]*$/.test(username)) {
                return;
            }

            setFormData({
                ...formData,
                username
            });

            return;
        }

        // Mobile
        if (name === "mobile") {

            // Allow only digits and maximum 10 characters
            if (!/^\d{0,10}$/.test(value)) {
                return;
            }

            setFormData({
                ...formData,
                mobile: value
            });

            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const usernameRegex = /^[a-z0-9._]{4,20}$/;

        if (!usernameRegex.test(formData.username)) {

            toast.error(
                "Username must be 4-20 characters and contain only lowercase letters, numbers, '.' or '_'."
            );

            return;

        }

        const mobileRegex = /^[6-9]\d{9}$/;

        if (!mobileRegex.test(formData.mobile)) {

            toast.error(
                "Please enter a valid 10-digit mobile number."
            );

            return;

        }

        if (formData.password.length < 6) {

            toast.error(
                "Password must be at least 6 characters."
            );

            return;

        }

        if (formData.password !== formData.confirmPassword) {

            toast.error(
                "Password and Confirm Password do not match."
            );

            return;

        }

        try {

            setLoading(true);

            const response = await register({

                username: formData.username,
                name: formData.name.trim(),
                mobile: formData.mobile,
                password: formData.password

            });

            toast.success(response.data.message);

            setFormData({

                username: "",
                name: "",
                mobile: "",
                password: "",
                confirmPassword: ""

            });

            navigate("/");

        } catch (error) {

            toast.error(

                error.response?.data?.message ||
                "Registration Failed"

            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-slate-950 p-24">
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

            {/* Background */}

            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 opacity-90"></div>

            <div className="relative z-10 container mx-auto px-6 py-10">

                <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">

                    {/* LEFT SIDE */}

                    <div>

                        <div className="flex items-center gap-4 mb-8">

                            <div className="w-20 h-20 rounded-full bg-blue-600 flex justify-center items-center shadow-2xl">

                                <i className="fa-solid fa-comments text-white text-4xl"></i>

                            </div>

                            <div>

                                <h1 className="text-6xl font-extrabold text-white">

                                    <span className="text-blue-500">
                                        Deep
                                    </span>

                                    Talk

                                </h1>

                                <p className="text-slate-400 text-lg mt-2">

                                    Connect. Chat. Discover.

                                </p>

                            </div>

                        </div>

                        <h2 className="text-5xl font-bold text-white leading-tight">

                            Meet New People,

                            <br />

                            Start Meaningful

                            <span className="text-blue-500">
                                {" "}Conversations.
                            </span>

                        </h2>

                        <p className="text-slate-400 text-xl mt-8 leading-9">

                            DeepTalk is a public chat platform where you can
                            connect with anyone, build friendships, and chat
                            instantly in a clean, secure and modern interface.

                        </p>

                        <div className="grid grid-cols-2 gap-5 mt-12">

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                                <i className="fa-solid fa-comments text-blue-500 text-3xl mb-4"></i>

                                <h3 className="text-white font-bold text-xl">

                                    Instant Chat

                                </h3>

                                <p className="text-slate-400 mt-2">

                                    Real-time conversations with anyone.

                                </p>

                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                                <i className="fa-solid fa-user-group text-green-500 text-3xl mb-4"></i>

                                <h3 className="text-white font-bold text-xl">

                                    Find Friends

                                </h3>

                                <p className="text-slate-400 mt-2">

                                    Search users and build your network.

                                </p>

                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                                <i className="fa-solid fa-shield-halved text-yellow-500 text-3xl mb-4"></i>

                                <h3 className="text-white font-bold text-xl">

                                    Safe

                                </h3>

                                <p className="text-slate-400 mt-2">

                                    Simple and secure communication.

                                </p>

                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                                <i className="fa-solid fa-globe text-purple-500 text-3xl mb-4"></i>

                                <h3 className="text-white font-bold text-xl">

                                    Global

                                </h3>

                                <p className="text-slate-400 mt-2">

                                    Chat with people from everywhere.

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div>

                        <div className="bg-slate-900/90 backdrop-blur-lg border border-slate-800 rounded-3xl shadow-2xl p-10">

                            <h2 className="text-4xl font-bold text-white">

                                Create Account

                            </h2>

                            <p className="text-slate-400 mt-2 mb-8">

                                Join DeepTalk today.

                            </p>

                            <form onSubmit={handleSubmit}>

                                <div className="grid md:grid-cols-2 gap-5">

                                    {/* Username */}

                                    <div>

                                        <label className="text-slate-300 mb-2 block">

                                            Username

                                        </label>

                                        <div className="relative">

                                            <i className="fa-solid fa-user absolute left-4 top-4 text-slate-500"></i>

                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder="Username"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-blue-500"
                                            />

                                        </div>

                                    </div>

                                    {/* Full Name */}

                                    <div>

                                        <label className="text-slate-300 mb-2 block">

                                            Full Name

                                        </label>

                                        <div className="relative">

                                            <i className="fa-solid fa-id-card absolute left-4 top-4 text-slate-500"></i>

                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={(e) => {

                                                    const value = e.target.value;

                                                    if (/^[A-Za-z ]*$/.test(value)) {

                                                        setFormData({
                                                            ...formData,
                                                            name: value
                                                        });

                                                    }

                                                }}
                                                placeholder="Full Name"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-blue-500"
                                                required
                                            />

                                        </div>

                                    </div>
                                    {/* Mobile */}

                                    <div>

                                        <label className="text-slate-300 mb-2 block">

                                            Mobile Number

                                        </label>

                                        <div className="relative">

                                            <i className="fa-solid fa-mobile-screen absolute left-4 top-4 text-slate-500"></i>

                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                placeholder="Mobile Number"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-blue-500"
                                                required
                                            />

                                        </div>

                                    </div>

                                    {/* Password */}

                                    <div>

                                        <label className="text-slate-300 mb-2 block">

                                            Password

                                        </label>

                                        <div className="relative">

                                            <i className="fa-solid fa-lock absolute left-4 top-4 text-slate-500"></i>

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Password"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-12 py-3 text-white outline-none focus:border-blue-500"
                                                required
                                                minLength={6}
                                            />

                                            <i
                                                onClick={() => setShowPassword(!showPassword)}
                                                className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} absolute right-4 top-4 text-slate-500 cursor-pointer hover:text-blue-500`}
                                            ></i>

                                        </div>

                                    </div>

                                </div>

                                {/* Confirm Password */}

                                <div className="mt-6">

                                    <label className="text-slate-300 mb-2 block">
                                        Confirm Password
                                    </label>

                                    <div className="relative">

                                        <i className="fa-solid fa-lock absolute left-4 top-4 text-slate-500"></i>

                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm Password"
                                            required
                                            className={`w-full bg-slate-800 rounded-xl pl-12 pr-12 py-3 text-white outline-none border ${formData.confirmPassword &&
                                                formData.password !== formData.confirmPassword
                                                ? "border-red-500"
                                                : "border-slate-700 focus:border-blue-500"
                                                }`}
                                        />

                                        <i
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                                                } absolute right-4 top-4 text-slate-500 cursor-pointer hover:text-blue-500`}
                                        ></i>

                                    </div>

                                    {formData.confirmPassword &&
                                        formData.password !== formData.confirmPassword && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                <i className="fa-solid fa-circle-exclamation"></i>
                                                Passwords do not match.
                                            </p>
                                        )}

                                    {formData.confirmPassword &&
                                        formData.password === formData.confirmPassword && (
                                            <p className="text-green-500 text-sm mt-2 flex items-center gap-2">
                                                <i className="fa-solid fa-circle-check"></i>
                                                Passwords match.
                                            </p>
                                        )}

                                </div>


                                {/* Register Button */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 py-4 rounded-xl text-lg font-semibold text-white transition duration-300 shadow-lg"
                                >

                                    {loading ? (

                                        <>
                                            <i className="fa-solid fa-spinner fa-spin mr-2"></i>

                                            Creating Account...
                                        </>

                                    ) : (

                                        <>
                                            <i className="fa-solid fa-user-plus mr-2"></i>

                                            Create Account
                                        </>

                                    )}

                                </button>

                            </form>

                            <div className="mt-8 text-center">

                                <p className="text-slate-400">

                                    Already have an account?

                                    <Link
                                        to="/Login"
                                        className="text-blue-500 font-semibold ml-2 hover:underline"
                                    >
                                        Login Here
                                    </Link>

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Register;
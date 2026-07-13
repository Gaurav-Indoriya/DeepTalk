import React from "react";
import { Link } from "react-router-dom";

const Home = () => {

    return (

        <div className="min-h-screen bg-slate-950">

            {/* ================= Navbar ================= */}

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

            {/* ================= Hero ================= */}

            <section className="pt-36 pb-20">

                <div className="max-w-7xl mx-auto px-6">

                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        {/* Left */}

                        <div>

                            <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full">

                                Welcome to DeepTalk

                            </span>

                            <h1 className="text-6xl font-extrabold text-white leading-tight mt-8">

                                Connect with Friends

                                <span className="block text-blue-500">

                                    Anytime.

                                </span>

                            </h1>

                            <p className="text-slate-400 text-xl mt-8 leading-9">

                                DeepTalk is a modern real-time messaging platform.

                                Chat instantly, know who's online,

                                see typing indicators, read receipts,

                                and stay connected everywhere.

                            </p>

                            <div className="mt-10 flex gap-5">

                                <Link
                                    to="/Register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg transition"
                                >

                                    Get Started

                                </Link>

                                <Link
                                    to="/Login"
                                    className="border border-slate-700 hover:border-blue-500 text-white px-8 py-4 rounded-xl text-lg transition"
                                >

                                    Login

                                </Link>

                            </div>

                        </div>

                        {/* Right */}

                        <div>

                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

                                <div className="flex justify-between items-center mb-6">

                                    <div className="flex items-center gap-3">

                                        <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center">

                                            <i className="fa-solid fa-user text-blue-500"></i>

                                        </div>

                                        <div>

                                            <h3 className="text-white font-semibold">

                                                Gaurav

                                            </h3>

                                            <p className="text-green-500 text-sm">

                                                Online

                                            </p>

                                        </div>

                                    </div>

                                    <i className="fa-solid fa-phone text-slate-500"></i>

                                </div>

                                <div className="space-y-4">

                                    <div className="flex justify-start">

                                        <div className="bg-slate-800 px-4 py-3 rounded-2xl text-white">

                                            Hello 👋

                                        </div>

                                    </div>

                                    <div className="flex justify-end">

                                        <div className="bg-blue-600 px-4 py-3 rounded-2xl text-white">

                                            Hi Gaurav.

                                        </div>

                                    </div>

                                    <div className="flex justify-start">

                                        <div className="bg-slate-800 px-4 py-3 rounded-2xl text-white">

                                            How are you?

                                        </div>

                                    </div>

                                    <div className="flex justify-end">

                                        <div className="bg-blue-600 px-4 py-3 rounded-2xl text-white">

                                            I'm good 😄

                                            <div className="text-xs text-right mt-1">

                                                ✔✔

                                            </div>

                                        </div>

                                    </div>

                                    <div className="text-green-500 text-sm italic">

                                        Gaurav is typing...

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </div>

    );

};

export default Home;
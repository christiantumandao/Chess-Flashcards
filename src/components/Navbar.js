import React, { useEffect, useRef, useState } from "react";
import "../styles/navbar.css";
import { useLocation, useNavigate } from "react-router-dom";

import { auth } from "../firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";


import { PiCardsLight } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { BsThreeDots } from "react-icons/bs";
import { IoReorderThree } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { RxExit } from "react-icons/rx";


const Navbar = (props) => {

    const { tab, setTab } = props;

    const nav = useNavigate();
    const [user] = useAuthState(auth);
    const currPath = useLocation();
    const [showMobileNav, setShowMobileNav] = useState(false);

    const mobileNavRef= useRef(null);

    useEffect(()=>{
        if (currPath.pathname !== tab) {
            let relPath = currPath.pathname.slice(1);
            if (relPath === "") relPath = "explore";
            else if (relPath === "sign-up") relPath = "signup"
            else if (relPath === "log-in") relPath = "login"
            else if (relPath === "flashcards") relPath = "test"
            else if (relPath === "about") relPath = "more"

            setTab(relPath);
        }
    },[currPath, tab, setTab])


    useEffect(()=> {

        const handleOutsideClick = (e) => {
            if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
                setShowMobileNav(false);
            }
        }

        if (showMobileNav) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

    },[showMobileNav]);

    return (
        <>
        <div className="navbar-wrapper">

            <h2>Chess Flashcards</h2>

            <nav>
                <button
                    className={(tab === "explore") ? "selected-tab" : ""} 
                    onClick = { () => { nav("/"); setTab("explore"); }}
                >
                    <FaSearch />
                    Explore
                </button>

                <button
                className={(tab === "test") ? "selected-tab" : ""} 
                onClick = { () => { nav("/flashcards"); setTab('test'); }}
                >
                    <PiCardsLight />
                    Flashcards
                </button>

                {
                    (user) ?
                        <button
                        className={(tab === "profile") ? "selected-tab" : ""} 
                        onClick = { () => { nav("/profile"); setTab("profile"); }}
                        >
                            <CgProfile />
                            Profile
                        </button>
                        :
                        <>
                        <button
                        className={(tab === "signup") ? "selected-tab" : ""} 
                        onClick = { () => { nav("/sign-up"); setTab("signup"); }}
                        >
                            Signup
                        </button>
                        <button
                        className={(tab === "login") ? "selected-tab" : ""} 
                        onClick = { () => { nav("/log-in"); setTab('login'); }}
                        >
                            Login
                        </button>
                    </>
                }



                <button
                    onClick = { () => { nav("/about"); setTab('more');  }}
                    className={(tab === "more") ? "selected-tab" : ""} 
                >
                    <BsThreeDots />
                    About
                </button>
            </nav>
            
        </div>
        
        <div className={ (showMobileNav) ? "hidden navbar-icon" : "navbar-icon"}>
            <button onClick = { ()=> setShowMobileNav(true)}>
                <IoReorderThree />
            </button>
        </div>
      

        {
            (showMobileNav) ? 
            <div className="mobilenav-wrapper">
                <div className="mobilenav-container" ref = { mobileNavRef }>

                    <button 
                        className="navbar-exit"
                        onClick = {()=>setShowMobileNav(false)}>
                        <RxExit />
                    </button>

                    <h2>Chess Flashcards</h2>

                    <nav>
                        <button
                            className={(tab === "explore") ? "selected-tab" : ""} 
                            onClick = { () => { nav("/"); setTab("explore"); setShowMobileNav(false); }}
                        >
                            <FaSearch />
                            Explore
                        </button>

                        <button
                        className={(tab === "test") ? "selected-tab" : ""} 
                        onClick = { () => { nav("/flashcards"); setTab('test'); setShowMobileNav(false); }}
                        >
                            <PiCardsLight />
                            Flashcards
                        </button>

                        {
                            (user) ?
                                <button
                                className={(tab === "profile") ? "selected-tab" : ""} 
                                onClick = { () => { nav("/profile"); setTab("profile"); setShowMobileNav(false); }}
                                >
                                    <CgProfile />
                                    Profile
                                </button>
                                :
                                <>
                                <button
                                className={(tab === "signup") ? "selected-tab" : ""} 
                                onClick = { () => { nav("/sign-up"); setTab("signup"); setShowMobileNav(false); }}
                                >
                                    Signup
                                </button>
                                <button
                                className={(tab === "login") ? "selected-tab" : ""} 
                                onClick = { () => { nav("/log-in"); setTab('login'); setShowMobileNav(false); }}
                                >
                                    Login
                                </button>
                            </>
                        }



                        <button
                            onClick = { () => { nav("/about"); setTab('more'); setShowMobileNav(false); }}
                            className={(tab === "more") ? "selected-tab" : ""} 
                        >
                            <BsThreeDots />
                            More
                        </button>
                    </nav>     
                </div>
            </div>
            : null
        }

        </>


    )
}

export default Navbar;
import React, { useEffect, useState } from "react";
import "../styles/login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";


import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase.config";
import { doc, setDoc } from "@firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const LogIn = (props) => {

    const [user] = useAuthState(auth);
    const currPath = useLocation();
    const { login }  = props;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const nav = useNavigate();


    useEffect(()=>{
        return ()=>{
            setPassword("");
            setConfirmPassword("");
            setEmail("");
            setFirstName("");
            setLastName("");
            setErrorMessage('');
        }
    },[currPath]);



    const submitLogin = async (e) => {
        e.preventDefault();

        if (login) {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setErrorMessage("");
                setEmail("");
                setPassword("")
                setConfirmPassword("");
                setFirstName("");
                setFirstName("");
                nav("/flashcards");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMessage(error.code);
            });
            
        }

    }

    const createUser = async (e) => {
        e.preventDefault();
        const valid = validate();
        if (!valid) {
            return;
        }
            await createUserWithEmailAndPassword(auth, email, password)
                .then( async (userCredential)=>{
                    const user = userCredential.user;
                    const docRef = doc(db, "userData", user.uid);
                    await setDoc(docRef, {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        correct: 0,
                        incorrect: 0,
                        added: 0
                    })
                    setPassword("");
                    setConfirmPassword("");
                    setEmail("");
                    setFirstName("");
                    setLastName("");
                    nav("/flashcards");
                })
                .catch((e)=>{
                    setErrorMessage(e.code);
                    console.error(e);
                })
           


    }

    const validate = () => {
        if (password !== confirmPassword) {
            setErrorMessage("Passwords must match!");
            return false;
        }
        else if (password.length <= 8) {
            setErrorMessage("Password must be more than 8 characters long!");
            return false;
        }
        return true;
    }


    return (
        <div className="login-wrapper page">
            <div className="login-container">

                {
                    (login) ? <h2>Login</h2> : <h2>Sign up</h2>
                }

                {
                    (errorMessage.length === 0) ? null : <div className="error-message">{ errorMessage } </div>
                }

                <form 
                    onSubmit = { (login) ? submitLogin : createUser }
                    className="login-info">

                    {
                        (!login) ? 
                        <>
                          <input 
                                type="text"
                                placeholder="First Name"
                                value = { firstName }
                                onChange = { (e)=> setFirstName(e.target.value)}
                                required
                            />
                            <input 
                                type="text"
                                placeholder="Last Name"
                                value = { lastName }
                                onChange = { (e)=> setLastName(e.target.value)}
                                required
                            />
                    </> : null
                    }
                    <input
                        placeholder="E-mail"
                        type="text"
                        value = { email }
                        onChange = { (e)=> setEmail(e.target.value) }
                        required
                    />
                    <input 
                        type="password"
                        placeholder="Password"
                        value = { password }
                        onChange = { (e)=> setPassword(e.target.value)}
                        required
                    />
                    {
                        (!login) ? 

                            <input 
                                type="password"
                                placeholder="Confirm Password"
                                value = { confirmPassword }
                                onChange = { (e)=> setConfirmPassword(e.target.value)}
                                required
                            />
                        : null
                    }

                    <button className="login-button" type="submit">
                        {
                            (login) ? <>Login</> : <>Sign up</>
                        }
                    </button>
                </form>
                {
                    (!login) ? 
                    <>
                    <div className="or">
                        or
                    </div>
                    <div className="sign-up-link">
                        <Link to="/log-in">Already have an account? Log in</Link>
                    </div>
                </>
                    :
                    <>
                        <div className="or">
                            or
                        </div>
                        <div className="sign-up-link">
                            <Link to="/sign-up">Don't have a Profile? Sign up</Link>
                        </div>
                    </>
                }

            </div>
        </div>
    );
}


export default LogIn;
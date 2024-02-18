import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import { auth, db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { EmailAuthProvider, deleteUser, getAuth, reauthenticateWithCredential } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { deleteDoc, doc, getDoc } from "@firebase/firestore";
const Profile = () => {

    const nav = useNavigate();

    const [logout, setLogout] = useState(false);
    const [del, setDel] = useState(false);
    const [userData, setUserData] = useState(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    const [errorMessage, setErrorMessage] = useState("");


    useEffect(()=>{
        const getUserData = async () => {
            const user = auth.currentUser;
            if (!user) {
                console.log(user);
                return false;
            }
            try {
                const ref = doc(db, "userData", user.uid);
                console.log("getting doc")

                const docSnap = await getDoc(ref);
                console.log(user.uid);

                console.log("recieved doc")
                if (docSnap.exists()) {
                    console.log(docSnap.data());
                    setUserData(docSnap.data());
                } else {
                    console.log("could not find user");
                }
            } catch (e) {
                console.error(e);
            }
        }
        const getData = async () => {
            await getUserData();
        }

        getData();
    },[])

    const signOutUser = () => {
        try {
            auth.signOut();
        } catch (e) {
            console.error(e);
        } finally {
            nav("/");
        }
    }

    const promptPassword = () => {

    }

    const deleteAccount = async () => {
        const user = auth.currentUser;
        if (!user) return;
            try {

                const auth = getAuth()
                const credential = EmailAuthProvider.credential(
                    auth.currentUser.email,
                    confirmPw
                )
                const result = await reauthenticateWithCredential(
                    auth.currentUser, 
                    credential
                )

                deleteUser(user)
                    .then(async ()=>{
                        await deleteDoc(doc(db, "userData",user.uid));
                        nav("/log-in");
                        setErrorMessage("");
                    })
            } catch (e) {
                console.error(e);
                setErrorMessage(e.code);
            }
    }


    return (
        <div className="page profile-wrapper">
            <div className="profile-blob">

                <header className="profile-header">
                    <h1>Profile</h1>
                </header>

                <section className="profile-blobcontent">
                    <h2>Settings</h2>
                    <div className="profile-field">
                        <div>E-mail</div>
                        <p className="email">{(userData) ? userData.email : null}</p>
                    </div>
                    <div className="profile-field">
                        <div>First Name</div>
                        <input 
                            placeholder={(userData) ? userData.firstName : null}
                            value = {firstName}
                            onChange = { (e)=>setFirstName(e.target.value)}
                        />
                        {
                            (firstName.length !== 0) ? <button>Change</button> : null
                        }
                    </div>
                    <div className="profile-field">
                        <div>Last Name</div>
                        <input 
                            placeholder={(userData) ? userData.lastName : null}
                            value = {lastName}
                            onChange = { (e)=>setLastName(e.target.value)}
                        />
                        {
                            (lastName.length !== 0) ? <button>Change</button> : null
                        }
                    </div>

                </section>
            </div>

            <div className="profile-blob">

            <section className="profile-blobcontent">
                    <h2>Statistics</h2>

                    <div className="profile-field">
                        <div>Cards correct</div>
                        <div className="stat">{(userData) ? userData.correct : null}</div>
                    </div>
                    <div className="profile-field">
                        <div>Cards incorrect</div>
                        <div className="stat">{(userData) ? userData.incorrect : null}</div>
                    </div>
                </section>
            </div>

            <div className="profile-blob">
                <section className="profile-blobcontent profile-red-btns">
                    <button onClick = { () => setLogout(true) } >
                        Sign out
                    </button>

                    <button onClick = { () => setDel(true) }>
                        Delete account
                    </button>
                </section>
            </div>

            {
                (del || logout) ? 
                <div className="modal-wrapper">
                    <div className="modal-container">
                        <section className="modal-header">
                            {
                                (logout) ? <h2>Log out?</h2> : <h2>Delete account?</h2>
                            }
                        </section>

                        <section className="modal-body">
                            {
                                (logout) ?
                                <div className="modal-buttons">
                                
                                    <button className="confirm" onClick = { ()=>{
                                        signOutUser();
                                        setLogout(false);
                                        setDel(false);
                                    }}
                                    >
                                        Log out
                                    </button>
                                    <button className="delete" onClick = { ()=>{
                                        setLogout(false);
                                        setDel(false);
                                    
                                    }}>
                                            Cancel
                                    </button>
                                

                                </div> : 
                                <div className="confirm-delete">
                                    <p className="error-message">{errorMessage}</p>
                                    <input 
                                        type="password"
                                        placeholder="Confirm password"
                                        value = { confirmPw }
                                        onChange = { (e)=>setConfirmPw(e.target.value)}
                                        required
                                    />
                                    <div className="modal-buttons">
                                        <button className="confirm-delete-btn"
                                            onClick = {deleteAccount}
                                        >
                                            Delete
                                        </button>
                                        <button className="delete" onClick = { ()=>{
                                            setLogout(false);
                                            setDel(false);
                                        }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            }
                        </section>
                    </div>
                </div>
            : null
            }

        </div>
    )
}

export default Profile;
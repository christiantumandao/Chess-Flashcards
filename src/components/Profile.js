import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import { auth, db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { EmailAuthProvider, deleteUser, getAuth, reauthenticateWithCredential } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { deleteDoc, doc, getDoc } from "@firebase/firestore";
import { updateFirstName, updateLastName } from "../util/users";
const Profile = () => {

    const nav = useNavigate();

    const [logout, setLogout] = useState(false);
    const [del, setDel] = useState(false);
    const [userData, setUserData] = useState(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [user] = useAuthState(auth);


    useEffect(()=>{
        const getUserData = async () => {
            const user = auth.currentUser;
            if (!user) {
                return false;
            }
            try {
                const ref = doc(db, "userData", user.uid);

                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.error("Error: Could not find user");
                }
            } catch (e) {
                console.error(e);
            }
        }
        const getData = async () => {
            await getUserData();
        }

        getData();

        return () => {
            setErrorMessage("");
        }
    },[])

    const signOutUser = () => {
        try {
            auth.signOut();

        } catch (e) {
            console.error(e);
        } finally {
            nav("/log-in");
        }
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
                await reauthenticateWithCredential(
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

    const handleFirstNameChange = async () => {
        try {
            await updateFirstName(firstName, user);
            //const newData = { ...userData, firstName: firstName };
            setFirstName("");
            
        } catch (e) {
            console.error(e);
        }
        
    }

    const handleLastNameChange = async () => {
        try {
            await updateLastName(lastName, user);
           // const newData = { ...userData, lastName: lastName };
            setLastName("");
        } catch (e) {
            console.error(e);
        }

    }


    return (
        <div className="page profile-wrapper">

            <h1>Settings</h1>
            <div className="profile-blob">
                <section className="profile-blobcontent">
                    <h3>Profile</h3>
                    <div className="profile-field profile-setting">
                        <div>E-mail</div>
                        <p className="email">{(userData) ? userData.email : null}</p>
                    </div>
                    <div className="profile-field profile-setting">
                        <div>First Name</div>
                        <input 
                            placeholder={(userData) ? userData.firstName : null}
                            value = {firstName}
                            onChange = { (e)=>setFirstName(e.target.value)}
                        />
                        {
                            (firstName.length !== 0) ? 
                                <button onClick = { handleFirstNameChange}>Change</button> 
                                : null
                        }
                    </div>
                    <div className="profile-field profile-setting">
                        <div>Last Name</div>
                        <input 
                            placeholder={(userData) ? userData.lastName : null}
                            value = {lastName}
                            onChange = { (e)=>setLastName(e.target.value)}
                        />
                        {
                            (lastName.length !== 0) ? 
                                <button onClick = { handleLastNameChange }>Change</button> 
                                : null
                        }
                    </div>

                </section>
            </div>

            <div className="profile-blob">

            <section className="profile-blobcontent">
                    <h3>Statistics</h3>

                    <div className="profile-field">
                        <div>Cards Correct</div>
                        <div className="stat">{(userData) ? userData.correct : null}</div>
                    </div>
                    <div className="profile-field">
                        <div>Cards Incorrect</div>
                        <div className="stat">{(userData) ? userData.incorrect : null}</div>
                    </div>
                    <div className="profile-field">
                        <div>Total Cards Completed</div>
                        <div className="stat">{(userData) ? userData.incorrect + userData.correct : null}</div>
                    </div>
                    <div className="profile-field">
                        <div>Accuracy</div>
                        <div className="stat">{(userData) ? (userData.correct + userData.incorrect === 0) ? 0 : ((userData.correct)/(userData.incorrect + userData.correct)).toFixed(2) : null}</div>
                    </div>
                </section>
            </div>

            <div className="profile-blob">
                <section className="profile-blobcontent profile-red-btns">
                    <button className="red-btn" onClick = { () => setLogout(true) } >
                        Sign out
                    </button>

                    <button className="red-btn" onClick = { () => setDel(true) }>
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
                                
                                    <button className="confirm red-btn" onClick = { ()=>{
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
                                    { (errorMessage.length > 0) ? <p className="error-message">{errorMessage}</p> : null }
                                    <input 
                                        type="password"
                                        placeholder="Confirm password"
                                        value = { confirmPw }
                                        onChange = { (e)=>setConfirmPw(e.target.value)}
                                        required
                                    />
                                    <div className="modal-buttons">
                                        <button className="confirm-delete-btn red-btn"
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
import { doc, updateDoc } from "@firebase/firestore"
import { db } from "../firebase.config"

const updateFirstName = async (firstName, user) => {
    try {
        const ref = doc(db, "userData", user.uid);
        await updateDoc(ref, {
            firstName: firstName
        })
    } catch (e) {
        console.log("Something went wrong. Try again later");
        console.error(e);

    }
}

const updateLastName = async (lastName, user) => {
    try {
        const ref = doc(db, "userData", user.uid);
        await updateDoc(ref, {
            lastName: lastName
        })
    } catch (e) {
        console.log("Something went wrong. Try again later");
        console.error(e);
    }
}

export { updateFirstName, updateLastName };
import { db } from "../firebase.config";
import { collection, getDocs, limit, query, where } from "@firebase/firestore";
import { parseQuery } from "./helper";

const search = async (searchQuery, setSearchResults, resultLimit) => {
    try {
        const sq = parseQuery(searchQuery);
        if (searchQuery.length === 0) {
            setSearchResults([]);
            return;
        }

        const collectionRef = collection(db, "openings");
        const q = query(collectionRef, where("name", ">=", sq), limit(resultLimit));
        const querySnapshot = await getDocs(q);
        const res = []
        querySnapshot.forEach((doc)=> {
            res.push(doc.data());
        })
        setSearchResults(res);
    } catch (e) {
        console.error(e);
    }
}




export default search;
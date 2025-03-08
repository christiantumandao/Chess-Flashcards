import React, { useEffect, useState } from "react";

import { FaSearch } from "react-icons/fa";
import search from "../../../util/search";
import { BsCaretDown } from "react-icons/bs";

const TopHeaderExplore = (props) => {

    const { setSearchResults } = props

    const [searchQuery, setSearchQuery] = useState("");
    const [resultLimit, setResultLimit] = useState(20);

    useEffect(()=>{
        return (()=>{
            setSearchQuery("");
            setSearchResults([]);
        })
    },[setSearchQuery, setSearchResults]);

    const handleSubmitSearch = (e) => {
        e.preventDefault();
        search(searchQuery, setSearchResults, resultLimit)
    }
 
    return (
        <form className="search-container" onSubmit = { handleSubmitSearch }>
            <input 
                type="search"
                placeholder="Search openings"
                value = { searchQuery }
                onChange = { (e)=> setSearchQuery(e.target.value)}
                required
            />

            <div className="search-btns">
                <select
                    value = { resultLimit }
                    onChange = {(e) => setResultLimit(e.target.value)}
                >
                    <option value = {5}>5</option>
                    <option value = {10}>10</option>
                    <option value = {20}>20</option>
                    <option value = {50}>50</option>

                </select>
                <BsCaretDown />
                <button
                    disabled = { searchQuery.length === 0 }
                    type="submit"
                >
                    <FaSearch />
                </button>
            </div>


    </form>
    )
}


export default TopHeaderExplore;
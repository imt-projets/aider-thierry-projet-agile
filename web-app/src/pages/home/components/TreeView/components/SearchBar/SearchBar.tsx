import { FaSearch } from "react-icons/fa";

export const SearchBar = () => {
    return (
        <div className="search__container">
            <div className="component">
                <div className="logo">
                    <FaSearch color="rgba(115, 115, 115, 1)"/>
                </div>
                <input 
                    type="text"
                    placeholder="Rechercher"
                />
            </div>
        </div>
    );
};
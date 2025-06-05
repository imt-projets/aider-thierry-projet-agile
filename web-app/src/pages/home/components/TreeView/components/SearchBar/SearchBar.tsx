import type { ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
    onChanges: (value: string) => void
}

export const SearchBar = ({onChanges} : SearchBarProps) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChanges(event.target.value)
    }
    

    return (
        <div className="search__container">
            <div className="component">
                <div className="logo">
                    <FaSearch color="rgba(115, 115, 115, 1)"/>
                </div>
                <input 
                    type="text"
                    placeholder="Rechercher"
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};
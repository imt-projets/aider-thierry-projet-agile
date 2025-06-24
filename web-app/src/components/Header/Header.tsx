import { Link, useLocation } from "react-router-dom";
import { IconButton } from "../IconButton";
import type { IconType } from "react-icons";
import { FiHome, FiBox } from "react-icons/fi";
import { MdInventory } from "react-icons/md";
import { motion } from "motion/react";


export const Header = () => {
    const location = useLocation();
    
    const renderNav = () => {
        return NAVIGATION.map((navLink, index) => {
            const isActive = location.pathname === navLink.path;
            return (
                <li key={index} className="nav-link-wrapper">
                    <Link className="nav-item" to={navLink.path}>
                        <IconButton>
                            <navLink.icon />
                            {navLink.text}
                        </IconButton>
                        {isActive && (
                            <motion.div
                                layoutId="nav-underline"
                                className="nav-underline"
                                transition={{ type: "spring", stiffness: 600, damping: 30 }}
                            />
                        )}
                    </Link>
                </li>
            )
        });
    }

    return (
        <div className="navigation--drawer">
            <div className="logo-header">
                <img 
                    src="./logo-imt-white.png" 
                    alt="Logo imt" 
                    className="imt-logo"
                />
            </div>
            <ul>
                {renderNav()}
            </ul>
        </div>
    )

}

interface NavigationItem {
    path : string;
    icon : IconType;
    text: string;
}

const NAVIGATION: NavigationItem[] = [
    {
        path: '/',
        icon: FiHome,
        text: 'Accueil'
    },
    {
        path: '/items',
        icon: FiBox,
        text: "Objets"
    },
    {
        path: '/inventory-confirmation',
        icon: MdInventory,
        text: "Inventaires"
    }
];
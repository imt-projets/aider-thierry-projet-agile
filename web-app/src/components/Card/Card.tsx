import type { JSX } from "react";

interface CardProps {
    title?: string;
    subTitle?: string;
    children: JSX.Element | JSX.Element[]
};

export const Card = ({ children, title, subTitle } : CardProps) => {

    return (
        <div className="card">
            {(title || subTitle) && (
                <div className="card-header">
                    {title && <div className="card-title">{title}</div>}
                    {subTitle && <div className="card-subtitle">{subTitle}</div>}
                </div>
            )}
            {children}
        </div>
    )
}
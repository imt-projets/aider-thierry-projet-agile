import React, { type DetailedHTMLProps, forwardRef } from "react";

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>((props,ref) => {
    const { className = "", ...rest } = props;
    return (
        <button {...rest} ref={ref} className={`icon-button${className ? ` ${className}` : ""}`}>
            {props.children}
        </button>
    )
})

type ButtonProps = DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>, 
    HTMLButtonElement
>
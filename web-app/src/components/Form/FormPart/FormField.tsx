import type { JSX } from "@emotion/react/jsx-runtime"
import type { ChangeEvent } from "react"

interface FormFieldProps {
    name : string
    value : string
    index?: number
    onChange : (name : string, value : string, key?: number) => void
    placeholder?: string
    label? : string
    widget? : JSX.Element
    type? : string
    readonly? : boolean
}

export const FormField = ({
    name,
    onChange,
    value,
    placeholder,
    label,
    index,
    type,
    widget,
    readonly
} : FormFieldProps) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (index == null) onChange(name,event.target.value)
        else onChange(name,event.target.value,index)
    }

    return (
        <div className="form-field">
            {label ? <p className="label">{label}</p> : null}
            <div className="input-container">
                <input 
                    type={type ? type : "text"} 
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    readOnly={readonly}
                />
                {!!widget && 
                    <div className="widget">
                        {widget}
                    </div>}
            </div>
        </div>
    )
}
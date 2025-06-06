import type { ChangeEvent } from "react";

interface FormTextAreaProps {
    name: string
    label?: string
    value: string
    onChange: (name: string, value: string) => void
    placeholder?: string,
    readonly?: boolean
}

export const FormTextArea = ({ name, placeholder, value, label, readonly, onChange } : FormTextAreaProps) => {

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => onChange(name, event.target.value);

    return (
        <div className="form-field">
            {label ? <p className="label">{label}</p> : null}
            <textarea
                name={name}
                className='form-field textarea'
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                readOnly={readonly}
            />
        </div>
    );
}
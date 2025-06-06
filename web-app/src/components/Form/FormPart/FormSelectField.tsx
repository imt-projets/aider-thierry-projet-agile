import type { ChangeEvent } from "react"

interface OptionsProps {
    value : string
    child: string
}

interface FormSelectFieldProps {
    name: string,
    label?: string
    options: OptionsProps[],
    value: string
    onChange: (name: string, value: string) => void
    disabled?: boolean
}

export const FormSelectField = ({ name, onChange, options, value, disabled, label} : FormSelectFieldProps) => {

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => onChange(name, event.target.value);
    
    const renderOptions = () => {
        return options.map((option, id) => 
            <option key={id} value={option.value}>
                {option.child}
            </option>
        )
    }

    return (
        <div className="form-field">
            {label ? <p className="label">{label}</p> : null}
            <select 
                name={name}
                value={value}
                disabled={disabled}
                onChange={handleChange}
            >
                {renderOptions()}
            </select>
        </div>
    )
}
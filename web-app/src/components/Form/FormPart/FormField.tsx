import type { JSX } from "@emotion/react/jsx-runtime"
import { useEffect, useState, type ChangeEvent } from "react"

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
    required? : boolean

    validationRegex?: RegExp;
    errorMessage?: string;
    onValidationChange?: (hasError: boolean) => void;
}


const defaultValidations: Record<string, { regex: RegExp; message: string }> = {
    price: { regex: /^\d+(\.\d{1,2})?$/, message: "Prix invalide. Format attendu : nombre ou décimal (ex: 99.99)" },
    nb_occurance: { regex: /^\d+$/, message: "Veuillez entrer un entier positif" },
    serialNumber: { regex: /^[\w-]*$/, message: "Caractères non valides dans le numéro de série" },
    inventoryNumber: { regex: /^\d+$/, message: "Le numéro d'inventaire doit être un entier positif" }
};

export const FormField = ({
    name,
    onChange,
    value,
    placeholder,
    label,
    index,
    type,
    widget,
    readonly,
    validationRegex,
    errorMessage,
    required,
    onValidationChange
} : FormFieldProps) => {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const isEmpty = required && value.trim() === '';

        if (isEmpty) {
            setError("Ce champ est requis.");
            onValidationChange?.(true);
            return;
        }

        const validation = validationRegex
            ? { regex: validationRegex, message: errorMessage || "Format invalide" }
            : defaultValidations[name];

        if (validation && !validation.regex.test(value)) {
            setError(validation.message);
            onValidationChange?.(true);
        } else {
            setError(null);
            onValidationChange?.(false);
        }
    }, [value, validationRegex, errorMessage, name, required]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (index == null) onChange(name, newValue);
        else onChange(name, newValue, index);
    }

    return (
        <div className="form-field">
            {label && (
                <p className="label">
                    {label}
                    {required && <span className="required-star">*</span>}
                </p>
            )}
            <div className="input-container">
                <input 
                    type={type ? type : "text"} 
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    readOnly={readonly}
                    className={`input${error ? ' input-error' : ''}`}
                />
                {!!widget && 
                    <div className="widget">
                        {widget}
                    </div>}
            </div>
            {error && <p className="error-text">{error}</p>}
        </div>
    )
}
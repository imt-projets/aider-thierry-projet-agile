interface ChipProps {
    text: string;
    color: string;
    textColor: string;
}

export const Chip = ({ text, color, textColor }: ChipProps) => {
    return (
        <div className="chip--container"> 
            <div className="chip"
                style={{
                    backgroundColor: color,
                    color: textColor
                }}
            >
                <span>{text}</span>
            </div>
        </div>
    )
}
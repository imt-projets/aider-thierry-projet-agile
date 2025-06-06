interface StatisticsModalProps {
    color: string;
    title: string;
    value: string;
}

export const StatisticsModal = ({ title, value, color } : StatisticsModalProps) => {

    return (
        <div className="statistics-modal">
            <div className="container">
                <div className="header">
                    <div className="chip" style={{backgroundColor: color}}/>
                    <p>{title}</p>
                </div>
                <div className="content">
                    {value}
                </div>
            </div>
        </div>
    )
}
import { ClipLoader } from "react-spinners";

export const Loader = () => (
    <div className="loader--container">
        <ClipLoader size={20} color="#333" />
        <span style={{ marginLeft: 8 }}>Chargement...</span>
    </div>
);

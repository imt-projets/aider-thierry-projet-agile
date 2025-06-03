import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useAppContext } from "@/context/AppContext";
import { FaPen, FaSave } from "react-icons/fa";
import { Object } from "../../../../components/Icons/Object"
import type { ItemDTO } from "@/dto";

export const ObjectView = () => {
    const { selectedElement, isLoading, error } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<ItemDTO | null>(selectedElement);


    useEffect(() => {
        setForm(selectedElement);
    }, [selectedElement]);

    const formatDateForInput = (dateString: string | undefined): string => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
        } catch (error) {
            console.error("Invalid date format:", error);
            return '';
        }
    };

    if (error) {
        return (
            <div style={{ padding: 32, textAlign: 'center', color: 'red', fontSize: 22 }}>
                {error}
            </div>
        );
    }

    if (!selectedElement) {
        return (
            <div style={{ padding: 32, textAlign: 'center', color: '#888', fontSize: 22 }}>
                Aucun objet sélectionné. Veuillez sélectionner un objet pour afficher ses détails.
            </div>
        );
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!form) return;
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = () => setIsEditing(true);
    const handleSave = () => {
        setIsEditing(false);
        // TODO: Save the form
    };

    return (
        <div className="object-view-container">
            {/* Header */}
            <div className="object-view-header">
                <div className="object-view-header-left">
                    <Object style={{ width: 28, height: 28, verticalAlign: "middle" }} />
                </div>
                <div className="object-view-header-actions">
                    <button
                        className="object-view-btn"
                        onClick={handleEdit}
                        disabled={isEditing}
                    >
                        <FaPen style={{ fontSize: 18 }} />
                        MODIFIER
                    </button>
                    <button
                        className="object-view-btn save"
                        onClick={handleSave}
                        disabled={!isEditing}
                    >
                        <FaSave style={{ fontSize: 18 }} />
                        SAUVEGARDER
                    </button>
                </div>
            </div>

            <h2 className="object-view-title">TITRE CATEGORIE</h2>
            <div className="object-view-row">
                <div className="object-view-col">
                    <label className="object-view-label">Numéro d’inventaire</label>
                    <input className="object-view-input" name="inventoryNumber" value={form?.inventoryNumber || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div className="object-view-col">
                    <label className="object-view-label">Nom de l'objet</label>
                    <input className="object-view-input" name="name" value={form?.name || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div className="object-view-col">
                    <label className="object-view-label">Type d'objet</label>
                    {/* <select className="object-view-select" name="type" value={form?.type || ''} onChange={handleChange} disabled={!isEditing}>
                        <option value="">Champs</option>
                        <option value="Ordinateur">Ordinateur</option>
                        <option value="Écran">Écran</option>
                        <option value="Accessoire">Accessoire</option>
                    </select> */}
                </div>
            </div>

            <div className="object-view-row mb-32">
                <div className="object-view-col">
                    <label className="object-view-label">Marque</label>
                    <input className="object-view-input" name="brand" value={form?.brand || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div className="object-view-col">
                    <label className="object-view-label">Modèle</label>
                    <input className="object-view-input" name="model" value={form?.model || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div className="object-view-col">
                    {/* <label className="object-view-label">État de l'objet</label> */}
                    {/* <select className="object-view-select" name="state" value={form?.state || ''} onChange={handleChange} disabled={!isEditing}>
                        <option value="">Champs</option>
                        <option value="Neuf">Neuf</option>
                        <option value="Utilisé">Utilisé</option>
                        <option value="HS">HS</option>
                    </select> */}
                </div>
            </div>

            <h2 className="object-view-title">TITRE CATEGORIE</h2>
            <div className="object-view-row">
                <div className="object-view-col">
                    {/* <label className="object-view-label">Salle</label> */}
                    {/* <input className="object-view-input" name="room" value={form?.room || ''} onChange={handleChange} readOnly={!isEditing} /> */}
                </div>
                <div className="object-view-col">
                    {/* <label className="object-view-label">Fournisseur</label> */}
                    {/* <input className="object-view-input" name="supplier" value={form?.supplier || ''} onChange={handleChange} readOnly={!isEditing} /> */}
                </div>
            </div>
            <div style={{ marginBottom: 32 }}>
                <label className="object-view-label">Description</label>
                <textarea
                    className="object-view-textarea"
                    name="description"
                    value={form?.description || ''}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
            </div>

            <h2 className="object-view-title">TITRE CATEGORIE</h2>
            <div className="object-view-row">
                <div className="object-view-col">
                    <label className="object-view-label">Date de fin de garantie</label>
                    <input type="date" className="object-view-input" name="warrantyEndDate" value={formatDateForInput(form?.warrantyEndDate || '')} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div className="object-view-col">
                    <label className="object-view-label">Date de fin de vie</label>
                    <input type="date" className="object-view-input" name="endOfLifeDate" value={formatDateForInput(form?.endOfLifeDate || '')} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div className="object-view-col">
                    <label className="object-view-label">Prix</label>
                    <input className="object-view-input" name="price" value={(form?.price || '0')+ " €"} onChange={handleChange} readOnly={!isEditing} />
                </div>
            </div>
        </div>
    );
};

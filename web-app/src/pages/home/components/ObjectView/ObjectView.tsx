import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useAppContext } from "@/context/AppContext";
import { FaPen, FaSave } from "react-icons/fa";
import { Object } from "../../../../components/Icons/Object"
export const ObjectView = () => {
    const { selectedElement, isLoading, error } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<any>(selectedElement);

    useEffect(() => {
        setForm(selectedElement);
    }, [selectedElement]);

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
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = () => setIsEditing(true);
    const handleSave = () => {
        setIsEditing(false);
        // TODO: Save the form
    };

    const inputStyle = {
        width: '100%',
        border: '1px solid #333',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 16
    };

    const labelStyle = { fontWeight: 500, marginBottom: 4, display: 'block' };

    return (
        <div style={{ padding: 32, background: '#fff', borderRadius: 8, maxWidth: 1100, margin: '0 auto', overflow: 'scroll' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Object style={{ width: 28, height: 28, verticalAlign: "middle" }} />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                    <button
                        style={{
                            background: '#FF9800',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '10px 24px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            cursor: isEditing ? 'not-allowed' : 'pointer'
                        }}
                        onClick={handleEdit}
                        disabled={isEditing}
                    >
                        <FaPen style={{ fontSize: 18 }} />
                        MODIFIER
                    </button>

                    <button
                        style={{
                            background: '#2ECC40',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '10px 24px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            cursor: isEditing ? 'pointer' : 'not-allowed'
                        }}
                        onClick={handleSave}
                        disabled={!isEditing}
                    >
                        <FaSave style={{ fontSize: 18 }} />
                        SAUVEGARDER
                    </button>
                </div>
            </div>

            <h2 style={{ fontSize: 18, marginBottom: 16 }}>TITRE CATEGORIE</h2>
            <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Numéro d’inventaire</label>
                    <input style={inputStyle} name="inventoryNumber" value={form?.inventoryNumber || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Nom de l'objet</label>
                    <input style={inputStyle} name="name" value={form?.name || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Type d'objet</label>
                    <select style={inputStyle} name="type" value={form?.type || ''} onChange={handleChange} disabled={!isEditing}>
                        <option value="">Champs</option>
                        <option value="Ordinateur">Ordinateur</option>
                        <option value="Écran">Écran</option>
                        <option value="Accessoire">Accessoire</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Marque</label>
                    <input style={inputStyle} name="brand" value={form?.brand || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Modèle</label>
                    <input style={inputStyle} name="model" value={form?.model || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>État de l'objet</label>
                    <select style={inputStyle} name="state" value={form?.state || ''} onChange={handleChange} disabled={!isEditing}>
                        <option value="">Champs</option>
                        <option value="Neuf">Neuf</option>
                        <option value="Utilisé">Utilisé</option>
                        <option value="HS">HS</option>
                    </select>
                </div>
            </div>

            <h2 style={{ fontSize: 18, marginBottom: 16 }}>TITRE CATEGORIE</h2>
            <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Salle</label>
                    <input style={inputStyle} name="room" value={form?.room || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Fournisseur</label>
                    <input style={inputStyle} name="supplier" value={form?.supplier || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
            </div>
            <div style={{ marginBottom: 32 }}>
                <label style={labelStyle}>Description</label>
                <textarea
                    style={{ ...inputStyle, minHeight: 100 }}
                    name="description"
                    value={form?.description || ''}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
            </div>

            <h2 style={{ fontSize: 18, marginBottom: 16 }}>TITRE CATEGORIE</h2>
            <div style={{ display: 'flex', gap: 24 }}>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Date de fin de garantie</label>
                    <input type="date" style={inputStyle} name="warrantyEndDate" value={form?.warrantyEndDate || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Date de fin de vie</label>
                    <input type="date" style={inputStyle} name="endOfLifeDate" value={form?.endOfLifeDate || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Prix</label>
                    <input style={inputStyle} name="price" value={form?.price || ''} onChange={handleChange} readOnly={!isEditing} />
                </div>
            </div>
        </div>
    );
};

import { useState, useEffect, useContext } from "react";
import { FaPen, FaSave } from "react-icons/fa";
import type { ItemDTO } from "@/dto";
import SelectionContext from "../../../../context/SelectionContext";
import { FormField, FormTextArea, Item } from "@/components";

export const ObjectForm = () => {
    const { selectedItem, error } = useContext(SelectionContext);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<ItemDTO | null>(selectedItem);

    useEffect(() => {
        setForm(selectedItem);
    }, [selectedItem]);

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

    if (!selectedItem) {
        return (
            <div style={{ padding: 32, textAlign: 'center', color: '#888', fontSize: 22 }}>
                Aucun objet sélectionné. Veuillez sélectionner un objet pour afficher ses détails.
            </div>
        );
    }

    const handleChangesForm = (name: string, value: string) => {
        if (!form) return;
        setForm({ 
            ...form, 
            [name]:value
        });
    };

    const handleEdit = () => setIsEditing(true);
    const handleSave = () => {
        setIsEditing(false);
        // TODO: Save the form
    };

    return (
        <div className="object-view-container">
            <div className="object-view-header">
                <div className="object-view-header-left">
                    <Item style={{ width: 28, height: 28, verticalAlign: "middle" }} />
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


            <div className="object--row">
                <div className="title">
                    <p className="object-view-title">Résumé de l'objet</p>
                </div>
                <div className="content">
                    <FormField
                        label="Numéro d'inventaire"
                        name="inventoryNumber"
                        onChange={handleChangesForm}
                        readonly={!isEditing} 
                        value={form?.inventoryNumber || ''} 
                    />
                    <FormField
                        label="Nom de l'objet"
                        name="name"
                        value={form?.name || ''}
                        onChange={handleChangesForm} 
                        readonly={!isEditing}
                    />
                </div>
            </div>

            <div className="object--row">
                <div className="title">
                    <p className="object-view-title">Résumé de l'objet</p>
                </div>
                <div className="content">
                    <FormField
                        label="Marque"
                        name="brand"
                        value={form?.brand || ''}
                        onChange={handleChangesForm}
                        readonly={!isEditing}
                    />
                    <FormField
                        label="Modèle"
                        name="model"
                        value={form?.model || ''}
                        onChange={handleChangesForm}
                        readonly={!isEditing}
                    />
                </div>

                <div className="content" id="object-description">
                    <FormTextArea
                        label="Description"
                        name="description"
                        value={form?.description || ''}
                        readonly={!isEditing}
                        onChange={handleChangesForm}
                    />
                </div>
            </div>
    

            <div className="object--row">
                <div className="title">
                    <p className="object-view-title">Résumé de l'objet</p>
                </div>
                <div className="content">
                    <FormField
                        label="Date de fin de garantie"
                        name="warrantyEndDate"
                        value={formatDateForInput(form?.warrantyEndDate || '')}
                        onChange={handleChangesForm}
                        readonly={!isEditing}
                        type="date"
                    />
                    <FormField
                        label="Date de fin de vie"
                        name="endOfLifeDate"
                        value={formatDateForInput(form?.endOfLifeDate || '')}
                        onChange={handleChangesForm}
                        readonly={!isEditing}
                        type="date"
                    />
                    {/* TODO: FIX */}
                    <FormField
                        label="Prix"
                        name="price"
                        value={(form?.price || '0') + " €"}
                        onChange={handleChangesForm}
                        readonly={!isEditing}
                    />
                </div>
            </div>
        </div>
    );
};

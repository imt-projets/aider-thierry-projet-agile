import { useState, useEffect, useContext } from "react";
import { FaPen, FaSave } from "react-icons/fa";
import type { ItemDTO } from "@/dto";
import SelectionContext from "../../../../context/SelectionContext";
import { Card, FormField, FormSelectField, FormTextArea, IconButton, Item } from "@/components";
import { RequestHelper } from "@/api";

interface ObjectFormProps {
    reloadHierarchy: () => Promise<void>
}

export const ObjectForm = ({ reloadHierarchy } : ObjectFormProps) => {
    const { selectedItem, error } = useContext(SelectionContext);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<ItemDTO | null>(selectedItem);


    const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
    const [hasErrors, setHasErrors] = useState(false);

    useEffect(() => {
        setHasErrors(Object.values(fieldErrors).some(Boolean));
    }, [fieldErrors]);

    useEffect(() => {
        setForm(selectedItem);
        setIsEditing(false);
        setFieldErrors({});
        setHasErrors(false);
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

    const isFormModified = () => {
        if (!form || !selectedItem) return false;
        return JSON.stringify(form) !== JSON.stringify(selectedItem);
    };

    const handleChangesForm = (name: string, value: string) => {
        if (!form) return;
        setForm({ 
            ...form, 
            [name]:value
        });
    };

    const handleEdit = () => setIsEditing(true);
    const handleSave = async () => {
        setIsEditing(false);
        const response = await RequestHelper.put(`/item`, form)

        if (response.ok){
            await reloadHierarchy();
        };
    };

    return (
        <div className="object-view-container">
            <div className="object-view-header">
                <div className="object-view-header-left">
                    <Item style={{ width: 28, height: 28, verticalAlign: "middle" }} />
                </div>
                <div className="object-view-header-actions">
                     {isEditing ? (
                        <>
                            <IconButton
                                className="btn btn-cancel"
                                onClick={() => {
                                    setIsEditing(false);
                                    setForm(selectedItem);
                                }}
                            >
                                <FaSave />
                                ANNULER
                            </IconButton>

                            <IconButton
                                className="btn btn-validate"
                                onClick={handleSave}
                                disabled={hasErrors || !isFormModified()}
                            >
                                <FaSave />
                                SAUVEGARDER
                            </IconButton>
                        </>
                        ) : (
                            <IconButton 
                                onClick={handleEdit}
                                className="btn btn-edit"
                            >
                                <FaPen />
                                MODIFIER
                            </IconButton>
                        )}
                </div>
            </div>


            <Card 
                title="Résumé de l'objet"
                subTitle="Informations sur l'objet"
            >
                <FormField
                        label="Numéro d'inventaire"
                        name="inventoryNumber"
                        onChange={handleChangesForm}
                        readonly={!isEditing}
                        required 
                        value={form?.inventoryNumber || ''}
                        onValidationChange={(hasError) => {
                            setFieldErrors(prev => ({ ...prev, inventoryNumber: hasError }));
                        }} 
                    />
                    <FormField
                        label="Nom de l'objet"
                        name="name"
                        value={form?.name || ''}
                        onChange={handleChangesForm} 
                        readonly={!isEditing}
                        required
                        onValidationChange={(hasError) => {
                            setFieldErrors(prev => ({ ...prev, name: hasError }));
                        }}
                    />
            </Card>

            <Card 
                title="Onglet Fournisseur" 
                subTitle="Informations relatives au fournisseur"
            >
                    <FormField
                        label="Marque"
                        name="brand"
                        value={form?.brand || ''}
                        onChange={handleChangesForm}
                        readonly={!isEditing}
                        required
                    />
                    <FormField
                        label="Modèle"
                        name="model"
                        value={form?.model || ''}
                        onChange={handleChangesForm}
                        readonly={!isEditing}
                        required
                    />

                    <FormField
                        label="Prix (en €)"
                        name="price"
                        value={form?.price.toString() || ''}
                        onChange={handleChangesForm}
                        readonly={!isEditing}
                        required
                        onValidationChange={(hasError) => {
                            setFieldErrors(prev => ({ ...prev, price: hasError }));
                        }}
                    />

                    <FormSelectField
                        label="État de l'objet"
                        value={form?.state || ''}
                        onChange={handleChangesForm}
                        name="state"
                        disabled={!isEditing}
                        options={
                            [
                                {value:"Neuf",child: "Neuf"},
                                {value:"Bon",child: "Bon"},
                                {value:"Moyen",child: "Moyen"},
                                {value:"En attente de destruction", child: "En attente de destruction"},
                                {value: "Détruit", child: "Détruit"}
                            ]
                        }
                    />

                    <FormTextArea
                        name="description"
                        onChange={handleChangesForm}
                        value={form?.description || ''}
                        readonly={!isEditing}
                    />
            </Card>

            <Card 
                title="Garantie & Fin de Vie"
                subTitle="Informations relatives à la durée de vie de l'objet"
            >
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
            </Card>
        </div>
    );
};

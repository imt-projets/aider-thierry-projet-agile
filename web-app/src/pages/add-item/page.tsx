import { FormField, FormSelectField, FormTextArea, IconButton } from "@/components";
import PageLayout from "@/layouts/PageLayout"
import { Link } from "react-router-dom";
import { GiConfirmed } from "react-icons/gi";
import { MdCancel } from "react-icons/md";
import { useState } from "react";
import { ItemFormSchema, type ItemFormValues} from "@/types";

const defaultItem : ItemFormValues["item"] = {
    brand: '',
    description: '',
    endOfLifeDate: new Date().toISOString().replace('T', ' ').slice(0, 23),
    inventoryNumber: '',
    model: '',
    name: '',
    orderNumber : '',
    price: 0,
    serialNumber: '',
    state: "NEUF",
    warrantyEndDate: new Date().toISOString().replace('T', ' ').slice(0, 23)
};

const defaultProperties : ItemFormValues["properties"] = {
    nb_occurance: 1
};

const defaultForm : ItemFormValues = {
    properties: defaultProperties,
    item: defaultItem
}

const AddItem = () => {

    const [form, setForm] = useState<ItemFormValues>(defaultForm);

    const formatDateForInput = (dateString: string | undefined): string => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error("Invalid date format:", error);
            return '';
        }
    };

    const handleChangeItem = (name: string, value: string | number) => {
        setForm(prev => ({
            ...prev,
            item: {
                ...prev.item,
                [name]: value
            }
        }));
    };

    const handleSave = () => {
        console.log(form);
    }

    const handleChangeProperties = (name: string, value: string | number) => {
        setForm(prev => ({
            ...prev,
            properties: {
                ...prev.properties,
                [name]: value
            }
        }));
    };

    return (
        <PageLayout id="add-item">
            <div className="add-item--container">
                <div className="column" id="title">
                    <div className="column" id="sub-title">
                        <h1>Ajouter un objet</h1>
                        <p>TEXTE A RAJOUTER</p>
                    </div>
                     <div className="form">
                    <div className="column">
                        <h2>Propriété</h2>
                        <div className="row">
                            <FormField
                                label="Nombre d'occurrences de l'objet à créer"
                                name="nb_occurance"
                                onChange={handleChangeProperties}
                                value={form.properties.nb_occurance.toString()}
                            />
                        </div>
                    </div>

                    <div className="column">
                        <h2>Identité de l'objet</h2>
                        <div className="row" id="object-identity">
                            <FormField
                                label="Numéro d'inventaire"
                                name="inventoryNumber"
                                onChange={handleChangeItem}
                                value={form.item.inventoryNumber}
                            />
                            <FormField
                                label="Nom de l'objet"
                                name="name"
                                onChange={handleChangeItem}
                                value={form.item.name}
                            />
                        </div>
                    </div>

                    <div className="column">
                        <h2>Partie Fournisseur</h2>
                        <div className="row">
                            <FormField
                                label="Marque"
                                name="brand"
                                value={form.item.brand}
                                onChange={handleChangeItem}
                            />
                            <FormField
                                label="Modèle"
                                name="model"
                                value={form.item.model}
                                onChange={handleChangeItem}
                            />
                            <FormSelectField
                                label="État de l'objet"
                                value={form.item.state}
                                onChange={handleChangeItem}
                                name="state"
                                options={
                                    [
                                        {value:"",child: "Champs"},
                                        {value:"Neuf",child: "Neuf"},
                                        {value:"Bon",child: "Bon"},
                                        {value:"Moyen",child: "Moyen"},
                                        {value:"En attente de destruction", child: "En attente de destruction"},
                                        {value: "Détruit", child: "Détruit"}
                                    ]
                                }
                            />
                        </div>
        
                        <div className="row" id="object-description">
                            <FormTextArea
                                label="Description"
                                name="description"
                                value={form.item.description}
                                onChange={handleChangeItem}
                            />
                        </div>

                        <div className="row">

                            <FormField
                                label="Date de fin de garantie"
                                name="warrantyEndDate"
                                value={formatDateForInput(form.item.warrantyEndDate)}
                                onChange={handleChangeItem}
                                type="date"
                            />
                            <FormField
                                label="Date de fin de vie"
                                name="endOfLifeDate"
                                value={formatDateForInput(form.item.endOfLifeDate)}
                                onChange={handleChangeItem}
                                type="date"
                            />

                            <FormField
                                label="Prix"
                                name="price"
                                value={form.item.price + " €"}
                                onChange={handleChangeItem}
                            />
                        </div>        
                    </div>

                </div>
                </div>

                <div className="row">
                    <div className="actions">
                        <Link to="/items">
                            <IconButton id="cancel">
                                <MdCancel/>
                                ANNULER
                            </IconButton>
                        </Link>

                        <Link to="/">
                            <IconButton onClick={handleSave} id="add">
                                <GiConfirmed />
                                VALIDER
                            </IconButton>
                        </Link>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default AddItem;
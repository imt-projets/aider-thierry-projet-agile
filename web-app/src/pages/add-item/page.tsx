import { FormField, FormSelectField, FormTextArea, IconButton } from "@/components";
import PageLayout from "@/layouts/PageLayout"
import { Link } from "react-router-dom";
import { GiConfirmed } from "react-icons/gi";
import { MdCancel } from "react-icons/md";
// import { useState } from "react";

// interface ItemToAddForm {
//     item : {

//     }
// }

const AddItem = () => {

    // const [form, setForm] = useState();

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
                                name="inventoryNumber"
                                onChange={() => {}}
                                value=""
                            />
                        </div>
                    </div>

                    <div className="column">
                        <h2>Identité de l'objet</h2>
                        <div className="row" id="object-identity">
                            <FormField
                                label="Numéro d'inventaire"
                                name="inventoryNumber"
                                onChange={() => {}}
                                value=""
                            />
                            <FormField
                                label="Nom de l'objet"
                                name="inventoryNumber"
                                onChange={() => {}}
                                value=""
                            />
                        </div>
                    </div>

                    <div className="column">
                        <h2>Partie Fournisseur</h2>
                        <div className="row">
                            <FormField
                                label="Marque"
                                name="brand"
                                value={''}
                                onChange={() => {}}
                            />
                            <FormField
                                label="Modèle"
                                name="model"
                                value={''}
                                onChange={() => {}}
                            />
                            <FormSelectField
                                label="État de l'objet"
                                value={''}
                                onChange={() => {}}
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
                                value={''}
                                onChange={() => {}}
                            />
                        </div>

                        <div className="row">

                            <FormField
                                label="Date de fin de garantie"
                                name="warrantyEndDate"
                                value={formatDateForInput('')}
                                onChange={() => {}}
                                type="date"
                            />
                            <FormField
                                label="Date de fin de vie"
                                name="endOfLifeDate"
                                value={formatDateForInput('')}
                                onChange={() => {}}
                                type="date"
                            />

                            <FormField
                                label="Prix"
                                name="price"
                                value={('0') + " €"}
                                onChange={() => {}}
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
                            <IconButton id="add">
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
import { Card, FormField, FormSelectField, FormTextArea, IconButton } from "@/components";
import PageLayout from "@/layouts/PageLayout"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ItemFormSchema, type ItemFormValues} from "@/types";
import { RequestHelper } from "@/api";

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
    state: "Neuf",
    warrantyEndDate: new Date().toISOString().replace('T', ' ').slice(0, 23)
};

const defaultProperties : ItemFormValues["properties"] = {
    nb_occurance: 1
};

const defaultForm : ItemFormValues = {
    properties: defaultProperties,
    item: defaultItem
}

const numberFields = ["price"];
const numberPropertiesFields = ["nb_occurance"];

const AddItem = () => {

    const [form, setForm] = useState<ItemFormValues>(defaultForm);
    const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
    const [hasErrors, setHasErrors] = useState(false);

    useEffect(() => {
        setHasErrors(Object.values(fieldErrors).some(Boolean));
    }, [fieldErrors]);


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

    const handleSave = async () => {
        const parsedItem = ItemFormSchema.safeParse(form);
        if (parsedItem.success) {
            await RequestHelper.post('/item', form);
        }
        // TODO : Handle error
    }

    const handleChangeItem = (name: string, value: string | number) => {
        let finalValue: string | number = value;

        if (numberFields.includes(name)) {
            if (/^\d*$/.test(String(value))) {
                finalValue = value === '' ? '' : Number(value);
            } else {
                finalValue = value;
            }
        }

        setForm(prev => ({
            ...prev,
            item: {
                ...prev.item,
                [name]: finalValue
            }
        }));
    };

    const handleChangeProperties = (name: string, value: string | number) => {
        let finalValue: string | number = value;

        if (numberPropertiesFields.includes(name)) {
            if (/^\d*$/.test(String(value))) {
                finalValue = value === '' ? '' : Number(value);
            } else {
                finalValue = value;
            }
        }

        setForm(prev => ({
            ...prev,
            properties: {
                ...prev.properties,
                [name]: finalValue
            }
        }));
    };

    return (
        <PageLayout id="add-item">
            <div className="add-item--container">
                <div className="column" id="title">
                    <div className="column" id="sub-title">
                        <h1>Ajouter un objet</h1>
                        <p>Processus d'ajout d'un objet, vous pouvez créer plusieurs objets simultanément</p>
                    </div>
                </div>
                <div className="form">
                    <Card title="Propriétés" subTitle="Cette rubrique concerne les paramètres globaux de votre création (nombre d'objets, ...)">
                        <div className="row">
                            <FormField
                                label="Nombre d'occurrences de l'objet à créer"
                                name="nb_occurance"
                                onChange={handleChangeProperties}
                                value={form.properties.nb_occurance.toString()}
                                onValidationChange={(hasError) => {
                                    setFieldErrors(prev => ({ ...prev, nb_occurance: hasError }));
                                }}
                            />
                        </div>
                    </Card>
                
                    <Card
                        title="Identité de l'objet"
                        subTitle="Renseignez les informations principales de l'objet à ajouter"
                    >
                        <div className="row" id="object-identity">
                            <FormField
                                label="Numéro d'inventaire"
                                name="inventoryNumber"
                                onChange={handleChangeItem}
                                value={form.item.inventoryNumber}
                                required
                                onValidationChange={(hasError) => {
                                    setFieldErrors(prev => ({ ...prev, inventoryNumber: hasError }));
                                }}
                            />
                            <FormField
                                label="Nom de l'objet"
                                name="name"
                                placeholder="Par exemple Table, ..."
                                onChange={handleChangeItem}
                                value={form.item.name}
                                required
                                onValidationChange={(hasError) => {
                                    setFieldErrors(prev => ({ ...prev, name: hasError }));
                                }}
                            />
                        </div>
                    </Card>

                    <Card
                        title="Partie Fournisseur"
                        subTitle="Les informations relatives au fournisseur ainsi que les détails sur l'objet"
                    >
                        <div className="row">
                            <FormField
                                label="Marque"
                                name="brand"
                                placeholder="Par exemple Dell, ..."
                                value={form.item.brand}
                                onChange={handleChangeItem}
                                required
                                onValidationChange={(hasError) => {
                                    setFieldErrors(prev => ({ ...prev, brand: hasError }));
                                }}
                            />
                            <FormField
                                label="Modèle"
                                name="model"
                                value={form.item.model}
                                onChange={handleChangeItem}
                                required
                                onValidationChange={(hasError) => {
                                    setFieldErrors(prev => ({ ...prev, model: hasError }));
                                }}
                            />

                            <div className="row">
                                <FormField
                                    label="Prix (en €)"
                                    name="price"
                                    value={form.item.price.toString()}
                                    onChange={handleChangeItem}
                                    onValidationChange={(hasError) => {
                                        setFieldErrors(prev => ({ ...prev, price: hasError }));
                                    }}
                                />
                            </div>
                            <FormSelectField
                                label="État de l'objet"
                                value={form.item.state}
                                onChange={handleChangeItem}
                                name="state"
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
                        </div>


                        <div className="row" id="object-description">
                            <FormTextArea
                                label="Description"
                                name="description"
                                value={form.item.description}
                                onChange={handleChangeItem}
                                placeholder="Vous pouvez ajouter une petite description pour décrire l'objet"
                            />
                        </div>
                    </Card>
                    
                    <Card title="Garantie">
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
                        </div>
                    </Card>
                </div>

                <div className="actions">
                    <Link to="/items">
                        <IconButton className="btn btn-cancel">
                            Annuler
                        </IconButton>
                    </Link>

                    <Link
                        to={hasErrors ? "#" : "/"}
                        className={hasErrors ? "disabled-link" : ""}
                    >
                        <IconButton onClick={handleSave} className="btn btn-validate" disabled={hasErrors}>
                            Valider
                        </IconButton>
                    </Link>
                </div>
            </div>
        </PageLayout>
    )
}

export default AddItem;
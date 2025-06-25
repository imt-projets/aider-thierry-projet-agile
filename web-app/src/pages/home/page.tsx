import { TreeView } from "@/pages/home/components/TreeView";
import {  useContext } from "react";
import { ObjectDetails, ObjectTabs, ObjectForm } from "./components";
import SelectionContext from "@/context/SelectionContext";
import PageLayout from "@/layouts/PageLayout";

const Home = () => {
    const { selectedItem } = useContext(SelectionContext);
    
    return (
        <PageLayout id="home">
            <div className="container--inventory-view">
                <TreeView/>
            </div>

            <div className="container--object-view">
                {selectedItem ? (
                    <>
                        <div className="container--form-view">
                            <div className="container--left">
                                <ObjectTabs />
                                <ObjectForm />
                            </div>
                            <div className="container--right">
                                <ObjectDetails />
                            </div>
                        </div>
                    </>
                ) : 
                    <div className="default--view">
                        <div className="container-logos">
                            <img 
                                src="./logo-barcode.png" 
                                alt="Logo Barcode" 
                                className="barcode-logo"
                            />
                            {/* <img 
                                src="./logo-imt.png" 
                                alt="Logo imt" 
                                className="imt-logo"
                            /> */}
                        </div>
                        <h2>Bienvenue sur IMT'ventaire!</h2>
                        <p>Pour afficher les détails d'un objet, sélectionnez-le dans la hiérarchie</p>
                    </div>
                }
            </div>
        </PageLayout>
    )
}

export default Home;
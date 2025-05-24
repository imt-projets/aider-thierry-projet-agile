import { useFetch } from "@/hooks";
import { useEffect } from "react";

const Home = () => {

    const hierarchy = useFetch('/hierarchy', [])

    useEffect(() => {
        if (hierarchy.data) {
            console.log("Hierarchy data fetched:", hierarchy.data);
        }
    }, [hierarchy.data]);

    return (
        <section className="home-section-bg">
            <div id="home-page">
                <h1>This is the Home Page!</h1>
            </div>
        </section>
    )
}

export default Home;
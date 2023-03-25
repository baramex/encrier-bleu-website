import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import { LabelledSwitch } from "../Misc/Switch";

export default function Home(props) {
    return (<>
        <Header {...props} />
        <section className="px-20 py-20 flex items-center flex-col gap-16">
            <h1 className="text-5xl font-medium text-white">Les dernières actualités</h1>
            <LabelledSwitch states={["Finance", "International"]} />
        </section>
        <Footer {...props} />
    </>)
}
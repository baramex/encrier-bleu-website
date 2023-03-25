import { useEffect, useState } from "react";
import { fetchData } from "../../lib/service";
import { getArticle, getArticles } from "../../lib/service/article";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import { LabelledSwitch } from "../Misc/Switch";
import noImage from "../../images/no-image.svg"
import { CalendarDaysIcon, MapPinIcon, PencilIcon, TagIcon } from "@heroicons/react/24/solid";
import { formatDate } from "../../lib/utils/date";
import { capitalize } from "../../lib/utils/string";
import Loading from "../Misc/Loading";
import { useHistory } from "react-router-dom";
import ArticleModal from "../Modals/Article";

export default function Home(props) {
    const [articles, setArticles] = useState(undefined);
    const [category, setCategory] = useState(Number(sessionStorage.getItem("articleCategory")) || 0);
    const [page, setPage] = useState(0);
    const [article, setArticle] = useState(undefined);

    const history = useHistory();
    const articleId = new URLSearchParams(history.location.search).get("article");

    useEffect(() => {
        setPage(0);
        sessionStorage.setItem("articleCategory", category);
        if (articles) setArticles(undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    useEffect(() => {
        if (articles) setArticles(undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        if (!articles) {
            fetchData(props.addAlert, setArticles, getArticles, true, page, category === 0 ? "business" : "-business");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articles]);

    useEffect(() => {
        if (articleId && article?._id !== articleId) {
            const article = articles?.find(a => a._id === articleId);
            if (article) {
                setArticle(article);
            }
            else {
                fetchData(props.addAlert, setArticle, getArticle, true, articleId);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articleId]);

    useEffect(() => {
        if (!article) history.push("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [article]);

    return (<>
        <ArticleModal article={article} onClose={setArticle} open={!!article} />

        <Header {...props} />
        <section className="px-20 py-20 h-80 w-full flex justify-center">
            <div className="z-0 fixed flex items-center gap-16 flex-col">
                <h1 className="text-5xl font-medium text-white">Les dernières actualités</h1>
                <LabelledSwitch state={category} setState={setCategory} states={["Finance", "International"]} />
            </div>
        </section>
        <section className="article-container backdrop-blur-md min-h-screen pb-16">
            <div className="grid mx-auto px-10 max-w-screen-2xl py-5 gap-4">
                {
                    articles ? articles?.map((article, i) => <Article key={i} article={article} onClick={() => { history.push("?article=" + article._id); setArticle(article) }} />) :
                        <div className="flex justify-center p-4"><Loading height="h-12" width="w-12" /></div>
                }
            </div>
        </section>
        <Footer {...props} />
    </>)
}

function Article({ article, ...props }) {
    return (
        <div role="button" className="grid grid-cols-4 gap-8 p-4 group" {...props}>
            <img className="rounded-xl aspect-[3/2] object-cover" src={article.image_url || noImage} alt={article.title} />
            <div className="flex flex-col gap-4 col-span-3">
                <h1 className="text-3xl font-medium text-white group-hover:underline">{article.title}</h1>
                <div className="flex gap-5">
                    <div className="flex items-center text-sm gap-1.5">
                        <CalendarDaysIcon className="w-5 text-gray-300" /><p className="text-gray-300">{formatDate(new Date(article.pubDate))}</p>
                    </div>
                    {article.creator?.length > 0 &&
                        <div className="flex items-center text-sm gap-1.5">
                            <PencilIcon className="w-5 text-gray-300" /><p className="text-gray-300">{article.creator[0]}</p>
                        </div>
                    }
                    {
                        article.country?.length > 0 &&
                        <div className="flex items-center text-sm gap-1.5">
                            <MapPinIcon className="w-5 text-gray-300" /><p className="text-gray-300">{capitalize(article.country[0])}</p>
                        </div>
                    }
                    <div className="flex items-center text-sm gap-1.5">
                        <TagIcon className="w-5 text-gray-300" /><p className="text-gray-300">{article.category.map(a => capitalize(a)).join(", ")}</p>
                    </div>
                </div>
                <p className="text-gray-400" dangerouslySetInnerHTML={{ __html: article.description }}></p>
            </div>
        </div>
    );
}
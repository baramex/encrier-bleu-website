import { useEffect, useRef, useState } from "react";
import { fetchData } from "../../lib/service";
import { getArticle, getArticles, getPageCount } from "../../lib/service/article";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import { LabelledSwitch } from "../Misc/Switch";
import noImage from "../../images/no-image.svg"
import { ArrowLongLeftIcon, ArrowLongRightIcon, CalendarDaysIcon, ChevronUpIcon, MapPinIcon, PencilIcon, TagIcon } from "@heroicons/react/24/solid";
import { formatDate } from "../../lib/utils/date";
import { capitalize } from "../../lib/utils/string";
import Loading from "../Misc/Loading";
import { useHistory } from "react-router-dom";
import ArticleModal from "../Modals/Article";
import clsx from "clsx";

export default function Home(props) {
    const history = useHistory();
    const query = new URLSearchParams(history.location.search);

    const upArrow = useRef();

    const [articles, setArticles] = useState(undefined);
    const [category, setCategory] = useState(Number(localStorage.getItem("articleCategory")) || 0);
    const [page, setPage] = useState(Math.max(Number(query.get("page")) || 0, 0));
    const [maxPage, setMaxPage] = useState(undefined);
    const [article, setArticle] = useState(false);
    const [articleId, setArticleId] = useState(query.get("article"));

    history.listen((location, action) => {
        const nquery = new URLSearchParams(location.search);
        if (nquery.get("article") !== articleId) setArticleId(nquery.get("article"));
        if (nquery.get("page") !== page) setPage(Math.max(Number(nquery.get("page")) || 0, 0));
    });

    // TO VERIFY: max page

    useEffect(() => {
        if (page > maxPage) {
            setPage(maxPage);
            setArticles(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxPage]);

    useEffect(() => {
        localStorage.setItem("articleCategory", category);
        if (articles) setArticles(undefined);
        fetchData(props.addAlert, v => setMaxPage(v - 1), getPageCount, true, category === 0 ? "business" : "-business");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    useEffect(() => {
        if (articles) setArticles(undefined);
        const query = new URLSearchParams(history.location.search);
        if (page !== 0 && Number(query.get("page")) !== page) {
            query.set("page", page);
            history.push("?" + query.toString());
        }
        if (page === 0 && query.get("page")) {
            const query = new URLSearchParams(history.location.search);
            query.delete("page", page);
            history.push("?" + query.toString());
        }
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
        else if (!articleId) {
            setArticle(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articleId]);

    useEffect(() => {
        if (article && articleId !== article._id) {
            setArticleId(article._id);
        }
        if (articleId && article === undefined) {
            setArticleId(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [article]);

    useEffect(() => {
        const query = new URLSearchParams(history.location.search);
        if (articleId && query.get("article") !== articleId) {
            query.set("article", articleId);
            history.push("?" + query.toString());
        }
        if (!articleId && query.get("article")) {
            const query = new URLSearchParams(history.location.search);
            query.delete("article");
            history.push("?" + query.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articleId]);

    useEffect(() => {
        function onScroll() {
            const v = window.scrollY;

            if (v >= window.screen.height && !upArrow.current?.classList.contains("active")) {
                upArrow.current?.classList.add("scale-100", "opacity-100");
                upArrow.current?.classList.remove("scale-0", "opacity-0");
            }
            if (v < window.screen.height && !upArrow.current?.classList.contains("active")) {
                upArrow.current?.classList.remove("scale-100", "opacity-100");
                upArrow.current?.classList.add("scale-0", "opacity-0");
            }
        }

        window.addEventListener("scroll", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (<>
        <ArticleModal addAlert={props.addAlert} article={article || undefined} onClose={() => setArticleId(undefined)} open={!!article} />
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} ref={upArrow} className="transition bg-gray-200/80 opacity-0 fixed rounded-full bottom-5 right-5 p-3 scale-0 z-10">
            <ChevronUpIcon className="w-5" />
        </button>

        <Header {...props} />
        <section className="px-20 py-20 h-80 w-full flex justify-center mt-20">
            <div className="z-0 fixed flex items-center gap-16 flex-col">
                <h1 className="text-5xl font-medium text-white text-center">Les dernières actualités</h1>
                <LabelledSwitch state={category} setState={v => { setPage(0); setMaxPage(undefined); setCategory(v); }} states={["Finance", "International"]} />
            </div>
        </section>
        <section className="article-container backdrop-blur-md min-h-screen pb-16">
            <div className="grid mx-auto px-10 max-w-screen-2xl py-5 gap-4">
                {
                    articles ? articles?.map((article, i) => <Article key={i} article={article} onClick={() => setArticle(article)} />) :
                        <div className="flex justify-center p-4"><Loading height="h-12" width="w-12" /></div>
                }
                {page !== undefined && maxPage !== undefined &&
                    <nav className="flex items-center justify-between border-t border-gray-200 mt-5 px-4 sm:px-0">
                        <div className="-mt-px flex w-0 flex-1">
                            <button
                                onClick={() => setPage(Math.max(page - 1, 0))}
                                className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-200 hover:border-gray-300 hover:text-gray-300"
                            >
                                <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                Previous
                            </button>
                        </div>
                        {
                            new Array(Math.min(3, maxPage + 1)).fill(0).map((_, i) => <div key={i} className="hidden md:-mt-px md:flex">
                                <button onClick={() => setPage(i)} className={clsx("inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium", page === i ? "border-indigo-400 text-indigo-400" : "border-transparent text-gray-200 hover:border-gray-300 hover:text-gray-300")}>{i + 1}</button>
                            </div>)
                        }
                        {
                            page > 2 && page !== 3 ? <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                                ...
                            </span> : null}
                        {
                            page > 2 && page < maxPage - 2 ?
                                <div className="hidden md:-mt-px md:flex">
                                    <button onClick={() => setPage(page)} className="inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium border-indigo-400 text-indigo-400">{page + 1}</button>
                                </div> : null
                        }
                        {
                            page !== maxPage - 2 && page < maxPage - 3 &&
                            <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                                ...
                            </span>
                        }
                        {
                            new Array(Math.max(Math.min(3, maxPage - 2), 0)).fill(0).map((_, i) => <div key={i} className="hidden md:-mt-px md:flex">
                                <button onClick={() => setPage(i + maxPage - 2)} className={clsx("inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium", page === i + maxPage - 2 ? "border-indigo-400 text-indigo-400" : "border-transparent text-gray-200 hover:border-gray-300 hover:text-gray-300")}>{i + maxPage - 1}</button>
                            </div>)
                        }
                        <div className="-mt-px flex w-0 flex-1 justify-end">
                            <button
                                onClick={() => setPage(Math.min(page + 1, maxPage))}
                                className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-200 hover:border-gray-300 hover:text-gray-300"
                            >
                                Next
                                <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                            </button>
                        </div>
                    </nav>
                }
            </div>
        </section>
        <Footer {...props} />
    </>)
}

function Article({ article, ...props }) {
    return (
        <div role="button" className="grid grid-rows-1 md:grid-cols-4 gap-8 p-4 group" {...props}>
            <img className="rounded-xl aspect-[3/2] object-cover" src={article.image_url || noImage} alt={article.title} />
            <div className="flex flex-col gap-4 md:col-span-3">
                <h1 className="text-xl md:text-3xl font-medium text-white group-hover:underline">{article.title}</h1>
                <div className="flex gap-5 flex-wrap">
                    <div className="flex items-center text-xs md:text-sm gap-1.5">
                        <CalendarDaysIcon className="w-5 text-gray-300" /><p className="text-gray-300">{formatDate(new Date(article.pubDate))}</p>
                    </div>
                    {article.creator?.length > 0 &&
                        <div className="flex items-center text-xs md:text-sm gap-1.5">
                            <PencilIcon className="w-5 text-gray-300" /><p className="text-gray-300">{article.creator[0]}</p>
                        </div>
                    }
                    {
                        article.country?.length > 0 &&
                        <div className="flex items-center text-xs md:text-sm gap-1.5">
                            <MapPinIcon className="w-5 text-gray-300" /><p className="text-gray-300">{capitalize(article.country[0])}</p>
                        </div>
                    }
                    <div className="flex items-center text-xs md:text-sm gap-1.5">
                        <TagIcon className="w-5 text-gray-300" /><p className="text-gray-300">{article.category.map(a => capitalize(a)).join(", ")}</p>
                    </div>
                </div>
                <p className="text-sm md:text-md text-gray-400" dangerouslySetInnerHTML={{ __html: article.description }}></p>
            </div>
        </div>
    );
}
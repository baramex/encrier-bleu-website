import { Dialog } from "@headlessui/react";
import { CalendarDaysIcon, MapPinIcon, PencilIcon, ShareIcon, TagIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Modal from ".";
import { formatDate } from "../../lib/utils/date";
import { capitalize } from "../../lib/utils/string";
import noImage from "../../images/no-image.svg"

export default function ArticleModal({ onClose, article: _article, open, addAlert }) {
    const [article, setArticle] = useState(_article);

    useEffect(() => {
        if (_article) setArticle(_article);
    }, [_article]);

    return (<Modal className="!w-auto" onClose={onClose} open={open}>
        <div>
            <button onClick={onClose} className="bg-white/25 rounded-full p-2 absolute top-4 right-4">
                <XMarkIcon className="w-5 text-white" />
            </button>
            <img className="rounded-t-2xl max-h-72 md:max-h-96 w-full object-cover" src={article?.image_url || noImage} alt={article?.title} />
            <div className="px-8 md:px-16 pt-8 pb-14 flex flex-col gap-5">
                <div className="flex flex-wrap gap-5">
                    <div className="flex items-center text-sm gap-1.5">
                        <CalendarDaysIcon className="w-5 text-gray-300" /><p className="text-gray-300">{formatDate(new Date(article?.pubDate))}</p>
                    </div>
                    {article?.creator?.length > 0 &&
                        <div className="flex items-center text-sm gap-1.5">
                            <PencilIcon className="w-5 text-gray-300" /><p className="text-gray-300">{article?.creator[0]}</p>
                        </div>
                    }
                    {
                        article?.country?.length > 0 &&
                        <div className="flex items-center text-sm gap-1.5">
                            <MapPinIcon className="w-5 text-gray-300" /><p className="text-gray-300">{capitalize(article?.country[0])}</p>
                        </div>
                    }
                    <div className="flex flex-1 items-center text-sm gap-1.5">
                        <TagIcon className="w-5 text-gray-300" /><p className="text-gray-300">{article?.category.map(a => capitalize(a)).join(", ")}</p>
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(document.location.origin + "/?article=" + article._id).then(() => addAlert({ ephemeral: true, type: "success", title: "Lien copié dans le presse-papier !" })).catch(() => addAlert({ ephemeral: true, type: "error", title: "Impossible de copier le lien." }))} className="flex items-center text-sm gap-1.5">
                        <ShareIcon className="w-5 text-gray-300" /><p className="text-gray-300">Partager</p>
                    </button>
                </div>
                <Dialog.Title as="h1" className="text-2xl md:text-3xl font-medium leading-6 text-white">
                    {article?.title}
                </Dialog.Title>
                <p className="text-gray-400" dangerouslySetInnerHTML={{ __html: article?.description }}></p>

                <p className="text-gray-200 md:text-xl" dangerouslySetInnerHTML={{ __html: article?.content }}></p>
            </div>
        </div>
    </Modal>);
}
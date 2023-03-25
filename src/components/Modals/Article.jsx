import { Dialog } from "@headlessui/react";
import { CalendarDaysIcon, MapPinIcon, PencilIcon, TagIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Modal from ".";
import { formatDate } from "../../lib/utils/date";
import { capitalize } from "../../lib/utils/string";
import noImage from "../../images/no-image.svg"

export default function ArticleModal({ onClose, article: _article, open }) {
    const [article, setArticle] = useState(_article);

    useEffect(() => {
        if (_article) setArticle(_article);
    }, [_article]);

    return (<Modal className="!w-auto" onClose={onClose} open={open}>
        <div>
            <img className="rounded-t-2xl max-h-96 w-full object-cover" src={article?.image_url || noImage} alt={article?.title} />
            <div className="px-16 pt-8 pb-14 flex flex-col gap-5">
                <div className="flex gap-5">
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
                    <div className="flex items-center text-sm gap-1.5">
                        <TagIcon className="w-5 text-gray-300" /><p className="text-gray-300">{article?.category.map(a => capitalize(a)).join(", ")}</p>
                    </div>
                </div>
                <Dialog.Title as="h1" className="text-3xl font-medium leading-6 text-white">
                    {article?.title}
                </Dialog.Title>
                <p className="text-gray-400" dangerouslySetInnerHTML={{ __html: article?.description }}></p>

                <p className="text-gray-200 text-xl" dangerouslySetInnerHTML={{__html: article?.content}}></p>
            </div>
        </div>
    </Modal>);
}
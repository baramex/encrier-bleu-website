import { api } from ".";

export function getArticles(page, categories) {
    return api("/articles?page=" + page + "&categories=" + categories, "GET");
}

export function getArticle(id) {
    return api("/article/" + id, "GET");
}

export function getPageCount(category) {
    return api("/articles/pageCount?categories=" + category, "GET");
}
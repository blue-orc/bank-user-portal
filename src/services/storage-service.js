export default function getItem(item) {
    var retrieved = localStorage.getItem(item);
    if (retrieved == "undefined") {
        return {};
    }
    if (retrieved == null) {
        return {};
    }
    return JSON.parse(retrieved);
}
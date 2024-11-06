const UrlParser = {
    parseActiveUrlWithCombiner() {
        const url = window.location.hash.slice(1).toLowerCase() || '/';
        const splitedUrl = this._urlSplitter(url);
        return this._urlCombiner(splitedUrl);
    },

    parseActiveUrlWithoutCombiner() {
        const url = window.location.hash.slice(1).toLowerCase() || '/';
        const splitedUrl = this._urlSplitter(url);
        return {
            resource: splitedUrl.resource,
            id: splitedUrl.id,
            verb: splitedUrl.verb
        };
    },

    parseQuery() {
        const queryString = window.location.hash.split('?')[1]; // Ambil query string setelah ?
        if (!queryString) return null;

        const params = new URLSearchParams(queryString);
        return params.get('q'); // Mengambil parameter 'q' dari URL
    },

    _urlSplitter(url) {
        const urlsSplits = url.split('/');
        return {
            resource: urlsSplits[1] || null,
            id: urlsSplits[2] || null,
            verb: urlsSplits[3] || null,
        };
    },

    _urlCombiner(splitedUrl) {
        return (splitedUrl.resource ? `/${splitedUrl.resource}` : '/') +
            (splitedUrl.id ? '/:id' : '') +
            (splitedUrl.verb ? `/${splitedUrl.verb}` : '');
    },
};

export default UrlParser;

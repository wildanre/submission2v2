import UrlParser from '../../routes/url-parser';
import RestaurantAPI from '../../data/restaurant-api';

const Search = {
    async render() {
        return `
            <section id="searchResults">
                <h2>Search Results</h2>
                <div id="resultsContainer"></div>
            </section>
        `;
    },
    async afterRender() {
        const query = UrlParser.parseQuery();

        if (query) {
            const results = await RestaurantAPI.searchRestaurant(query);

            const resultsContainer = document.getElementById('resultsContainer');
            if (results && results.length > 0) {
                resultsContainer.innerHTML = results
                    .map(result => `<content-item>${result.name}</content-item>`)
                    .join('');
            } else {
                resultsContainer.innerHTML = `<p>No results found for "${query}"</p>`;
            }
        } else {
            document.getElementById('resultsContainer').innerHTML = '<p>Please enter a search query.</p>';
        }
    },
};

export default Search;

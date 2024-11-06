import ContentItem from './pages/content-item.js';
import { getListOfRestaurants, getDetailOfRestaurant, searchRestaurants } from '../data/restaurant-api';
import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';
import Detail from './pages/detail.js';

class App {
    constructor({ content }) {
        this._content = content;
        this._initialAppShell();
        this._initSearch(); // Panggil fungsi untuk inisialisasi pencarian
    }

    _initialAppShell() {
        // Anda dapat melakukan inisialisasi komponen lain di sini jika diperlukan
    }

    _initSearch() {
        const searchInput = document.getElementById('searchInput');

        // Menambahkan event listener untuk pencarian real-time
        searchInput.addEventListener('keyup', async () => {
            const query = searchInput.value.trim();
            if (query) {
                console.log('Searching for:', query); // Menambahkan log untuk memeriksa query
                const results = await searchRestaurants(query);  // Panggil fungsi searchRestaurants
                console.log('Search results:', results); // Menambahkan log untuk memeriksa hasil pencarian
                this._displaySearchResults(results);  // Tampilkan hasil pencarian
            } else {
                // Jika input kosong, sembunyikan hasil pencarian
                this._hideSearchResults();
            }
        });
    }

    // Fungsi untuk menyembunyikan hasil pencarian ketika input kosong
    _hideSearchResults() {
        const searchResultsContainer = document.getElementById('searchResults');
        searchResultsContainer.style.display = 'none';
    }


    // Fungsi untuk mengontrol visibilitas #searchResults
    toggleSearchResultsVisibility(results) {
        const searchResultsContainer = document.getElementById('searchResults');

        // Jika hasil pencarian tidak ada atau kosong, sembunyikan searchResults
        if (!results || results.founded === 0) {
            searchResultsContainer.style.display = 'none';
        } else {
            searchResultsContainer.style.display = 'block';  // Tampilkan hasil pencarian
            searchResultsContainer.style.backgroundColor = '#fff'; // Set background putih untuk hasil pencarian
        }
    }

    _displaySearchResults(results) {
        const searchResultsContainer = document.getElementById('searchResults');
        searchResultsContainer.innerHTML = ''; // Kosongkan hasil sebelumnya

        if (results.error || results.founded === 0) {
            searchResultsContainer.innerHTML = '<p>No restaurants found.</p>';
            return;
        }

        // Mengontrol visibilitas hasil pencarian
        this.toggleSearchResultsVisibility(results);

        results.restaurants.forEach(restaurant => {
            const restaurantElement = document.createElement('div');
            restaurantElement.classList.add('search_restaurant-card');  // Menambahkan kelas untuk styling
            restaurantElement.innerHTML = `
                <div class="search_restaurant-card__image">
                    <img src="https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}" alt="${restaurant.name}" class="search_restaurant-image">
                </div>
                <div class="search_restaurant-card__info">
                    <h4 class="search_restaurant-name">${restaurant.name}</h4>
                    <p class="search_restaurant-description">${restaurant.description.slice(0, 100)}...</p> <!-- Membatasi deskripsi -->
                    <div class="search_restaurant-details">
                        <span class="search_restaurant-rating">Rating: ${restaurant.rating}</span>
                        <span class="search_restaurant-location">Location: ${restaurant.city}</span>
                    </div>
                    <button class="search_view-details-btn" data-id="${restaurant.id}">View Details</button>
                </div>
            `;
            searchResultsContainer.appendChild(restaurantElement);
        });

        // Delegasi event pada container
        searchResultsContainer.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('search_view-details-btn')) {
                const restaurantId = event.target.getAttribute('data-id');
                window.location.hash = `#/restaurant/${restaurantId}`; // Navigasi ke halaman detail

                // Menyembunyikan hasil pencarian setelah klik "View Details"
                searchResultsContainer.style.display = 'none';
                searchInput.value = '';
            }
        });
    }

    async renderPage() {
        const url = UrlParser.parseActiveUrlWithCombiner();
        const page = routes[url] || routes['/'];
        const isDetailPage = (page === Detail);
        const heroElement = document.querySelector('.hero-section');

        if (heroElement) {
            // Sembunyikan hero jika di halaman detail, tampilkan di halaman lain
            heroElement.style.display = isDetailPage ? 'none' : 'block';
        }

        if (!page || typeof page.render !== 'function') {
            console.error('Page not found or render function missing:', url);
            this._content.innerHTML = '<h2>Page Not Found</h2>';
            return;
        }

        let restaurantData = null;

        if (page === ContentItem) {
            restaurantData = await getListOfRestaurants();
            if (restaurantData.length === 0) {
                this._content.innerHTML = '<h2>No Restaurants Found</h2>';
                return;
            }
        } else if (page === Detail) {
            const { id } = UrlParser.parseActiveUrlWithoutCombiner(); // Mendapatkan ID dari URL
            restaurantData = await getDetailOfRestaurant(id);
            if (!restaurantData) {
                this._content.innerHTML = '<h2>Restaurant not found</h2>';
                return;
            }
        } else if (page === 'search') { // Menambahkan pengecekan jika halaman adalah pencarian
            const query = UrlParser.parseQuery(); // Ambil query dari URL (misal ?q=searchTerm)
            const results = await searchRestaurants(query); // Lakukan pencarian
            this._displaySearchResults(results);
            return; // Pastikan hasil pencarian hanya ditampilkan untuk halaman pencarian
        }

        this._content.innerHTML = await page.render(restaurantData);
        if (page.afterRender) await page.afterRender();
    }
}

const app = new App({
    content: document.querySelector('#mainContent'), // Pastikan ini mengarah ke elemen yang ada
});

// Event listener untuk merender halaman ketika URL hash berubah atau halaman dimuat
window.addEventListener('hashchange', () => {
    app.renderPage();
});

window.addEventListener('load', () => {
    app.renderPage();
});

export default App;

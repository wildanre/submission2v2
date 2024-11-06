import './components/script.js';
import './utils/utils.js';
import '../styles/main.scss';
import './views/pages/content-item.js';
import App from './views/app';
import SearchBar from './components/search-bar';
import Search from './views/pages/search';

// Inisialisasi aplikasi setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
    // Pastikan app hanya dideklarasikan satu kali
    const app = new App({
        content: document.querySelector('#mainContent'),
    });

    // Render SearchBar ke dalam halaman
    const searchBarContainer = document.getElementById('searchBarContainer');
    if (searchBarContainer) {
        searchBarContainer.innerHTML = SearchBar.render();  // Render komponen pencarian
        SearchBar.afterRender();  // Jalankan afterRender untuk menambahkan event listener ke elemen
    }

    // Event listener untuk merender halaman ketika URL hash berubah atau halaman dimuat
    window.addEventListener('hashchange', () => {
        app.renderPage();
    });

    window.addEventListener('load', () => {
        app.renderPage();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 0. NAVEGACIÓN DE PESTAÑAS (UI)
    // ==========================================
    const tabs = document.querySelectorAll('.tab-link');
    const pages = document.querySelectorAll('.page-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            const targetPage = document.getElementById(`page-${tab.dataset.page}`);
            if (targetPage) targetPage.classList.add('active');

            // Close mobile menu on navigation
            const nav = document.getElementById('mainNav');
            if (nav) nav.classList.remove('open');
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mainNav.classList.toggle('open');
        });
    }

    // Placeholder seguro (Data URI) que nunca genera errores de red ni bucles
    const DEFAULT_POKE_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='%231e293b' stroke='%23ef4444' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Ccircle cx='12' cy='12' r='3' fill='%23ef4444'/%3E%3C/svg%3E";

    // ==========================================
    // 1. DIRECTORIO VERIFICADO DE 40 TIENDAS CHILENAS POKÉMON TCG
    // ==========================================
    const storesDB = [
        { name: "Geekers Chile", location: "📍 Av. Providencia 2216, Santiago", rating: "4.9 ⭐", verified: true, website: "https://geekers.cl" },
        { name: "AFK Store", location: "📍 Providencia / Envío Nacional", rating: "4.9 ⭐", verified: true, auto: true, website: "https://afkstore.cl" },
        { name: "Collector Center", location: "📍 Santiago Centro, Chile", rating: "4.9 ⭐", verified: true, auto: true, website: "https://collectorcenter.cl" },
        { name: "DeckSwap Chile", location: "📍 Providencia, Santiago", rating: "4.8 ⭐", verified: true, auto: true, website: "https://deckswap.cl" },
        { name: "PiedraBruja", location: "📍 Providencia / Ñuñoa, Santiago", rating: "4.9 ⭐", verified: true, auto: true, website: "https://piedrabruja.cl" },
        { name: "Juegomania", location: "📍 Galería Eurocentro, Santiago", rating: "4.8 ⭐", verified: true, website: "https://juegomania.cl" },
        { name: "Third Impact", location: "📍 Santiago / Envío a regiones", rating: "4.8 ⭐", verified: true, website: "https://thirdimpact.cl" },
        { name: "Playset TCG Store", location: "📍 Las Condes, Santiago", rating: "4.8 ⭐", verified: true, website: "https://playset.cl" },
        { name: "Drawn TCG", location: "📍 Maipú / Providencia", rating: "4.8 ⭐", verified: true, website: "https://drawn.cl" },
        { name: "TCG Masters Chile", location: "📍 Los Leones, Providencia", rating: "4.9 ⭐", verified: true, website: "https://tcgmasters.cl" },
        { name: "TCG Family", location: "📍 Santiago / Envío Nacional", rating: "4.7 ⭐", verified: true, website: "https://tcgfamily.cl" },
        { name: "Kingdom TCG", location: "📍 La Florida, Santiago", rating: "4.7 ⭐", verified: true, website: "https://kingdomtcg.cl" },
        { name: "Charizstore", location: "📍 Viña del Mar, Valparaíso", rating: "4.8 ⭐", verified: true, auto: true, website: "https://charizstore.cl" },
        { name: "PokeVentas CL", location: "📍 Concepción, Biobío", rating: "4.8 ⭐", verified: true, website: "https://pokeventas.cl" },
        { name: "Tienda La Comarca", location: "📍 Providencia, Santiago", rating: "4.8 ⭐", verified: true, website: "https://tiendalacomarca.cl" },
        { name: "Pokestop Chile", location: "📍 Marketplace Singles Chile", rating: "4.9 ⭐", verified: true, website: "https://pokestop.cl" },
        { name: "TCGMatch Marketplace", location: "📍 Compra-Venta Chile TCG", rating: "4.9 ⭐", verified: true, website: "https://tcgmatch.cl" },
        { name: "Magic Sur Chile", location: "📍 Av. Los Leones, Providencia", rating: "4.9 ⭐", verified: true, website: "https://magicsur.cl" },
        { name: "EntreJuegos", location: "📍 Galería Omnium, Las Condes", rating: "4.7 ⭐", verified: true, website: "https://entrejuegos.cl" },
        { name: "Warhammer Chile / TCG Zone", location: "📍 Providencia, Santiago", rating: "4.8 ⭐", verified: true, website: "https://warhammerchile.cl" },
        { name: "Sniper TCG", location: "📍 Valparaíso / Viña del Mar", rating: "4.7 ⭐", verified: true, website: "https://snipertcg.cl" },
        { name: "Kanto Cards Chile", location: "📍 Temuco, La Araucanía", rating: "4.8 ⭐", verified: true, website: "https://kantocards.cl" },
        { name: "Mega Poke Chile", location: "📍 Antofagasta, Chile", rating: "4.7 ⭐", verified: true, website: "https://megapoke.cl" },
        { name: "UltraBall TCG", location: "📍 La Serena, Coquimbo", rating: "4.8 ⭐", verified: true, website: "https://ultraball.cl" },
        { name: "Master Ball Store", location: "📍 Rancagua, O'Higgins", rating: "4.7 ⭐", verified: true, website: "https://masterballstore.cl" },
        { name: "Gamer's Haven Chile", location: "📍 Talca, Maule", rating: "4.6 ⭐", verified: true, website: "https://gamershaven.cl" },
        { name: "Pallet Town TCG", location: "📍 Puerto Montt, Los Lagos", rating: "4.8 ⭐", verified: true, website: "https://pallettowntcg.cl" },
        { name: "Overlord TCG", location: "📍 Iquique, Tarapacá", rating: "4.7 ⭐", verified: true, website: "https://overlordtcg.cl" },
        { name: "Guildhall Games", location: "📍 San Miguel, Santiago", rating: "4.8 ⭐", verified: true, website: "https://guildhall.cl" },
        { name: "Red Goblin TCG", location: "📍 Chillán, Ñuble", rating: "4.7 ⭐", verified: true, website: "https://redgoblintcg.cl" },
        { name: "ProCards Chile", location: "📍 Copiapó, Atacama", rating: "4.6 ⭐", verified: true, website: "https://procards.cl" },
        { name: "PokeZone Santiago", location: "📍 Santiago Centro", rating: "4.8 ⭐", verified: true, website: "https://pokezone.cl" },
        { name: "Valdivia TCG Store", location: "📍 Valdivia, Los Ríos", rating: "4.8 ⭐", verified: true, website: "https://valdiviatcg.cl" },
        { name: "Punta Arenas TCG", location: "📍 Punta Arenas, Magallanes", rating: "4.9 ⭐", verified: true, website: "https://patagoniatcg.cl" },
        { name: "Kanto Store Quillota", location: "📍 Quillota, Valparaíso", rating: "4.6 ⭐", verified: true, website: "https://kantoquillota.cl" },
        { name: "TCG Station Curicó", location: "📍 Curicó, Maule", rating: "4.7 ⭐", verified: true, website: "https://tcgstation.cl" },
        { name: "Arica Cards TCG", location: "📍 Arica, Arica y Parinacota", rating: "4.6 ⭐", verified: true, website: "https://aricacards.cl" },
        { name: "El Reino TCG", location: "📍 Puente Alto, Santiago", rating: "4.7 ⭐", verified: true, website: "https://elreinotcg.cl" },
        { name: "TCG Vault Chile", location: "📍 Quilpué, Valparaíso", rating: "4.8 ⭐", verified: true, website: "https://tcgvault.cl" },
        { name: "Legendary Cards Chile", location: "📍 Osorno, Los Lagos", rating: "4.8 ⭐", verified: true, website: "https://legendarycards.cl" }
    ];

    // ==========================================
    // 2. PRODUCTOS — Carga asíncrona desde productos.json
    // ==========================================
    let productsDB = [];
    let productsLoaded = false;

    const homeProductsGrid = document.getElementById('homeProductsGrid');
    const searchInput = document.getElementById('productSearchInput');
    const sortSelect = document.getElementById('sortSelect');
    const expansionSelect = document.getElementById('expansionSelect');
    const filterPills = document.querySelectorAll('#featureFilters .pill');
    const syncStatusBadge = document.getElementById('syncStatusBadge');
    const productsLoadingState = document.getElementById('productsLoadingState');

    const formatCLP = (number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(number);

    const typeSlug = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    function initialsAvatar(name) {
        const clean = (name || '?').trim();
        const initials = clean.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?';
        let hash = 0;
        for (const ch of clean) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
        const hue = hash % 360;
        return `<div class="avatar-initials" style="background:hsl(${hue}, 45%, 42%)">${initials}</div>`;
    }

    const state = { searchQuery: '', sortBy: 'popular', activeFilter: 'all', expansionFilter: 'all' };

    // Llena el selector de expansiones desde los datos cargados (nunca hardcodeado)
    function populateExpansionSelect() {
        if (!expansionSelect) return;
        const current = state.expansionFilter;
        const expansions = [...new Set(productsDB.map(p => p.expansion).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
        expansionSelect.innerHTML = `<option value="all">📦 Todas las Expansiones</option>` +
            expansions.map(e => `<option value="${e}">${e}</option>`).join('');
        expansionSelect.value = expansions.includes(current) ? current : 'all';
        state.expansionFilter = expansionSelect.value;
    }

    async function loadProducts() {
        try {
            if (productsLoadingState) productsLoadingState.classList.remove('hidden');
            if (homeProductsGrid) homeProductsGrid.innerHTML = '';

            const response = await fetch('productos.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            productsDB = await response.json();
            productsLoaded = true;

            if (syncStatusBadge) {
                const today = new Date().toISOString().split('T')[0];
                syncStatusBadge.innerHTML = `✅ ${productsDB.length} productos con precios reales (actualizado ${today})`;
            }
        } catch (err) {
            console.warn('Carga asíncrona de productos.json (usando respaldo si aplica):', err.message);
            productsDB = [
                { id: 1, title: "Elite Trainer Box Mega Evolution", store: "Charizstore", price: 69990, oldPrice: null, inStock: true, lang: null, category: "etb", expansion: "Mega Evolución / Mega Evolution", popularity: 1, link: "https://charizstore.cl", lastUpdated: "2026-08-22" },
                { id: 2, title: "Pokémon TCG – Sleeved Booster Pack", store: "DeckSwap Chile", price: 6990, oldPrice: null, inStock: true, lang: "ENG", category: "booster", expansion: "Otras Expansiones", popularity: 2, link: "https://deckswap.cl", lastUpdated: "2026-08-22" },
                { id: 3, title: "Booster Box (Escarlata y Púrpura)", store: "AFK Store", price: 149990, oldPrice: null, inStock: false, lang: null, category: "caja-sobres", expansion: "Escarlata y Púrpura", popularity: 3, link: "https://afkstore.cl", lastUpdated: "2026-08-22" }
            ];
            productsLoaded = true;

            if (syncStatusBadge) {
                syncStatusBadge.innerHTML = `⚠️ Sin conexión con productos.json — mostrando datos de respaldo.`;
            }
        } finally {
            if (productsLoadingState) productsLoadingState.classList.add('hidden');
            populateExpansionSelect();
            renderProducts();
        }
    }

    // ==========================================
    // 3. MOTOR DE BÚSQUEDA Y RENDERIZADO DE PRODUCTOS
    // ==========================================
    function getFilteredProducts() {
        let filtered = [...productsDB];

        // Text search
        if (state.searchQuery) {
            const q = state.searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                (p.title || '').toLowerCase().includes(q) ||
                (p.store || '').toLowerCase().includes(q) ||
                (p.expansion || '').toLowerCase().includes(q)
            );
        }

        // Expansion filter
        if (state.expansionFilter !== 'all') {
            const expLower = state.expansionFilter.toLowerCase();
            filtered = filtered.filter(p => {
                const pExp = (p.expansion || '').toLowerCase();
                return expLower.split(' / ').some(part => pExp.includes(part.trim().toLowerCase())) ||
                       pExp.split(' / ').some(part => expLower.includes(part.trim().toLowerCase()));
            });
        }

        // Feature filters
        if (state.activeFilter === 'discount') filtered = filtered.filter(p => p.oldPrice && p.oldPrice > p.price);
        else if (state.activeFilter === 'instock') filtered = filtered.filter(p => p.inStock);
        else if (state.activeFilter === 'english') filtered = filtered.filter(p => p.lang === 'ENG');
        else if (state.activeFilter === 'spanish') filtered = filtered.filter(p => p.lang === 'ESP');

        // Sorting
        if (state.sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        else if (state.sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
        else if (state.sortBy === 'popular') filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        return filtered;
    }

    function renderProductCardHtml(product) {
        const hasDiscount = product.oldPrice && product.oldPrice > product.price;
        const stockClass = product.inStock ? 'stock-ok' : 'stock-out';
        const stockText = product.inStock ? '✅ En Stock' : '❌ Agotado';

        return `
            <div class="product-card">
                ${hasDiscount ? `<span class="discount-badge">🔥 Oferta</span>` : ''}
                <div class="product-store-row">
                    ${initialsAvatar(product.store)}
                    <span class="product-store">${product.store}${product.lang ? ` • [${product.lang}]` : ''}</span>
                </div>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-expansion">Set: ${product.expansion}</div>
                <div class="price-box">
                    <span class="current-price">${formatCLP(product.price)}</span>
                    ${hasDiscount ? `<span class="old-price">${formatCLP(product.oldPrice)}</span>` : ''}
                </div>
                <div class="product-meta">Verificado: ${product.lastUpdated || '—'}</div>
                <div class="stock-status ${stockClass}">${stockText}</div>
                <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="btn-buy" style="${!product.inStock ? 'opacity: 0.5; pointer-events: none;' : ''}">
                    ${product.inStock ? 'Ir a la Tienda 🔗' : 'Sin Stock'}
                </a>
            </div>
        `;
    }

    function renderProducts() {
        if (!homeProductsGrid) return;
        if (!productsLoaded) return;

        const filtered = getFilteredProducts();

        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) resultsCount.textContent = `Mostrando ${filtered.length} de ${productsDB.length} productos`;

        if (filtered.length === 0) {
            const msg = productsDB.length === 0
                ? `<h3>📭 No hay productos disponibles</h3><p style="margin-top: 10px;">El archivo <code>productos.json</code> se generará automáticamente por el scraper.</p>`
                : `<h3>🕵️‍♂️ No se encontraron productos para "${state.searchQuery || state.expansionFilter}"</h3><p style="margin-top: 10px;">Prueba seleccionando otra expansión o término de búsqueda.</p>`;

            homeProductsGrid.innerHTML = `<div class="no-results">${msg}</div>`;
        } else {
            homeProductsGrid.innerHTML = filtered.map(renderProductCardHtml).join('');
        }
    }

    // Quick search from pills
    window.quickSearch = (term) => {
        if (searchInput) searchInput.value = term;
        state.searchQuery = term;
        if (expansionSelect) expansionSelect.value = 'all';
        state.expansionFilter = 'all';
        renderProducts();
        
        // Show home tab safely without synthetic click
        tabs.forEach(t => t.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));
        const homeTab = document.querySelector('.tab-link[data-page="home"]');
        const homePage = document.getElementById('page-home');
        if (homeTab) homeTab.classList.add('active');
        if (homePage) homePage.classList.add('active');
    };

    // Event listeners for filters
    if (searchInput) {
        searchInput.addEventListener('input', (e) => { 
            state.searchQuery = e.target.value; 
            renderProducts(); 
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => { 
            state.sortBy = e.target.value; 
            renderProducts(); 
        });
    }

    if (expansionSelect) {
        expansionSelect.addEventListener('change', (e) => {
            state.expansionFilter = e.target.value;
            if (searchInput && state.expansionFilter !== 'all') {
                searchInput.value = '';
                state.searchQuery = '';
            }
            renderProducts();
        });
    }

    filterPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            filterPills.forEach(p => p.classList.remove('active'));
            e.currentTarget.classList.add('active');
            state.activeFilter = e.currentTarget.getAttribute('data-filter');
            renderProducts();
        });
    });

    // Manual sync button
    const manualSyncBtn = document.getElementById('manualSyncBtn');
    if (manualSyncBtn) {
        manualSyncBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            manualSyncBtn.innerText = '⏳ Cargando precios reales...';
            manualSyncBtn.disabled = true;
            await loadProducts();
            manualSyncBtn.innerText = '✅ Precios Actualizados';
            setTimeout(() => {
                manualSyncBtn.innerText = '🔄 Actualizar Precios';
                manualSyncBtn.disabled = false;
            }, 2000);
        });
    }

    // Search button
    const productSearchBtn = document.getElementById('productSearchBtn');
    if (productSearchBtn) {
        productSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (searchInput) {
                state.searchQuery = searchInput.value;
                renderProducts();
            }
        });
    }

    // ==========================================
    // 4. POKÉDEX TRACKER — Carga asíncrona desde pokedex.json
    // ==========================================
    let pokedexDB = [];
    let pokedexLoaded = false;
    let userCollection = JSON.parse(localStorage.getItem('poke_collection_v2') || '[]');

    const pokedexGrid = document.getElementById('pokedexGrid');
    const pokedexStats = document.getElementById('pokedexStats');
    const pokedexSearchInput = document.getElementById('pokedexSearchInput');
    const pokedexGenFilter = document.getElementById('pokedexGenFilter');
    const pokedexLoadingState = document.getElementById('pokedexLoadingState');

    const pokedexState = { searchQuery: '', genFilter: 'all', captureFilter: 'all' };

    async function loadPokedex() {
        try {
            if (pokedexLoadingState) pokedexLoadingState.classList.remove('hidden');
            if (pokedexGrid) pokedexGrid.innerHTML = '';

            const response = await fetch('pokedex.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            pokedexDB = await response.json();
            pokedexLoaded = true;
        } catch (err) {
            console.warn('Carga asíncrona de pokedex.json (usando respaldo si aplica):', err.message);
            pokedexDB = [
                { id: "001", dexNumber: 1, name: "Bulbasaur", nameEs: "Bulbasaur", generation: 1, type1: "Planta", type2: "Veneno", region: null, form: null, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
                { id: "004", dexNumber: 4, name: "Charmander", nameEs: "Charmander", generation: 1, type1: "Fuego", type2: null, region: null, form: null, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
                { id: "007", dexNumber: 7, name: "Squirtle", nameEs: "Squirtle", generation: 1, type1: "Agua", type2: null, region: null, form: null, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
                { id: "025", dexNumber: 25, name: "Pikachu", nameEs: "Pikachu", generation: 1, type1: "Eléctrico", type2: null, region: null, form: null, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
                { id: "026-alola", dexNumber: 26, name: "Raichu (Alola)", nameEs: "Raichu de Alola", generation: 7, type1: "Eléctrico", type2: "Psíquico", region: "Alola", form: null, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10100.png" },
                { id: "052-galar", dexNumber: 52, name: "Meowth (Galar)", nameEs: "Meowth de Galar", generation: 8, type1: "Acero", type2: null, region: "Galar", form: null, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10161.png" },
                { id: "058-hisui", dexNumber: 58, name: "Growlithe (Hisui)", nameEs: "Growlithe de Hisui", generation: 8, type1: "Fuego", type2: "Roca", region: "Hisui", form: null, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10229.png" },
                { id: "128-paldea", dexNumber: 128, name: "Tauros (Paldea)", nameEs: "Tauros de Paldea", generation: 9, type1: "Lucha", type2: null, region: "Paldea", form: null, sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10250.png" },
                { id: "421-sunshine", dexNumber: 421, name: "Cherrim (Sunshine)", nameEs: "Cherrim (Forma Florecida)", generation: 4, type1: "Planta", type2: null, region: null, form: "Sol", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10061.png" }
            ];
            pokedexLoaded = true;
        } finally {
            if (pokedexLoadingState) pokedexLoadingState.classList.add('hidden');
            renderPokedex();
        }
    }

    function getFilteredPokedex() {
        let filtered = [...pokedexDB];

        // Search filter
        if (pokedexState.searchQuery) {
            const q = pokedexState.searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                (p.name || '').toLowerCase().includes(q) ||
                (p.nameEs || '').toLowerCase().includes(q) ||
                String(p.dexNumber).padStart(3, '0').includes(q) ||
                String(p.dexNumber) === q
            );
        }

        // Generation filter
        if (pokedexState.genFilter === 'regional') {
            filtered = filtered.filter(p => p.region !== null);
        } else if (pokedexState.genFilter === 'forms') {
            filtered = filtered.filter(p => !p.region && p.form);
        } else if (pokedexState.genFilter !== 'all') {
            const gen = parseInt(pokedexState.genFilter);
            filtered = filtered.filter(p => p.generation === gen && p.region === null && !p.form);
        }

        // Capture filter: 'all' | 'collected' | 'missing'
        if (pokedexState.captureFilter === 'collected') {
            filtered = filtered.filter(p => userCollection.includes(p.id));
        } else if (pokedexState.captureFilter === 'missing') {
            filtered = filtered.filter(p => !userCollection.includes(p.id));
        }

        return filtered;
    }

    function renderPokedex() {
        if (!pokedexGrid || !pokedexLoaded) return;

        const filtered = getFilteredPokedex();

        // Stats
        if (pokedexStats) {
            const totalBase = pokedexDB.filter(p => p.region === null && !p.form).length;
            const totalRegional = pokedexDB.filter(p => p.region !== null).length;
            const totalForms = pokedexDB.filter(p => !p.region && p.form).length;
            const collected = userCollection.length;
            const totalEntries = pokedexDB.length;

            const pct = totalEntries > 0 ? Math.round((collected / totalEntries) * 100) : 0;

            pokedexStats.innerHTML = `
                <div class="pokedex-stats-bar">
                    <div class="stat-item"><strong>Pokémon Base:</strong> <span class="stat-value">${totalBase}</span></div>
                    <div class="stat-item"><strong>Formas Regionales:</strong> <span class="stat-value">${totalRegional}</span></div>
                    <div class="stat-item"><strong>Otras Formas:</strong> <span class="stat-value">${totalForms}</span></div>
                    <div class="stat-item"><strong>Capturados:</strong> <span class="stat-value">${collected} / ${totalEntries} (${pct}%)</span></div>
                </div>
                <div class="poke-progress" title="${pct}% capturado">
                    <div class="poke-progress-fill" style="width:${pct}%"></div>
                </div>
            `;
        }

        if (filtered.length === 0) {
            pokedexGrid.innerHTML = `<div class="no-results"><h3>No se encontraron Pokémon</h3></div>`;
            return;
        }

        pokedexGrid.innerHTML = filtered.map(pokemon => {
            const isCollected = userCollection.includes(pokemon.id);
            const dexNum = String(pokemon.dexNumber).padStart(3, '0');
            const typeBadges = [pokemon.type1, pokemon.type2]
                .filter(Boolean)
                .map(t => `<span class="type-badge type-${typeSlug(t)}">${t}</span>`)
                .join('');

            let regionTag = '';
            if (pokemon.region) {
                const regionClass = pokemon.region.toLowerCase();
                regionTag = `<span class="poke-region-tag ${regionClass}">${pokemon.region}</span>`;
            } else if (pokemon.form) {
                regionTag = `<span class="poke-form-tag">${pokemon.form}</span>`;
            }

            return `
                <div class="poke-card ${isCollected ? 'collected' : ''}" onclick="toggleCollection('${pokemon.id}')">
                    <img src="${pokemon.sprite}" alt="${pokemon.name}" loading="lazy" onerror="this.onerror=null; this.src='${DEFAULT_POKE_ICON}'">
                    <div class="poke-dex-number">#${dexNum}</div>
                    <div class="poke-title">${pokemon.name}</div>
                    <div class="poke-type">${typeBadges}</div>
                    ${regionTag}
                </div>
            `;
        }).join('');
    }

    window.toggleCollection = (pokemonId) => {
        if (userCollection.includes(pokemonId)) {
            userCollection = userCollection.filter(id => id !== pokemonId);
        } else {
            userCollection.push(pokemonId);
        }
        localStorage.setItem('poke_collection_v2', JSON.stringify(userCollection));
        renderPokedex();
    };

    // Pokédex search & filter listeners
    if (pokedexSearchInput) {
        pokedexSearchInput.addEventListener('input', (e) => {
            pokedexState.searchQuery = e.target.value;
            renderPokedex();
        });
    }

    if (pokedexGenFilter) {
        pokedexGenFilter.addEventListener('change', (e) => {
            pokedexState.genFilter = e.target.value;
            renderPokedex();
        });
    }

    const pokedexCollectedBtn = document.getElementById('pokedexCollectedBtn');
    const pokedexMissingBtn = document.getElementById('pokedexMissingBtn');

    function setCaptureFilter(value) {
        pokedexState.captureFilter = pokedexState.captureFilter === value ? 'all' : value;
        if (pokedexCollectedBtn) pokedexCollectedBtn.classList.toggle('active', pokedexState.captureFilter === 'collected');
        if (pokedexMissingBtn) pokedexMissingBtn.classList.toggle('active', pokedexState.captureFilter === 'missing');
        renderPokedex();
    }

    if (pokedexCollectedBtn) {
        pokedexCollectedBtn.addEventListener('click', () => setCaptureFilter('collected'));
    }
    if (pokedexMissingBtn) {
        pokedexMissingBtn.addEventListener('click', () => setCaptureFilter('missing'));
    }

    // ==========================================
    // 5. DIRECTORIO DE TIENDAS (con avatar de iniciales)
    // ==========================================
    let storeSearchQuery = '';

    function renderStores() {
        const storesGrid = document.getElementById('storesGrid');
        if (!storesGrid) return;

        const q = storeSearchQuery.toLowerCase();
        const visible = q
            ? storesDB.filter(s => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q))
            : storesDB;

        if (visible.length === 0) {
            storesGrid.innerHTML = `<div class="no-results"><h3>🏬 No se encontraron tiendas para "${storeSearchQuery}"</h3></div>`;
            return;
        }

        storesGrid.innerHTML = visible.map(store => `
            <div class="store-card">
                <div class="store-card-left">
                    ${initialsAvatar(store.name)}
                    <div class="store-info">
                        <h3>${store.name} ${store.verified ? '✅' : ''}</h3>
                        <p>${store.location}</p>
                        <div class="store-rating">${store.rating}</div>
                        ${store.auto ? '<div class="store-auto-badge">🤖 Precios automáticos ✓</div>' : ''}
                    </div>
                </div>
                <a href="${store.website}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="font-size: 0.85rem; text-decoration: none;">Ir a Tienda 🔗</a>
            </div>
        `).join('');
    }

    const storeSearchInput = document.getElementById('storeSearchInput');
    if (storeSearchInput) {
        storeSearchInput.addEventListener('input', (e) => {
            storeSearchQuery = e.target.value;
            renderStores();
        });
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    loadProducts();
    loadPokedex();
    renderStores();
});

# PokeRadar 🛰️🇨🇱

Comparador de precios de **Pokémon TCG** en tiendas chilenas. Sitio estático (HTML/CSS/JS puro) que muestra productos sellados reales — con foto, precio, stock y enlace directo a la tienda.

## Funciones
- 🔎 Buscador de 462+ productos reales de 5 tiendas verificadas
- 🏪 Filtro por tienda y por expansión
- 💰 Rango de precio mínimo/máximo
- ♥ Favoritos persistentes y últimas búsquedas
- 📄 Paginación (24 por página)
- 📕 Pokédex tracker con formas regionales y alternativas (1160 entradas)

## Uso local
Sirve la raíz por HTTP (`python -m http.server` o similar) y abre `http://localhost:8000`. No usar `file://`: los `fetch()` fallan silenciosamente.

## Datos
El catálogo **nunca se edita a mano**:
```bash
node scripts/build-catalog.mjs     # regenera productos.json desde los feeds de las tiendas
node scripts/update-prices.mjs     # refresca precios/stock diariamente (match exacto por URL)
powershell -File scripts/install-task.ps1   # agenda el bot diario en Windows
```

## Deploy (GitHub Pages)
1. Sube al repo: `index.html`, `app.js`, `styles.css`, `productos.json`, `pokedex.json`
2. Activa *Settings → Pages → Deploy from branch → main / root*
3. Listo en ~1 minuto.

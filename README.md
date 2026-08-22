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
powershell -File scripts/install-task.ps1   # agenda el bot diario en Windows (opcional)
```

## Actualización automática (GitHub Actions)
El repo se mantiene solo: `.github/workflows/actualizar.yml` ejecuta el bot en los servidores de GitHub.

| Cuándo | Qué hace |
|---|---|
| Todos los días ~10:00 AM Chile | Refresca precio/stock (`update-prices`) |
| Domingos + botón manual | Reconstruye catálogo completo con nuevos productos (`build-catalog`) |

Si cambió algo, hace commit de `productos.json` y GitHub Pages republica automáticamente. Tu PC no necesita estar encendido.

**Activación**: sube la carpeta `.github/` junto al resto de archivos y en *Settings → Actions → General → Workflow permissions* marca **Read and write permissions**. Para forzar una pasada: pestaña *Actions → Actualizar Precios → Run workflow*.

## Deploy (GitHub Pages)
1. Sube al repo: `index.html`, `app.js`, `styles.css`, `productos.json`, `pokedex.json`, `.nojekyll` y `.github/workflows/actualizar.yml`
2. Activa *Settings → Pages → Deploy from branch → main / root*
3. Listo en ~1 minuto. Después el bot lo actualiza solo cada día.


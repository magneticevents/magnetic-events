# Magnetic Events — standard obrázků pro web

Tento soubor je trvalou součástí projektu a závazným zadáním pro další tvorbu, optimalizaci a nasazování fotografií a ilustrací.

## Obrazové karty „Tři kroky“
- **Rozlišení exportu:** minimálně 1200 × 750 px.
- **Poměr stran:** 8:5; ve webu zachovat `aspect-ratio: 8/5` a `object-fit: cover` pouze při potřebě ořezu.
- **Výchozí formát:** WebP; použít moderní ztrátovou kompresi s vysokou vizuální kvalitou, typicky 80–88 podle obsahu. Nezhoršovat kvalitu kvůli několika KB.
- **Ostrost:** vytvářet a exportovat ze zdroje s dostatečným rozlišením, jemně doostřit po případném downsamplingu. Nepoužívat extrémně malé náhledy a nepokoušet se rozmazané náhledy „zachránit“ CSS efekty.
- **Velikost souborů:** optimalizovat s ohledem na rychlost, ale bez zjevného rozmazání; cílit zhruba na desítky až nižší stovky KB podle detailnosti scény.
- **HTML:** rozměry u obrázku odpovídají poměru 8:5; lazy loading a asynchronní dekódování u obrázků mimo první viewport.
- **Kontrola:** otestovat 100% velikost na desktopu a na displeji s vysokou hustotou pixelů a před nasazením porovnat kvalitu se zdrojovou ilustrací.

## Další ilustrace/fotografie
- Kde poměr není 8:5, zachovat rozměry podle použití, avšak exportní rozlišení alespoň cca **2× oproti reálné zobrazované velikosti** v CSS pixelech.
- Pro velké hero fotografie připravit individuální vyšší rozlišení.
- Držet vizuální styl značky: tmavé/černé pozadí, čistá moderní kompozice, růžové/magentové akcenty a kvalitní realistické zobrazení eventů.
- **Postup projektu:** nejprve dokončit desktopovou podobu webu, potom samostatně doladit mobilní rozložení.

## Konkrétní soubory připravené ke změně
`assets/krok-1-termin.webp`, `assets/krok-2-nabidka.webp`, `assets/krok-3-realizace.webp`.

Pro nové ostré soubory jsou připravené verze označené `-HQ.webp`, každá 1200 × 750 px. Nasazení do výše uvedených cest vyžaduje přenos plného binárního obsahu; nepoužívat žádné zmenšené thumbnail verze.

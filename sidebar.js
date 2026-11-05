// Shared navigation for the outside (index.html) and inside (inside.html) models:
// - left sidebar of views, each with the display assets it shows and how many have a design added
// - the right "Display" panel is filtered to the current view; each row gets an icon and a +/✓ button
// Each page defines window.goView(key). Panel rows are elements with data-id, a file input, and class "loaded"
// once a design is in place. Views on the other page open it with #key.
(() => {
  // Rounded line icons in the spirit of SF Symbols (24 × 24, round caps and joins).
  const ICON = {
    building: '<path d="M3 20h18M5 20V9.5C5 7 8 5 12 5s7 2 7 4.5V20"/><path d="M5 11h14M9 20v-4h6v4"/>',
    plaza: '<rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="M3.5 12h17M12 5v14"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.3 3.6 5.2 3.6 8.5S14.5 18.2 12 20.5M12 3.5C9.5 5.8 8.4 8.7 8.4 12s1.1 6.2 3.6 8.5"/>',
    shop: '<path d="M10.5 9.5h10l-.8 9.6a1.4 1.4 0 0 1-1.4 1.4h-5.6a1.4 1.4 0 0 1-1.4-1.4l-.8-9.6Z"/><path d="M13 9.5V8a2.5 2.5 0 0 1 5 0v1.5"/><path d="M3.5 7.5h5l-.9 12.2a.9.9 0 0 1-.9.8H5.3a.9.9 0 0 1-.9-.8L3.5 7.5ZM6 7.5l1-4h2"/>',
    ruler: '<path d="M3.5 15.8 15.8 3.5l4.7 4.7L8.2 20.5z"/><path d="M7.3 12l1.6 1.6M9.8 9.5l2.2 2.2M12.3 7l1.6 1.6"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
    tile: '<rect x="3.5" y="5.5" width="7.5" height="13" rx="1.5"/><rect x="13" y="5.5" width="7.5" height="13" rx="1.5"/>',
    oval: '<path d="M2.8 13.6c0-3.7 4.4-6.6 10.2-6.6 4.8 0 8.2 1.9 8.2 4.7 0 3.4-5 6-10.9 6-4.6 0-7.5-1.7-7.5-4.1Z"/><path d="M8.2 12.9c0-1.5 2.3-2.7 5.1-2.7 2.4 0 4.1.8 4.1 1.9 0 1.5-2.4 2.5-5.1 2.5-2.5 0-4.1-.7-4.1-1.7Z"/>',
    road: '<path d="M8 3.5 5 20.5M16 3.5l3 17M12 4v2.5M12 10v3M12 16.5V20"/>',
    door: '<path d="M6 20.5V4.5c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v16M4 20.5h16"/><path d="M14.5 12.5v.01"/>',
    lobby: '<rect x="3.5" y="4" width="17" height="4" rx="1.5"/><path d="M6 20V11M12 20V11M18 20V11M3.5 20.5h17"/>',
    signpost: '<path d="M12 3.5v17M8 20.5h8"/><path d="M12 6h6.5l2 2-2 2H12M12 12H5.5l-2 2 2 2H12"/>',
    court: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M12 6v12"/><circle cx="12" cy="12" r="2.2"/><path d="M3 9.5h2.5v5H3M21 9.5h-2.5v5H21"/>',
    seat: '<path d="M7 11V6.5C7 5.1 8.1 4 9.5 4h5C15.9 4 17 5.1 17 6.5V11"/><path d="M5.5 11h13c.8 0 1.5.7 1.5 1.5V15H4v-2.5c0-.8.7-1.5 1.5-1.5ZM6 15v5M18 15v5"/>',
    corner: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M12 5v14"/><path d="M3.5 12.5a6.5 6.5 0 0 1 6.5 6.5"/><circle cx="6.2" cy="16.3" r="1.3" fill="currentColor" stroke="none"/>',
    hoop: '<rect x="5" y="3.5" width="14" height="9" rx="2"/><rect x="9.5" y="7" width="5" height="3" rx=".8"/><path d="M8.5 12.5h7l-1.2 7h-4.6l-1.2-7ZM10 15.5h4"/>',
    tv: '<path d="M8 2.5v3.5M16 2.5v3.5"/><rect x="4" y="6" width="16" height="2.6" rx="1"/><rect x="5.5" y="8.6" width="13" height="7.4" rx="1"/><path d="M7 16l1.4 3h7.2l1.4-3"/>',
    table: '<rect x="3" y="8.5" width="18" height="7" rx="1.6"/><path d="M6.5 12h11"/>',
    endwall: '<path d="M5 6.5 19 4.5v8.5L5 15V6.5Z"/><path d="M8 15v5M16 13.5v6.5M3.5 20.5h17"/>',
    // display assets
    glass: '<rect x="3" y="6.5" width="18" height="9" rx="2"/><path d="M7.5 6.5v9M12 6.5v9M16.5 6.5v9M6 20h12"/>',
    sign: '<rect x="3" y="8.5" width="18" height="7" rx="2"/><path d="M6 12h2M10 12h8"/>',
    billboard: '<rect x="3.5" y="4.5" width="17" height="10" rx="2"/><path d="M8 14.5v6M16 14.5v6M6 20.5h12"/>',
    subway: '<rect x="5.5" y="3.5" width="13" height="13" rx="3.5"/><path d="M5.5 10.5h13M9 13.5v.01M15 13.5v.01M8.5 16.5 6.5 20.5M15.5 16.5l2 4"/>',
    totem: '<rect x="7" y="3" width="10" height="14" rx="2"/><path d="M10 17v3.5h4V17M8.5 20.5h7"/>',
    banner: '<rect x="2.5" y="9" width="19" height="5" rx="1.5"/><path d="M5 9V4.5M19 9V4.5M2.5 19.5h19"/>',
    kiosk: '<rect x="7" y="3" width="10" height="15" rx="2"/><rect x="9" y="5" width="6" height="8" rx="1"/><path d="M6 21h12"/>',
    panel: '<rect x="8" y="4" width="8" height="14" rx="1.8"/><path d="M12 18v2.5"/>',
    ticket: '<path d="M4 7.5c0-.8.7-1.5 1.5-1.5h13c.8 0 1.5.7 1.5 1.5V10a2 2 0 0 0 0 4v2.5c0 .8-.7 1.5-1.5 1.5h-13c-.8 0-1.5-.7-1.5-1.5V14a2 2 0 0 0 0-4V7.5Z"/><path d="M14 6v12" stroke-dasharray="1.5 2"/>',
    tvTall: '<rect x="7" y="3.5" width="10" height="15" rx="2"/><path d="M12 18.5v2"/>',
    lwrap: '<rect x="3.5" y="5" width="17" height="11" rx="2"/><path d="M16 5v8M3.5 13h17"/>',
    screens: '<rect x="2.5" y="8" width="5.5" height="6" rx="1"/><rect x="9.25" y="8" width="5.5" height="6" rx="1"/><rect x="16" y="8" width="5.5" height="6" rx="1"/>',
    menu: '<path d="M7 3.5v6a2 2 0 0 0 4 0v-6M9 9.5v11M16 20.5v-17c-2 1-3 3.5-3 6.5v3h3"/>',
    tram: '<rect x="6" y="3.5" width="12" height="13" rx="3"/><path d="M6 10h12M9 13.5v.01M15 13.5v.01M9 16.5l-2 4M15 16.5l2 4"/>',
    elevator: '<rect x="4.5" y="3.5" width="15" height="17" rx="2"/><path d="m10 9 2-2.5L14 9M10 15l2 2.5 2-2.5"/>',
    bag: '<path d="M5.5 8h13l-1 12.5h-11L5.5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    ribbon: '<rect x="2.5" y="10" width="19" height="4" rx="1.5"/><path d="M6 12h3M12 12h6"/>',
    halfwall: '<path d="M5 6.5 19 4.5v8.5L5 15V6.5ZM12 5.5v8.5"/><path d="M8 15v5M16 13.5v6.5M3.5 20.5h17"/>',
    plus: '<path d="M12 6v12M6 12h12"/>',
    video: '<rect x="3" y="5.5" width="18" height="13" rx="3"/><path d="M10 9.5v5l4.5-2.5L10 9.5Z"/>',
    photo: '<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="8.5" cy="10" r="1.6"/><path d="m3.5 17 5-4.5 3.5 3 3-2.5 5.5 4.5"/>',
    trash: '<path d="M4.5 7h15M9.5 7V5.5c0-.8.7-1.5 1.5-1.5h2c.8 0 1.5.7 1.5 1.5V7M6.5 7l.8 11.6c.1 1 .9 1.9 2 1.9h5.4c1.1 0 1.9-.9 2-1.9L17.5 7M10 10.5v6M14 10.5v6"/>',
  };
  // Every display asset across both models: id → [page, short name, icon]. Names follow the content guide.
  const ASSETS = {
    oculus: ['index.html', 'Oculus', 'oval'], plazawall: ['index.html', 'Glass', 'glass'], logo: ['index.html', 'Venue sign', 'sign'],
    flatbush: ['index.html', 'Flatbush Ave wall board', 'billboard'], atlantic: ['index.html', 'Atlantic Ave wall board', 'billboard'],
    pavilion: ['index.html', 'Subway pavilion', 'subway'], 'totem-a': ['index.html', 'Plaza totem A', 'totem'], 'totem-b': ['index.html', 'Plaza totem B', 'totem'],
    atrium: ['inside.html', 'Atrium', 'banner'], 'wayfinding-full': ['inside.html', 'Wayfinding fullscreen', 'kiosk'],
    'wayfinding-alt': ['inside.html', 'Wayfinding alt ad', 'kiosk'], 'store-panel': ['inside.html', 'Store panel', 'panel'],
    'box-office-h': ['inside.html', 'Box office horizontal', 'ticket'], 'box-office-v': ['inside.html', 'Box office vertical', 'tvTall'],
    lwrap: ['inside.html', 'LWrap', 'lwrap'], '1x5': ['inside.html', '1x5 TV array', 'screens'], menu: ['inside.html', 'Menu', 'menu'],
    transit: ['inside.html', 'Transit data', 'tram'], elevator: ['inside.html', 'Elevator TV', 'elevator'],
    'team-store-1x2': ['inside.html', 'Team store 1x2', 'bag'], 'team-store-1x7': ['inside.html', 'Team store 1x7', 'bag'],
    'main-video': ['inside.html', 'Main video', 'tv'], 'upper-ring': ['inside.html', 'Upper ring', 'oval'],
    '360-ribbon': ['inside.html', '360 ribbon', 'ribbon'], 'sideline-ribbon': ['inside.html', 'Sideline ribbon', 'ribbon'],
    'endwall-full': ['inside.html', 'Full endwall', 'endwall'], 'endwall-half': ['inside.html', 'Half endwall', 'halfwall'],
    'scorers-nets': ['inside.html', 'Nets scorer’s table', 'table'], 'scorers-liberty': ['inside.html', 'Liberty scorer’s table', 'table'],
  };
  // [key, label, icon, display assets, description when it has none]. Each asset belongs to exactly one view.
  const NAV = [
    ['Exterior', 'index.html', [
      ['oculus', 'Oculus', 'oval', ['oculus', 'plazawall']],
      ['plaza', 'Plaza', 'plaza', ['totem-a', 'totem-b', 'pavilion']],
      ['atlantic', 'Atlantic Ave', 'road', ['atlantic']],
      ['flatbush', 'Flatbush Ave', 'road', ['flatbush']]]],
    ['Interior', 'inside.html', [
      ['Entrance', 'Entrance', 'door', ['wayfinding-full', 'wayfinding-alt', 'store-panel']],
      ['Lobby', 'Lobby', 'lobby', ['atrium', 'box-office-h', 'box-office-v']],
      ['Concourse', 'Concourse', 'shop', ['lwrap', '1x5', 'menu', 'transit', 'elevator', 'team-store-1x2', 'team-store-1x7']],
      ['Bowl', 'Bowl', 'court', ['360-ribbon', 'sideline-ribbon']],
      ['Scoreboard', 'Scoreboard', 'tv', ['main-video', 'upper-ring']],
      ['Courtside', 'Courtside', 'table', ['scorers-nets', 'scorers-liberty']],
      ['Endwall', 'Endwall', 'endwall', ['endwall-full', 'endwall-half']]]],
    ['Interior views', 'inside.html', [
      ['Lower bowl', 'Lower bowl', 'seat', []],
      ['Corner', 'Corner', 'corner', []],
      ['Baseline', 'Baseline', 'hoop', []]]],
  ];
  const here = location.pathname.endsWith('inside.html') ? 'inside.html' : 'index.html';
  const svg = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[name]}</svg>`;

  document.head.insertAdjacentHTML('beforeend', `<style>
    #nav { position: fixed; z-index: 4; left: 16px; top: 16px; bottom: 16px; width: 224px; overflow: auto; padding: 14px 10px;
           background: rgba(255,255,255,.78); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
           border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,.18); color: #0b0b0c;
           font: 14px/1.3 ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif; }
    #nav h3 { margin: 14px 10px 6px; font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: #6e6e73; }
    #nav h3:first-child { margin-top: 2px; }
    #nav > button { display: flex; align-items: flex-start; gap: 10px; width: 100%; padding: 8px 10px; border: 0; border-radius: 12px;
                  background: transparent; color: inherit; font: inherit; font-weight: 600; text-align: left; cursor: pointer; }
    #nav > button:hover { background: rgba(11,11,12,.07); }
    #nav > button:focus-visible { outline: 2px solid #ffb800; outline-offset: 1px; }
    /* selected (both sidebars): white card, subtle shadow, Barclays blue icon */
    #nav > button.on, #panel [data-id].selected, #panel [data-id].sel { background: #fff; color: #0b0b0c; border-color: transparent;
      box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 4px 14px rgba(0,0,0,.08); }
    #nav > button.on svg, #panel [data-id].selected .asset-ic, #panel [data-id].sel .asset-ic { color: #00aeef; }
    #nav .t { display: grid; gap: 2px; min-width: 0; flex: 1; }
    #nav .num { flex: none; align-self: center; width: 22px; height: 22px; border-radius: 999px; display: grid; place-items: center;
                background: rgba(11,11,12,.08); color: #0b0b0c; font-size: 11.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
    #nav > button small { font-size: 11.5px; font-weight: 500; line-height: 1.3; color: #6e6e73; }
    #nav > button svg, #panel .asset-ic, #panel .asset-add svg { flex: none; width: 20px; height: 20px; fill: none; stroke: currentColor;
                  stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
    #nav > button svg { margin-top: 1px; }
    /* bottom-right controls (both pages): frosted card like the sidebars; selected segment = white card + blue icon */
    #controls .seg, #controls .btn, #views .bar { background: rgba(255,255,255,.78); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
      border: 0; border-radius: 16px; padding: 4px; gap: 2px; box-shadow: 0 12px 40px rgba(0,0,0,.18); color: #0b0b0c;
      font-family: ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif; }
    #controls .btn { padding: 11px; border-radius: 999px; }   /* single buttons: circles */
    #controls .seg, #views .bar { border-radius: 999px; }      /* segmented controls: pills */
    #controls .seg button, #views .bar button { border-radius: 999px !important; }
    #controls .seg button, #views .bar button { border-radius: 12px; color: #0b0b0c; font-family: inherit; }
    #controls .seg button:hover:not(.on), #views .bar button:hover:not(.on), #controls .btn:hover { background: rgba(11,11,12,.07); }
    #controls .seg button.on, #views .bar button.on { background: #fff; color: #0b0b0c; box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 4px 14px rgba(0,0,0,.08); }
    #controls .seg button.on svg { color: #00aeef; }
    /* Display Assets panel rows (both pages) */
    #panel [data-id] { display: grid !important; grid-template-columns: 20px minmax(0, 1fr) 30px; gap: 10px; align-items: start; }
    #panel [data-id][hidden], #panel .ov-row[hidden] { display: none !important; }
    #panel .ov-row { display: grid !important; grid-template-columns: 20px minmax(0, 1fr) 30px; gap: 10px; align-items: start; box-sizing: border-box; width: 100%; text-align: left; outline: none; font: inherit; color: inherit; cursor: pointer; }
    #panel .ov-row:focus-visible { outline: 2px solid #ffb800; outline-offset: 1px; }
    #panel .ov-row.sel { border-color: transparent; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 4px 14px rgba(0,0,0,.08); }
    #panel .ov-row.sel .asset-ic { color: #00aeef; }
    #panel .ov-row small { display: block; font-size: 12px; color: #6e6e73; }
    #panel .asset-ic { margin-top: 1px; color: #3a3a3e; }
    #panel .asset-body { min-width: 0; }
    #panel .file-name { display: flex; align-items: center; gap: 5px; min-width: 0; }
    #panel .file-name svg { flex: none; width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; color: #6e6e73; }
    #panel .file-name span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    #panel .asset-add { width: 30px; height: 30px; border-radius: 999px; border: 0; padding: 0; display: grid; place-items: center; cursor: pointer;
                        background: rgba(11,11,12,.07); color: #0b0b0c; }
    #panel .asset-add:hover { background: rgba(11,11,12,.13); }
    #panel .asset-add:focus-visible { outline: 2px solid #ffb800; outline-offset: 1px; }
    #panel .loaded .asset-add { color: #e5372b; }   /* delete: grey button, red icon */
    #panel .ad-actions label.btn { display: none; }
    #panel [data-act=clear] { display: none; }   /* the row's delete button replaces Clear */
    #panel .ad-head, #panel .row .h { display: block; }
    #panel .meta { display: flex; align-items: flex-start; gap: 6px; margin-top: 4px; min-width: 0; font-size: 12px; line-height: 1.35; color: #6e6e73; font-weight: 500; }
    #panel .meta > svg { flex: none; margin-top: 1px; width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    #panel .meta-t { flex: 1; min-width: 0; margin: 0; font-size: inherit; color: inherit; overflow: hidden; text-overflow: ellipsis; }
    #panel .meta .meta-num { flex: none; width: 46px; height: 24px; margin-left: auto; padding: 0 6px; border: 0; border-radius: 8px;
      background: rgba(11,11,12,.07); color: #0b0b0c; font: inherit; font-weight: 700; text-align: right; }
    #panel .file-line .file-name { gap: 6px; }
    #panel .file-line { color: #6e6e73; }
    #panel .meta:has(.meta-num) { align-items: center; margin-top: 2px; }   /* tile: label left, number right */
    #panel .meta:has(.meta-num) > svg { margin-top: 0; }
    #panel .empty-actions { display: none !important; }
    body.has-nav #title { left: 260px !important; }
  </style>`);

  // ---------- left sidebar ----------
  const nav = document.createElement('nav'); nav.id = 'nav'; nav.setAttribute('aria-label', 'Views');
  const views = {};
  for (const [heading, page, items] of NAV) {
    nav.insertAdjacentHTML('beforeend', `<h3>${heading}</h3>`);
    for (const [key, label, icon, ids, desc] of items) {
      const b = document.createElement('button'); b.dataset.key = page + '#' + key;
      const sub = desc || '';
      b.innerHTML = `${svg(icon)}<span class="t"><span>${label}</span>${sub ? `<small>${sub}</small>` : ''}</span>${ids.length ? `<span class="num" title="${ids.length} display${ids.length === 1 ? '' : 's'}">${ids.length}</span>` : ''}`;
      b.onclick = () => page === here ? go(key) : (location.href = page + '#' + encodeURIComponent(key));
      nav.append(b); views[page + '#' + key] = { ids };
    }
  }
  document.body.append(nav); document.body.classList.add('has-nav');

  // ---------- Display Assets panel ----------
  const panel = document.getElementById('panel');
  const rows = () => [...panel.querySelectorAll('[data-id]')];
  for (const row of rows()) {
    const a = ASSETS[row.dataset.id]; if (!a) continue;
    const name = row.querySelector('.ad-name'); if (name) name.textContent = a[1];   // outside rows: use the guide's names
    const body = document.createElement('div'); body.className = 'asset-body'; body.append(...row.childNodes);
    const add = document.createElement('button'); add.type = 'button'; add.className = 'asset-add';
    // + opens the file picker; once a design is in, the same button deletes it (via the page's own Clear)
    add.onclick = e => { e.stopPropagation(); row.querySelector(row.classList.contains('loaded') ? '[data-act=clear]' : 'input[type=file]')?.click(); };
    row.append(body, add); row.insertAdjacentHTML('afterbegin', svg(a[2]).replace('<svg', '<svg class="asset-ic"'));
    // attributes under the name, one uniform line each: icon · text (· control on the right)
    const line = (icon, ...kids) => { const l = document.createElement('div'); l.className = 'meta';
      l.insertAdjacentHTML('afterbegin', svg(icon)); l.append(...kids); return l; };
    const head = body.querySelector('.ad-head, .h'), dims = body.querySelector('.ad-dims, .d'), note = body.querySelector('.n'), file = body.querySelector('.ad-file, .f');
    const lines = [];
    if (dims) { const t = document.createElement('span'); t.className = 'meta-t'; t.textContent = dims.textContent; dims.remove(); lines.push(line('ruler', t)); }
    if (note) { note.classList.add('meta-t'); lines.push(line('info', note)); }
    head.after(...lines);
    if (file) file.classList.add('meta', 'file-line');
    const rep = body.querySelector('label.rep');
    if (rep) { const input = rep.querySelector('input'), t = document.createElement('span'); t.className = 'meta-t'; t.textContent = 'Tile';
      input.classList.add('meta-num'); body.append(line('tile', t, input)); rep.remove(); }
    body.querySelector('.ad-actions')?.classList.add('empty-actions');
  }
  // Overview row at the top of the list: the area's own wide camera shot, not tied to a display
  const first = rows()[0], ov = document.createElement('button'); ov.type = 'button';
  ov.className = first.className.replace(/\b(loaded|selected|sel)\b/g, '') + ' ov-row';
  ov.innerHTML = `${svg('globe').replace('<svg', '<svg class="asset-ic"')}<span class="asset-body"><b>Overview</b><small>Wide shot of this area</small></span>`;
  first.before(ov);
  let current;
  ov.onclick = () => { panel.querySelectorAll('[data-id].selected, [data-id].sel').forEach(r => r.classList.remove('selected', 'sel')); ov.classList.add('sel'); (window.frameAds && views[here + '#' + current]?.ids.length ? window.frameAds(views[here + '#' + current].ids) : window.goView?.(current)); };
  panel.addEventListener('click', e => { if (e.target.closest('[data-id]')) ov.classList.remove('sel'); });
  // designs added on this page (remembered per page)
  const store = (page, ids) => { try { if (ids) localStorage.setItem('adscout:' + page, JSON.stringify(ids)); return JSON.parse(localStorage.getItem('adscout:' + page) || '[]'); } catch { return ids || []; } };
  function refresh() {
    const loaded = rows().filter(r => r.classList.contains('loaded')).map(r => r.dataset.id);
    for (const r of rows()) {
      const on = r.classList.contains('loaded'), btn = r.querySelector('.asset-add');
      if (!btn || btn.dataset.on === String(on)) continue;
      btn.dataset.on = on; btn.innerHTML = svg(on ? 'trash' : 'plus');
      btn.setAttribute('aria-label', (on ? 'Delete design for ' : 'Add design for ') + ASSETS[r.dataset.id][1]);
      btn.title = on ? 'Delete this design' : 'Add a design';
    }
    // file line: a video or photo icon instead of the pages' "▶ " prefix (app.js rewrites this text on every load)
    for (const r of rows()) {
      const f = r.querySelector('.ad-file, .f'); if (!f || !r.classList.contains('loaded')) continue;
      const text = f.textContent; if (f.dataset.shown === text) continue;
      const video = text.startsWith('▶ ') || /\.(mp4|mov|webm|m4v)$/i.test(text), name = text.replace(/^▶ /, '');
      f.innerHTML = `<span class="file-name">${svg(video ? 'video' : 'photo')}<span></span></span>`;
      f.querySelector('span span').textContent = name; f.title = name; f.dataset.shown = f.textContent;
    }
    store(here, loaded);
    const otherLoaded = store(here === 'index.html' ? 'inside.html' : 'index.html');
  }
  new MutationObserver(refresh).observe(panel, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });

  // ---------- views ----------
  function mark(key) {
    nav.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.key === here + '#' + key));
    // views with no placements of their own (seat and roof views) list every screen on the page
    const v = views[here + '#' + key]; current = key; ov.hidden = !(v?.ids.length > 1);   // one display: its row is the view
    if (v) for (const r of rows()) r.hidden = v.ids.length > 0 && !v.ids.includes(r.dataset.id);
    window.placeSheet?.();
  }
  // a view opens on its Overview shot; a view with a single display opens on that display
  function go(key) {
    mark(key);
    const v = views[here + '#' + key], one = v?.ids.length === 1 && panel.querySelector(`[data-id="${v.ids[0]}"] .asset-body`);
    one ? one.click() : ov.hidden ? window.goView?.(key) : ov.click();
  }
  window.markView = mark;
  // ---------- "full screen": hides every panel and control except its own exit button (no browser full screen) ----------
  document.head.insertAdjacentHTML('beforeend', `<style>
    /* the bottom-right actions share one pill; each button gets its own round background on hover */
    #actions { position: fixed; z-index: 6; right: 20px; bottom: 20px; display: flex; gap: 2px; padding: 4px; border-radius: 999px;
      background: rgba(255,255,255,.78); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: 0 12px 40px rgba(0,0,0,.18); }
    #actions button { width: 34px; height: 34px; padding: 0; border: 0; border-radius: 999px; display: grid; place-items: center; cursor: pointer;
      color: #0b0b0c; background: transparent !important; box-shadow: none !important; backdrop-filter: none !important; transition: background-color .15s; }
    #actions button:hover { background: rgba(11,11,12,.08) !important; }
    #actions button:focus-visible { outline: 2px solid #ffb800; outline-offset: 1px; }
    #actions svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; display: block; }
    body.has-nav #controls, body.has-nav #views { right: 104px !important; }   /* the rest sits to the left of the actions pill */
    /* full screen: sidebars slide out to their own side, the rest fades away */
    #nav, #panel, #panel-toggle, #controls, #views { transition: transform .45s cubic-bezier(.22,1,.36,1), opacity .35s ease; }
    body.clean #nav { transform: translateX(calc(-100% - 40px)) !important; pointer-events: none; }
    body.clean #panel, body.clean #panel-toggle { transform: translateX(calc(100% + 40px)) !important; pointer-events: none; }
    body.clean #panel-toggle { transform: translateX(400px) !important; }
    body.clean #controls, body.clean #views { opacity: 0 !important; transform: translateY(16px) !important; pointer-events: none; }
    body.clean #title, body.clean #hint, body.clean #actions > :not(#fs-btn) { display: none !important; }
  </style>`);
  const FS_ON = '<path d="M4 9V4.5h4.5M15.5 4.5H20V9M20 15v4.5h-4.5M8.5 19.5H4V15"/>';
  const FS_OFF = '<path d="M8.5 4v4.5H4M20 8.5h-4.5V4M15.5 20v-4.5H20M4 15.5h4.5V20"/>';
  const actions = document.createElement('div'); actions.id = 'actions'; actions.setAttribute('role', 'group'); actions.setAttribute('aria-label', 'View actions');
  document.getElementById('reset-view')?.remove();   // recenter button not wanted
  for (const id of ['export']) { const b = document.getElementById(id); if (b) actions.append(b); }   // outside page only
  const fs = document.createElement('button'); fs.id = 'fs-btn'; fs.type = 'button'; actions.append(fs); document.body.append(actions);
  if (actions.children.length === 1) document.head.insertAdjacentHTML('beforeend', '<style>body.has-nav #views { right: 72px !important; }</style>');
  const setClean = on => { document.body.classList.toggle('clean', on);
    fs.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${on ? FS_OFF : FS_ON}</svg>`;
    fs.title = on ? 'Exit full screen' : 'Full screen'; fs.setAttribute('aria-label', fs.title);
    dispatchEvent(new Event('resize')); };
  // only hides the interface; the browser window stays as it is
  fs.onclick = () => setClean(!document.body.classList.contains('clean'));
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('clean')) setClean(false); });
  setClean(false);
  // mouse: drag moves the view, Option-drag pivots it (MOUSE.ROTATE = 0, MOUSE.PAN = 2 in three.js)
  addEventListener('pointerdown', e => {
    const c = window.__barclays?.controls || (typeof controls !== 'undefined' ? controls : null);   // outside app / inside page
    if (c?.mouseButtons) c.mouseButtons.LEFT = e.altKey ? 0 : 2;
  }, true);
  const want = decodeURIComponent(location.hash.slice(1));
  if (want) { mark(want); setTimeout(() => go(want), here === 'index.html' ? 1800 : 50); }
  else mark(here === 'inside.html' ? 'Bowl' : 'oculus');   // each model's opening view
  refresh();

  // ---------- phones: the left sidebar becomes a bottom sheet; the Display list nests under the chosen view ----------
  document.head.insertAdjacentHTML('beforeend', `<style>
    #nav > #sheet-head { display: none; }
    @media (max-width: 720px) {
      body.has-nav #nav { left: 0; right: 0; top: auto; bottom: 0; width: auto; max-height: 74vh; padding: 0 12px calc(14px + env(safe-area-inset-bottom));
        border-radius: 22px 22px 0 0; overflow-y: auto; overscroll-behavior: contain; transform: translateY(calc(100% - 58px - env(safe-area-inset-bottom)));
        transition: transform .4s cubic-bezier(.22,1,.36,1); }
      body.has-nav #nav:not(.open) { overflow: hidden; }
      body.has-nav #nav.open { transform: none; }
      #nav > #sheet-head { display: flex; position: sticky; top: 0; z-index: 1; align-items: center; gap: 10px; width: calc(100% + 24px); margin: 0 -12px 4px;
        padding: 16px 22px 12px; border: 0; background: inherit; color: inherit; font: inherit; font-weight: 700; font-size: 15px; text-align: left; cursor: pointer; }
      #sheet-head::before { content: ''; position: absolute; top: 6px; left: 50%; width: 36px; height: 5px; margin-left: -18px; border-radius: 3px; background: rgba(11,11,12,.2); }
      #sheet-head .lbl { flex: 1; }
      #sheet-head svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; transition: transform .3s; }
      #nav.open #sheet-head .chev { transform: rotate(180deg); }
      #sheet-head .cur { color: #00aeef; }
      /* the Display panel, re-seated inside the sheet under the selected view */
      #nav #panel { position: static !important; inset: auto !important; width: auto !important; max-height: none !important; margin: 4px 0 10px 30px;
        transform: none !important; opacity: 1 !important; pointer-events: auto !important; display: block; background: none; border: 0; box-shadow: none;
        backdrop-filter: none; -webkit-backdrop-filter: none; border-radius: 0; }
      #nav #panel header, #nav #panel footer { display: none; }
      #nav #ad-list, #nav #list { overflow: visible; max-height: none; padding: 0; }
      body.has-nav #panel-toggle { display: none !important; }
      /* controls that lived bottom-right sit top-right */
      body.has-nav #actions { top: calc(12px + env(safe-area-inset-top)); bottom: auto; right: 12px; }
      body.has-nav #controls, body.has-nav #views { top: calc(12px + env(safe-area-inset-top)) !important; bottom: auto !important; right: 96px !important; }
      body.has-nav #views { right: 60px !important; }
      body.clean #nav { transform: translateY(calc(100% + 20px)) !important; }
      body.clean #controls, body.clean #views { transform: translateY(-16px) !important; }
    }
  </style>`);
  const mq = matchMedia('(max-width: 720px)'), home = { parent: panel.parentNode, next: panel.nextSibling };
  const head = document.createElement('button'); head.id = 'sheet-head'; head.type = 'button'; head.setAttribute('aria-expanded', 'false');
  head.innerHTML = `<span class="lbl"></span><svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>`;
  nav.prepend(head);
  const setOpen = on => { nav.classList.toggle('open', on); head.setAttribute('aria-expanded', on); };
  head.onclick = () => setOpen(!nav.classList.contains('open'));
  window.placeSheet = () => {
    const on = nav.querySelector(':scope > button.on');
    if (mq.matches) {
      panel.classList.remove('collapsed');
      if (on) on.after(panel); else nav.append(panel);
      head.querySelector('.lbl').innerHTML = on ? `<span class="cur">${on.querySelector('.t span').textContent}</span> · ${panel.querySelectorAll('[data-id]:not([hidden])').length} displays` : 'Views';
    } else if (panel.parentNode !== home.parent) home.parent.insertBefore(panel, home.next);
  };
  // picking a view keeps the sheet open to show its displays; picking a display (or Overview) drops it to show the screen
  nav.addEventListener('click', e => {
    if (!mq.matches || !e.isTrusted) return;   // ignore the clicks a view makes on its own Overview row
    const b = e.target.closest('button');
    if (b && b.parentNode === nav && b !== head) setOpen(true);
    else if (e.target.closest('#panel') && (e.target.closest('.ov-row') || (e.target.closest('[data-id]') && !e.target.closest('button, input, label')))) setTimeout(() => setOpen(false), 120);
  });
  mq.addEventListener('change', () => { setOpen(false); window.placeSheet(); });
  window.placeSheet();
})();

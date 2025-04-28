// main.js

let airports = [], categories = [], regions = [];
let colorScaleCat, colorScaleReg;
let map, markersLayer;

// ─── Bootstrap ──────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // 1) Load CSV
  d3.csv('data/airports.csv', parseRow)
    .then(data => {
      airports = data.filter(d => !isNaN(d.lat) && !isNaN(d.lon));
      categories = Array.from(new Set(airports.map(d => d.type))).sort();
      regions    = Array.from(new Set(airports.map(d => d.continent))).sort();
      colorScaleCat = d3.scaleOrdinal(categories, d3.schemeCategory10);
      colorScaleReg = d3.scaleOrdinal(regions,    d3.schemeCategory10);

      initMap();
      setupFilters();
      initChart();
      setupSearch();
      setupThemeSelector();
      renderAll();
    })
    .catch(err => {
      console.error('Error loading data/airports.csv:', err);
      // Optionally show a user-facing message here
    });
});

// ─── Parse each row ─────────────────────────────
function parseRow(d) {
  return {
    id:        d.id,
    name:      d.name,
    type:      d.type,
    city:      d.municipality,
    country:   d.iso_country,
    region:    d.iso_region,
    continent: d.continent,
    iata:      d.iata_code,
    lat:       +d.latitude_deg,
    lon:       +d.longitude_deg
  };
}

// ─── Initialize Leaflet map ────────────────────
function initMap() {
  map = L.map('map', {
    minZoom: 1, maxZoom: 18,
    worldCopyJump: false,
    maxBounds: [[-90, -180], [90, 180]],
    maxBoundsViscosity: 1
  }).setView([0, 0], 1);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    noWrap: true
  }).addTo(map);

  // Use FeatureGroup so getBounds() exists
  markersLayer = L.featureGroup().addTo(map);
}

// ─── Setup category filter & legend ────────────
function setupFilters() {
  const dd = document.getElementById('categoryFilter'),
        lg = document.getElementById('legend');

  dd.innerHTML = `<option value="All">All</option>`;
  categories.forEach(cat => {
    dd.append(new Option(cat, cat));
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <span class="legend-color" style="background:${colorScaleCat(cat)}"></span>
      <span>${cat}</span>
    `;
    lg.append(item);
  });

  dd.onchange = renderAll;
}

// ─── Initialize D3 chart ───────────────────────
function initChart() {
  const svg       = d3.select('#chart').append('svg'),
        margin    = { top:20, right:20, bottom:40, left:40 },
        listEl    = document.getElementById('chartList'),
        chartType = document.getElementById('chartType');

  chartType.onchange = drawChart;
  window.addEventListener('resize', drawChart);

  function drawChart() {
    try {
      const mode = chartType.value,            // 'category' or 'region'
            keys = mode==='category'? categories : regions,
            scale = mode==='category'? colorScaleCat : colorScaleReg;

      const data = keys.map(k => ({
        key: k,
        count: airports.filter(d =>
          mode==='category'? d.type===k : d.continent===k
        ).length
      }));

      const W  = document.getElementById('chart').clientWidth,
            H  = document.getElementById('chart').clientHeight,
            IW = W - margin.left - margin.right,
            IH = H - margin.top - margin.bottom;

      svg.attr('width', W).attr('height', H).selectAll('*').remove();
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      // Axes
      const x = d3.scaleBand().domain(keys).range([0,IW]).padding(0.1),
            y = d3.scaleLinear().domain([0,d3.max(data,d=>d.count)]).nice().range([IH,0]);

      g.append('g').call(d3.axisLeft(y));
      g.append('g')
       .attr('transform', `translate(0,${IH})`)
       .call(d3.axisBottom(x))
       .selectAll('text')
       .attr('transform','rotate(-45)')
       .style('text-anchor','end');

      // Bars
      g.selectAll('.bar')
       .data(data)
       .enter().append('rect')
         .attr('class','bar')
         .attr('x', d=>x(d.key))
         .attr('y', d=>y(d.count))
         .attr('width', x.bandwidth())
         .attr('height', d=>IH - y(d.count))
         .attr('fill', d=>scale(d.key))
         .style('cursor','pointer')
         .on('click', d => fillChartList(mode, d.key));
    } catch(err) {
      console.error('Error drawing chart:', err);
    }
  }

  function fillChartList(mode, key) {
    listEl.innerHTML = '';
    airports
      .filter(d => mode==='category'? d.type===key : d.continent===key)
      .sort((a,b)=>a.name.localeCompare(b.name))
      .forEach(d => {
        const li = document.createElement('li');
        li.textContent = d.name;
        li.style.borderLeft = `6px solid ${
          mode==='category'? colorScaleCat(d.type) : colorScaleReg(d.continent)
        }`;
        li.onclick = () => showDetails(d);
        listEl.append(li);
      });
  }

  drawChart();
}

// ─── Search box handling ───────────────────────
function setupSearch() {
  document.getElementById('airportSearch')
    .addEventListener('input', renderAll);
}

// ─── Theme selection ───────────────────────────
function setupThemeSelector() {
  const sel   = document.getElementById('themeSelector'),
        saved = localStorage.getItem('theme') || 'light';

  document.body.classList.toggle('dark', saved==='dark');
  sel.value = saved;

  sel.onchange = () => {
    const t = sel.value;
    document.body.classList.toggle('dark', t==='dark');
    localStorage.setItem('theme', t);
  };
}

// ─── Full UI redraw ───────────────────────────
function renderAll() {
  renderMap();
  renderList();
  clearDetails();
  document.getElementById('chartList').innerHTML = '';
}

// ─── Helpers ──────────────────────────────────
function filteredAirports() {
  const cat = document.getElementById('categoryFilter').value,
        q   = document.getElementById('airportSearch').value.toLowerCase();
  return airports.filter(d =>
    (cat==='All' || d.type===cat) &&
    d.name.toLowerCase().includes(q)
  );
}

// ─── Map rendering ────────────────────────────
function renderMap() {
  markersLayer.clearLayers();
  const subset = filteredAirports();

  subset.forEach(d => {
    const m = L.circleMarker([d.lat, d.lon], {
      radius:      6,
      fillColor:   colorScaleCat(d.type),
      color:       '#000',
      weight:      1,
      fillOpacity: 0.8
    }).addTo(markersLayer);

    m.bindTooltip(d.iata || d.name, { direction:'top', opacity:0.9 });
    m.on('click', () => {
      map.setView([d.lat, d.lon], 10, { animate:true });
      showDetails(d);
    });
  });

  // Make sure the map fully fits its container
  map.invalidateSize();
  if (subset.length) {
    map.fitBounds(markersLayer.getBounds().pad(0.2), { animate:false });
  }
}

// ─── List rendering ───────────────────────────
function renderList() {
  const ul = document.getElementById('airportList');
  ul.innerHTML = '';
  filteredAirports()
    .sort((a,b)=>a.name.localeCompare(b.name))
    .forEach(d => {
      const li = document.createElement('li');
      li.textContent = d.name;
      li.style.borderLeft = `6px solid ${colorScaleCat(d.type)}`;
      li.onclick = () => {
        map.setView([d.lat, d.lon], 10, { animate:true });
        showDetails(d);
      };
      ul.append(li);
    });
}

// ─── Details panel ───────────────────────────
function clearDetails() {
  const box = document.getElementById('detailsBox');
  box.innerHTML = `<em>Click an airport on the map, list, or chart to see details here.</em>`;
  document.querySelectorAll('li').forEach(li => li.classList.remove('active'));
}

function showDetails(d) {
  clearDetails();
  document.querySelectorAll('li').forEach(li => {
    if (li.textContent === d.name) li.classList.add('active');
  });

  document.getElementById('detailsBox').innerHTML = `
    <h3>${d.name}</h3>
    <p><strong>IATA:</strong> ${d.iata || 'N/A'}</p>
    <p><strong>Type:</strong> ${d.type}</p>
    <p><strong>Location:</strong> ${d.city}, ${d.country}</p>
    <p><strong>Continent:</strong> ${d.continent}</p>
    <p><strong>Coords:</strong> ${d.lat.toFixed(4)}, ${d.lon.toFixed(4)}</p>
  `;
}


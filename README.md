# Global Airports Dashboard

**Live Demo:**  
https://rohanbalixz.github.io/global_airport_dashboard/

---

## Title of the Work
Global Airports Dashboard – Interactive Visualization of Global Airports

## Group Member
- Rohan Bali

---

## Description & Task
**What:** An interactive dashboard visualizing global airport locations, types, and regional distributions.  
**Why:** To enable intuitive exploration of aviation infrastructure and geographic trends.  
**How:** Uses Leaflet.js for mapping, D3.js for charts, with dynamic filtering and search.

---

## Project Structure
```plaintext
global_airport_dashboard/
├── index.html           # Main application page
├── style.css            # Dashboard styling
├── main.js              # Data loading & UI logic
├── data/
│   └── airports.csv     # OpenFlights airport dataset (CSV)
├── screenshots/
│   └── Screenshot 2025-04-28 at 18.50.41.png  # Example screenshot
└── README.md            # This file
```

---

## Installation & Running Locally
1. **Clone repository**  
   ```bash
   git clone https://github.com/rohanbalixz/global_airport_dashboard.git
   cd global_airport_dashboard
   ```
2. **Start a local HTTP server** (required for CSV loading)  
   - **Python 3:**  
     ```bash
     python3 -m http.server 8000
     ```
   - **Node.js (optional):**  
     ```bash
     npm install -g http-server
     http-server -p 8000
     ```
3. **Open in browser**  
   Navigate to `http://localhost:8000/`

> Direct file access (`file://`) may block CSV loading due to browser security policies.

---

## Usage & Visualization Details
- **Map Panel:**  
  - Circle markers represent airports, colored by category.  
  - Click a marker to view details in the side panel.  
- **Airport List:**  
  - Scrollable and searchable, each item’s border color matches its map marker.  
  - Clicking a list item centers the map on that airport.  
- **Details Panel:**  
  - Displays name, IATA code, type, city, country, continent, and coordinates.  
- **Distribution Chart:**  
  - Bar chart of counts by category or continent.  
  - **X-axis:** Categories (or continents) labels  
  - **Y-axis:** Number of airports  
  - Click a bar to list all airports in that group.  
- **Filters & Themes:**  
  - Dropdown filters by category.  
  - Text input filters by name.  
  - Light/Dark mode toggle via CSS variables.

---

## Screenshot
![Dashboard Screenshot](screenshots/Screenshot%202025-04-28%20at%2018.50.41.png)

---

## Deployment
Automated via GitHub Pages:  
Pushes to `main` publish to:  
https://rohanbalixz.github.io/global_airport_dashboard/

---

## Technology Stack
- **HTML5** & **CSS3**  
- **JavaScript (ES6+)**  
- **D3.js v7** for CSV parsing, scales, axes, and charts  
- **Leaflet.js v1.9.3** for interactive mapping  
- **OpenStreetMap** tile layers

---

## Future Enhancements
- Marker clustering for high-density regions  
- Integration of real-time flight traffic and route data  
- CSV/JSON export of filtered subsets  
- Mobile-responsive UI with touch gestures

---

## Contributing
Contributions welcome! Please open issues or submit PRs for bugs and features.

---

## License
Licensed under the MIT License. See [LICENSE](LICENSE) for details.


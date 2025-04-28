# Global Airports Dashboard

**Live Demo:**
https://rohanbalixz.github.io/global_airport_dashboard/

## Title of the Work
Global Airports Dashboard – Interactive Visualization of Global Airports

## Group Members
- Rohan Bali

## Description & Task
**What:** An interactive dashboard visualizing global airport locations, categories, and regional distributions.
**Why:** To provide an intuitive tool for exploring aviation infrastructure and geographic patterns.
**How:** Uses Leaflet.js for mapping and D3.js for charts, with real‑time filtering and search.

## Project Structure
```plaintext
global_airport_dashboard/
├── index.html           # Main HTML page
├── style.css            # Dashboard styles
├── main.js              # Data loading and UI logic
├── data/
│   └── airports.csv     # OpenFlights airport dataset
└── README.md            # This file
```

## How to Run the Project
This is a **static** web project requiring only an HTTP server:

1. **Clone repository**
   ```bash
   git clone https://github.com/rohanbalixz/global_airport_dashboard.git
   cd global_airport_dashboard
   ```
2. **Install requirements** (optional: Node.js serves as well):
   - **Python 3**
     ```bash
     python3 -m http.server 8000
     ```
   - **Node.js** (if preferred)
     ```bash
     npm install -g http-server
     http-server -p 8000
     ```
3. **Open in browser**
   Navigate to `http://localhost:8000/`

> **Note:** Loading via `file://` may block the CSV load due to browser security policies.

## Reading the Visualization
- **Map Panel**: Plots airports as circle markers; color = airport category (e.g., large, medium, small). Clicking a marker shows details.
- **Airport List**: Scrollable list; each item’s left border color matches its category. Click to center map on that airport.
- **Details Panel**: Displays selected airport’s name, IATA code, type, city, country, continent, and latitude/longitude.
- **Distribution Chart**: Bar chart showing counts by category or continent.
  - **X-axis**: Categories (or continents) labels
  - **Y-axis**: Number of airports
  - **Bar color**: Matches map legend (same color scale)
  - Click a bar to list all airports in that group.

## Visualization Idioms
- **Color encoding**: Consistent ordinal scale for categories and continents
- **Interaction**: Click-based selection, search filtering, dropdown filters
- **Layout**: Flexbox panels with fixed-aspect map

## Screenshot of the Framework
![Dashboard Screenshot](./screenshot.png)

## Full Project Code and Libraries
All source code is included in the repository. External libraries are loaded via CDN:
- **D3.js v7**
- **Leaflet.js v1.9.3**
- **OpenStreetMap** tiles

## Deployment URL
https://rohanbalixz.github.io/global_airport_dashboard/

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

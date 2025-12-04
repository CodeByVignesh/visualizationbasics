# Programming Assignment 2 - Implementation Documentation

## Overview
This document provides a detailed explanation of the implementation for Programming Assignment 2. I implemented two main visualization components: **Countries** (to display world map geography) and **Bubbles** (to visualize missing migrants data as proportionally-sized circles).

---

## Task 1: Countries Component Implementation

### Location: `static_content.js` (Lines 64-77)

### Implementation Code:

```javascript
const Countries = ({ 
    worldAtlas: {land, interiors}, 
}) => 
(
    <g className="countries">
        {
            <>
                {
                    land.features.map((feature, index) => (
                        <path key={index} className="land" d={path(feature)} />
                    ))
                }
                <path className="interiors" d={path(interiors)} />
            </>
        }
    </g>
);
```

### Technical Explanation:

#### 1. Props Destructuring:
- The component receives `worldAtlas` object and immediately destructures it into `land` and `interiors`
- This is a React best practice for cleaner code and direct access to nested properties
- Syntax: `{ worldAtlas: {land, interiors} }` extracts nested properties in one step

#### 2. Land Masses Rendering:
- `land.features` is an array of GeoJSON features representing continents and islands
- `.map((feature, index) => ...)` iterates through each geographic feature
- Each feature is converted to an SVG `<path>` element using the `path()` generator (defined earlier in the file)
- The `path()` function uses the `d3.geoNaturalEarth1()` projection to convert geographic coordinates (latitude/longitude) to screen coordinates (x, y pixels)
- `key={index}` is required by React to efficiently track and re-render list items

#### 3. Country Borders (Interiors):
- `interiors` contains the mesh of internal borders between countries
- A single `<path>` element draws all country boundaries at once
- This is more efficient than drawing individual borders for each country pair

#### 4. CSS Styling Applied:
```css
.countries .land {
    fill: #ececec;  /* Light gray for continents */
}
.countries .interiors {
    fill: none;
    stroke: #d9dfe0;  /* Slightly darker gray for borders */
}
```

---

## Task 2: Bubbles Component Implementation

### Location: `bubbles.js`

### Implementation Code:

```javascript
// Accessor function
const sizeValue = d => d['Total Dead and Missing'];

const maxRadius = 15;

const Bubbles = ({ data }) => {
    
    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(data, sizeValue)])
        .range([0, maxRadius]);

    return (
        <g className="bubbleMarks">
            {
                data.map((d, index) => {
                    const [x, y] = projection(d.coords);
                    return (
                        <circle 
                            key={index}
                            cx={x}
                            cy={y}
                            r={sizeScale(sizeValue(d))}
                        />
                    );
                })
            }
        </g>
    );
};
```

### Technical Explanation:

#### 1. Accessor Function (`sizeValue`):
- Extracts the 'Total Dead and Missing' value from each data row
- Following D3 conventions of using accessor functions for data mapping
- Promotes code reusability and clarity
- Arrow function syntax: `d => d['Total Dead and Missing']`

#### 2. Scale Selection - Why `scaleSqrt()` instead of `scaleLinear()`:

This is a **critical visualization design decision**:

- **Human perception**: We perceive the AREA of circles, not their radius
- **Mathematical relationship**: Circle area = πr²
- **Problem with linear scale**: If radius is linear, area grows quadratically (r²), making differences appear exaggerated
  - Example: If one value is 2x another, the circle would appear 4x larger
- **Solution with sqrt scale**: Square root scale ensures that circle AREA is proportional to data values
  - If value doubles, area doubles (not quadruples)
  - This provides accurate visual representation
  - Formula: If we want area ∝ value, then r ∝ √value

#### 3. Domain and Range Configuration:
- **Domain**: `[0, d3.max(data, sizeValue)]`
  - The range of input data values
  - Starts at 0, ends at maximum number of casualties in the dataset
  - `d3.max(data, sizeValue)` finds the maximum by applying sizeValue to each row
- **Range**: `[0, maxRadius]`
  - The range of output radii in pixels
  - Starts at 0 (no casualties = invisible circle)
  - Ends at 15 pixels (maximum casualties = largest visible circle)
- The scale function maps any data value to an appropriate radius

#### 4. Circle Rendering Logic:
- `data.map()` creates one SVG circle element per incident in the dataset
- **Coordinate Transformation**: 
  - `projection(d.coords)` converts geographic coordinates to screen pixels
  - `d.coords` contains `[longitude, latitude]` (reversed during data loading in data_loading.js)
  - `projection()` applies the Natural Earth projection (same one used for countries)
  - Result is destructured into `[x, y]` pixel coordinates using array destructuring
- **Circle SVG attributes**:
  - `cx`, `cy`: Center position of the circle on the map
  - `r`: Radius calculated by passing the data value through the sizeScale function
  - `key={index}`: React requirement for efficiently rendering lists

#### 5. CSS Styling Applied:
```css
circle {
    fill: #137B80;  /* Teal color */
    opacity: 0.3;   /* 30% opacity for transparency */
}
```
- Opacity allows overlapping circles to show density of incidents
- Multiple overlapping circles create darker areas, indicating hotspots

---

## Integration Changes

### 1. App.js - Enhanced Data Loading Check (Line 15)

**Before:**
```javascript
if (!data) {
    return <div>Loading data...</div>;
}
```

**After:**
```javascript
if (!data || !worldAtlas) {
    return <div>Loading data...</div>;
}
```

**Reason:**
- Previously only checked if migrant `data` was loaded
- Now both `data` AND `worldAtlas` must be loaded before rendering
- Prevents rendering errors when trying to access undefined worldAtlas properties in the Countries component
- Uses logical OR (`||`) to check both conditions

### 2. App.js - Component Addition (Lines 39-40)

**Changes:**
```javascript
<WorldGraticule />
<Countries worldAtlas={worldAtlas} />
<Bubbles data={data} />
```

**Reason:**
- Added Countries component with worldAtlas prop to draw geography
- Added Bubbles component with data prop to display incidents
- **Layering order matters in SVG**: 
  - WorldGraticule renders first (background grid)
  - Countries render second (land masses)
  - Bubbles render last (foreground data points)
  - Later elements in SVG appear on top of earlier elements

### 3. index.html - Script Loading Order (Line 26)

**Change:**
```html
<script type="text/babel" src="data_loading.js"></script>
<script type="text/babel" src="static_content.js"></script>
<script type="text/babel" src="bubbles.js"></script>
<script type="text/babel" src="app.js"></script>
```

**Reason:**
- Added `bubbles.js` script tag before `app.js`
- Loads before `app.js` so the Bubbles component is defined when App tries to use it
- `type="text/babel"` allows JSX syntax to be transpiled in the browser
- **Order matters**: Dependencies must load before consumers
  - data_loading.js → Provides data hooks
  - static_content.js → Provides Countries, Introduction, WorldGraticule
  - bubbles.js → Provides Bubbles component
  - app.js → Uses all of the above

---

## Data Flow Architecture

### Application Initialization Flow:

1. **index.html loads** → Browser parses HTML and loads scripts in order
2. **data_loading.js executes** → Defines `useData()` and `useWorldAtlas()` custom hooks
3. **static_content.js executes** → Defines Countries, Introduction, WorldGraticule components
4. **bubbles.js executes** → Defines Bubbles component
5. **app.js executes** → 
   - Defines App component
   - Calls `ReactDOM.render(<App/>, document.getElementById("root"))`
6. **App component renders**:
   - Calls `useData()` and `useWorldAtlas()` hooks
   - Initially both return `null` → Shows "Loading data..."
   - Hooks trigger async data fetching
7. **Data arrives** → 
   - Hooks call their respective `setState` functions
   - React re-renders App component
   - Now data is available, visualization renders

### Component Hierarchy:
```
App
├── Introduction (receives data)
└── SVG
    ├── WorldGraticule (background grid)
    ├── Countries (receives worldAtlas)
    ├── Bubbles (receives data)
    └── g (transform for future histogram)
```

---

## Key D3/React Concepts Demonstrated

### 1. D3 Scales
- Transform data domains to visual ranges
- `scaleSqrt()` for perceptually accurate area encoding
- Domain: data space, Range: pixel space

### 2. GeoJSON Processing
- Converting geographic data (latitude/longitude) to SVG paths
- Using `topojson.feature()` to extract land masses
- Using `topojson.mesh()` to extract borders

### 3. Geographic Projections
- Flattening 3D Earth coordinates to 2D screen coordinates
- `d3.geoNaturalEarth1()` provides a visually pleasing world map
- `d3.geoPath()` generates SVG path strings from geographic data

### 4. React Hooks
- `useState()`: Managing component state
- `useEffect()`: Handling side effects (data loading)
- Custom hooks (`useData`, `useWorldAtlas`): Encapsulating data loading logic

### 5. Declarative Rendering
- Mapping data arrays to visual elements using `.map()`
- React's declarative approach: describe what to render, not how to render it
- Automatic re-rendering when state changes

### 6. Component Composition
- Building complex visualizations from simple, reusable components
- Props for passing data and configuration
- Separation of concerns (data loading, visualization, layout)

---

## Best Practices Applied

### Code Organization
- Separation of data loading logic into dedicated hooks
- Each component in its own file for modularity
- Clear accessor functions for data access

### Performance Considerations
- Data loaded only once using `useEffect` with empty dependency array `[]`
- Efficient SVG rendering with proper grouping (`<g>` elements)
- Single path element for all country borders instead of individual paths

### React Integration with D3
- **D3 for data transformation**: Scales, projections, path generation
- **React for DOM rendering**: Components, JSX, virtual DOM
- No direct D3 DOM manipulation (letting React handle the DOM)
- This approach provides the best of both libraries

### Accessibility and User Experience
- Loading states to inform users when data is being fetched
- Clear visual hierarchy through layering
- Semi-transparent circles to show overlapping data points

---

## Conclusion

This implementation successfully integrates D3's powerful data visualization capabilities with React's component-based architecture. The Countries component provides geographic context, while the Bubbles component overlays the actual data in a perceptually accurate manner. The use of `scaleSqrt()` ensures that the visualization accurately represents the magnitude of tragedies without visual distortion.

// --------------------------------------------------
// TODO 1.2 and 1.4
// --------------------------------------------------

// Introduction component that accepts data and displays dynamic statistics
const Introduction = ({ data }) => {

    // Calculate dynamic metrics from the data
    const numberOfIncidents = data.length;
    const totalCasualties = data.reduce((sum, d) => sum + d['Total Number of Dead and Missing'], 0);
    const numberOfColumns = Object.keys(data[0]).length;
    
    // Build dynamic intro text with data metrics using string concatenation

    // 1.4 Adding the introduction text with dynamic values
    const introText = "This visualization shows incidents of missing migrants across the globe. " +
        "The dataset contains " + numberOfIncidents + " incidents with a total of " + 
        totalCasualties + " casualties reported. " +
        "Each incident has " + numberOfColumns + " data fields. " +
        "Use the map and histogram to explore when and where incidents occurred.";

    // Return two divs wrapped in a React fragment. The first div is the subtitle/title and the second
    // contains the dynamic description text inserted via the introText variable.
    return (
        <>
            <div className="introTitle">Description<br/></div>
            <div className="intro">{introText}</div>
        </>
    )
};


// --------------------------------------------------
// TODO 1.5 (World Sphere and Graticule)
// --------------------------------------------------

// Define a projection using d3.geoNaturalEarth1
const projection = d3.geoNaturalEarth1();

// Define a path generator using d3.geoPath that will use the projection
const path = d3.geoPath(projection);

// Generate the lon/lat grid lines using d3.geoGraticule
const graticule = d3.geoGraticule();

const WorldGraticule = () => {
    // TODO 4.2: Memoization for sphere and graticules
    const sphereAndGraticule = React.useMemo(() => (
        <>
            {/* Draw a sphere under the projection */}
            <path className="sphere" d={path({type: 'Sphere'})} />
            
            {/* Draw the graticule (grid lines) */}
            <path className="graticule" d={path(graticule())} />
        </>
    ), []); // Empty dependency array since projection and graticule are static

    return (
        <g className="worldGraticule">
            {sphereAndGraticule}
        </g>
    );
};

// --------------------------------------------------
// TODO 2.1 
// --------------------------------------------------

// the data we work on is composed of land and interiors (use destructuring)
const Countries = ({ 
    worldAtlas: {land, interiors}, 
}) => {
    // TODO 4.2: Memoization for land and interiors
    const landAndInteriors = React.useMemo(() => (
        <>
            {
                land.features.map((feature, index) => (
                    <path key={index} className="land" d={path(feature)} />
                ))
            }
            <path className="interiors" d={path(interiors)} />
        </>
    ), [land, interiors]); // Dependencies are land and interiors from worldAtlas

    return (
        // TODO 2.1: delete the following line
        // //<div>Placeholder</div>

        // TODO 2.1: create a group with class name countries for styling that wraps the following JS scope
        // TODO 2.1: enter a JS scope inside the group element (everything that follows will be in curly braces)
            // TODO 2.1: create a react fragment
                // TODO 2.1: inside the fragment enter another JS scope
                    // TODO 2.1: map the land features to path elements that draw the land masses 
                    // (styling will make sure the paths are filled with the correct color)
                // TODO: 2.1: draw another path for the interiors
        <g className="countries">
            {landAndInteriors}
        </g>
    );
};

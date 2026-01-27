// This is the central component which wires everything together and will be rendered to the root element that 
// is specified in the html section of this file.
const App = () => {

    const width = 960;
    const height = 500;
    const dateHistogramSize = 0.2;

    // TODO 4.1: Setup a state using React.useState similar to what we did for loading the data.
    const [brushExtent, setBrushExtent] = React.useState();

    // read world atlas data amd migrant data
    const worldAtlas = useWorldAtlas();
    const data = useData();
    // if the data was not loaded yet return an html element that indicates that the data is still loading.
    if (!data || !worldAtlas) {
        return <div>Loading data...</div>;
    }

    // TODO 4.1: define an accessor function that will be used when filtering the data. The function
    // 			 should extract the reported date of the incident.
    const xValue = d => d['Reported Date'];

    // TODO 4.1: Setup the filtered data. The data is filtered based on the extent of the brush.
    // 			 Use .filter on the data to only include values that are within the brush extent.
    // 			 Make sure to handle the situation when the brush extent is not yet defined.
    const filteredData = brushExtent 
        ? data.filter(d => {
            const date = xValue(d);
            return date >= brushExtent[0] && date <= brushExtent[1];
          })
        : data;

    // TODO 1.2: Inside the returned react fragment and before the svg element add your new Introduction component in the same
    // way as the WorldGraticule element. Don't pass in any arguments yet.
    // TODO 1.4: Pass the data to the Introduction component just like width and height are passed to WorldGraticule.
    return (
        <div className="container">
            <h1>Missing Migrants Across the Globe</h1>
            <Introduction data={data} />

            <svg width={width} height={height}>

                //1.5 Remove the width and height from the WorldGraticule component

                <WorldGraticule />
                // TODO 2.1: add the countries element and pass it the world Atlas
                // TODO 2.2: add the Bubbles element and pass it the data
                <Countries worldAtlas={worldAtlas} />
                <Bubbles data={filteredData} />
                // TODO 4.1: Pass the filtered data to bubbles
                <g transform={`translate(0, ${height - dateHistogramSize * height})`}>
                    <Histogram width={width} height={dateHistogramSize * height} data={data} setBrushExtent={setBrushExtent} />
                </g>
            </svg>
        </div>
    );

};

// place the visualization into the root element
ReactDOM.render(<App />, document.getElementById("root"));
// --------------------------------------------------
// TODO 3.1 and 3.2
// --------------------------------------------------

// TODO 3.2: create a AxisLeft component that takes the y scale, inner width and a tick offset
const AxisLeft = ({ yScale, innerWidth, tickOffset }) => {
    // TODO 3.2: on the y scale you can call the ticks() function which returns an array of tick positions
    return yScale.ticks().map(tickValue => (
        // TODO 3.2: create a group element with class name tick
        <g className="tick" key={tickValue} transform={`translate(0, ${yScale(tickValue)})`}>
            {/* TODO 3.2: now add the svg line element */}
            <line x1={0} x2={innerWidth} stroke="#C0C0BB" />
            {/* TODO 3.2: add the text moved slightly to the left (use tick offset) */}
            <text 
                x={-tickOffset} 
                dy="0.32em" 
                style={{ textAnchor: 'end' }}
            >
                {tickValue}
            </text>
        </g>
    ));
};

// TODO 3.2: add the bottom axis in the same way as the axis left
const AxisBottom = ({ xScale, innerHeight, tickOffset, tickFormat }) => {
    return xScale.ticks().map(tickValue => (
        <g className="tick" key={tickValue} transform={`translate(${xScale(tickValue)}, 0)`}>
            <line y1={0} y2={innerHeight} stroke="#C0C0BB" />
            {/* TODO 3.2: the textAnchor style for the text should be middle now */}
            <text 
                y={innerHeight + tickOffset} 
                dy="0.71em" 
                style={{ textAnchor: 'middle' }}
            >
                {tickFormat(tickValue)}
            </text>
        </g>
    ));
};

// TODO 3.2: create a Bars component
const Bars = ({ binnedData, xScale, yScale, innerHeight }) => {
    // TODO 3.2: map each binned data entry to a rectangle
    return binnedData.map((d, i) => (
        <rect
            className="bar"
            key={i}
            x={xScale(d.x0)}
            y={yScale(d.y)}
            width={xScale(d.x1) - xScale(d.x0)}
            height={innerHeight - yScale(d.y)}
            fill="#137B80"
        />
    ));
};

// TODO 3.1: Define an accessor function called yValue
const yValue = d => d['Total Number of Dead and Missing'];

// TODO 3.2: Define variables containing the text of your y axis label
const yAxisLabel = "Total Dead and Missing";

// variables for the offset of the axis label
const yAxisLabelOffset = 30;
// margin (small gaps on the sides of the bar chart)
const margin = { top: 20, right: 30, bottom: 30, left: 60 };

// TODO 3.2: Define a time format using d3.timeFormat
const xAxisTickFormat = d3.timeFormat('%d.%m.%Y');

// TODO 4.1: brush extent setter as parameter
const Histogram = ({ width, height, data, setBrushExtent }) => {
    // TODO 3.1: compute innerHeight and innerWidth by subtracting the margins
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // TODO 3.1: Define an accessor function (xValue) to access the date of the incident
    const xValue = d => d['Reported Date'];

    // TODO 3.1: define the xScale using d3.scaleTime
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    // TODO 3.1: grab the start and end from the domain
    const [start, stop] = xScale.domain();

    // TODO 3.1: aggregate the data into bins
    const binnedData = d3.histogram()
        .value(xValue)
        .domain(xScale.domain())
        .thresholds(d3.timeMonths(start, stop))(data)
        .map(array => ({
            x0: array.x0,
            x1: array.x1,
            y: d3.sum(array, yValue)
        }));

    // TODO 3.2: use scaleLinear to define the scale of the y value in the bar chart
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(binnedData, d => d.y)])
        .range([innerHeight, 0]);

    // Create a ref for the brush
    const brushRef = React.useRef();

    // Implement D3 brush
    React.useEffect(() => {
        const brush = d3.brushX()
            .extent([[0, 0], [innerWidth, innerHeight]])
            .on('brush end', (event) => {
                if (event.selection) {
                    // Convert pixel coordinates to date values
                    const [x0, x1] = event.selection;
                    setBrushExtent([xScale.invert(x0), xScale.invert(x1)]);
                } else {
                    // Clear the brush selection
                    setBrushExtent(null);
                }
            });

        d3.select(brushRef.current).call(brush);
    }, [innerWidth, innerHeight, xScale, setBrushExtent]);

    return (
        <>
            {/* TODO 3.2: return a width by height, filled, white rectangle as the background */}
            <rect width={width} height={height} fill="white" />
            {/* TODO 3.2: create a group element which transforms everything inside it by the margins */}
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* TODO 3.2: Add AxisLeft component */}
                <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={10} />
                {/* TODO 3.2: Add AxisBottom component */}
                <AxisBottom xScale={xScale} innerHeight={innerHeight} tickOffset={5} tickFormat={xAxisTickFormat} />
                {/* TODO 3.2: Add Bars component */}
                <Bars binnedData={binnedData} xScale={xScale} yScale={yScale} innerHeight={innerHeight} />
                {/* TODO 3.2: Add a text element for y axis label */}
                <text
                    className="axis-label"
                    textAnchor="middle"
                    transform={`translate(${-yAxisLabelOffset}, ${innerHeight / 2}) rotate(-90)`}
                >
                    {yAxisLabel}
                </text>
                {/* Brush overlay */}
                <g ref={brushRef} className="brush" />
            </g>
        </>
    );
};
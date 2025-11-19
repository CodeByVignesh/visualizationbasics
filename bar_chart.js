// --------------------------------------------------
// TODO 3.1 and 3.2
// --------------------------------------------------

// TODO 3.2: create a AxisLeft component that takes the y scale, inner width and a tick offset
    // TODO 3.2: on the y scale you can call the ticks() function which returns an array of tick positions
    // TODO 3.2: we map the tick positions to a group element containing a line and a text
        // TODO 3.2: create a group element with class name tick
            // TODO 3.2: the key will be the tick value
            // TODO 3.2: move the group to the right position using the transform of the group element
            // TODO 3.2: now add the svg line element. Research which parameters it requires. Note that the y position is already correct due to the
            // 			 transform we applied to the group
            // TODO 3.2: add the text moved slightly to the left (use tick offset) 
            // TODO 3.2: set the style attribute to  to make sure it aligns properly
            // TODO 3.2: add the tick value as the text

// TODO 3.2: add the bottom axis in the same way as the axis left. You will need the innerHeight to specify for positioning the text and line
// TODO 3.2: the textAnchor style for the text should be middle now

// TODO 3.2: create a Bars component and add parameter when you need them for the following todos
    // TODO 3.2: map each binned data entry to a rectangle
            // TODO 3.2: className should be bar
            // TODO 3.2: key is the index
            // TODO 3.2: all of the following must be passed through x scale or y scale
            // TODO 3.2: x coordinate is the beginning of the bar on the x axis
            // TODO 3.2: y coordinate is the top height of each bar (keep in mind that the origin of the coordinate system is in the top left)
            // TODO 3.2: width of a bar should be the difference between start and end date of each bar
            // TODO 3.2: height must be the inner height minus the height of the bar


// TODO 3.1: Define an accessor function called yValue to access the total number of dead and missing migrants 
// 			 ("Total Dead and Missing") from the original data table.
// TODO 3.2: Define variables containing the text of your y axis label (we won't define an x axis label)
// variables for the offset of the axis label
const yAxisLabelOffset = 30;
// margin (small gaps on the sides of the bar chart)
const margin = { top: 0, right: 30, bottom: 20, left: 45 };
// TODO 3.2: Define a time format using d3.timeFormat

// TODO 4.1: brush extent setter as parameter
const Histogram = ({width, height}) => {
    // TODO 3.1: compute innerHeight and innerWidth by subtracting the margins from width and height. If
    // 			you replace width and height in the placeholder rectangle below you will see it shrinking but
    // 			move to the wrong place. We will take care of that later
    // TODO 3.1: Define an accessor function (xValue) to access the date of the incident ("Reported Date") from
    // 			 the orignal data table.

    // TODO 3.1: define the xScale using d3.scaleTime
            // TODO 3.1: domain from min to max value of data. u can use d3.extent
            // TODO 3.1: the range starts at zero and ends at inner width
            // TODO 3.1: call nice to make it nice numbers for labeling		
    // TODO 4.2: Memoization for scale
    
    // TODO 3.1: grab the start and end from the domain

    // TODO 3.1: aggregate the data into bins you can find a detailed description in the pdf
    // TODO 4.2: Memoization for the binned data
    
    // TODO 3.2: use scaleLinear to define the scale of the y value in the bar chart (requires computation of binned data first)
            // TODO 3.2: domain starts a zero and ends at maximum (d3.max) of binned data
            // TODO 3.2: range is up to inner height
    // TODO 4.2: Memoization for scale
    
    // TODO 4.1: D3 provides a horizontal brush object called d3.brushX that can be manipulated interactively. The brush 
    // 			 element itself is a part of the DOM, i.e., it is a graphical element.  For manipulation of DOM elements 
    // 			 through JSX, we need a reference to them. use React.useRef() to create a const brushRef
    // TODO 4.1: When loading the data we used React.useEffect to ensure that the code was only executed once and performing
    // 			 side effects. We want do the same here to setup the brush and create a side effect of the brush which will 
    // 			 call the setter of brush extent that we passed in earlier.
    // TODO 4.1: the useEffect function requires a list of dependencies. Think about what variables the function depends on.
        // TODO 4.1: setup the brush using d3.brushX() and set its extent. assign it to a variable called brush
        // TODO 4.1: connect the brush with the group element by calling brush() on the group element (use d3.select())
        // TODO 4.1: add an event listener to the brush which listens for the "brush end" event. inside set the brush extent. 
        //  		 You have to invert the selection by mapping the selection using xScale.invert
    
    return (
        <>
            // TODO 3.2: delete the placeholder rectangle
            <rect width={width} height={height} fill="none" stroke="#d95f02" strokeWidth="3"/>
            // TODO 3.2: return a width by height, filled, white rectangle as the background 
            // TODO 3.2: create a group element which transforms everything inside it by the margins for top and left
                // TODO 3.2: When you finished the AxisLeft component, add it here and pass the necessary data. 
                // TODO 3.2: Experiment with the tick offset to find a good value.
                // TODO 3.2: When you finished the AxisBottom component, add it here and pass the necessary data. 
                // TODO 3.2: Experiment with the tick offset to find a good value.
                // TODO 3.2: When you finished the Bars component, add it here and pass the necessary data. 
                // TODO 3.2: Add a text element which contains your y axis label. Give it the class name axis-label and use 'middle' as 
                //			 the text anchor. The text should be rotated by 90 degrees and positioned to the left of the axis. The best
                // 			 way to do so is to use the transform attribute of the text element.
                // TODO 4.1: add a group element with attrbute ref being the previously defined reference to the brus
        </>
        )
};
// the URL where the world atlas data is downloaded from
const jsonUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';

// place data reading logic in a hook (hooks start with 'use')
const useWorldAtlas = () => {
    // this creates a state that returns the data (represents the state) and
    // a function that can be used to set the data (state)
    // the state is initially null which tells the user that the data has no yet been loaded
    const [data, setData] = React.useState(null);

    // useEffect ensures that the data is only loaded once. if it was loaded before, the function
    // is not executed again
    React.useEffect(() => {
        // using d3's json function we can download the json from the URL
        // when the download has finished the function will be executed
        d3.json(jsonUrl).then(topology => {
            // grab the countries and land masses from the topoJson file
            const { countries, land } = topology.objects;
            // this sets the data to the state defined before above
            setData({
                // convert the topoJson land to geoJson land using "feature(...)"
                land: topojson.feature(topology, land),
                // extract countries that do not face water
                interiors: topojson.mesh(topology, countries, (a, b) => a !== b)
            });
        });
    }, []);
    // with the useState and useEffect combination this function (when called repeatedly) will in the beginning
    // always return null (the data) until the download was finished and the data set. Then the same data will
    // be returned and no additional downloads are necessary.
    return data;
};

// the URL where the missing migrants data is downloaded from
const csvUrl = 'https://gist.githubusercontent.com/curran/a9656d711a8ad31d812b8f9963ac441c/raw/MissingMigrants-Global-2019-10-08T09-47-14-subset.csv';

// --------------------------------------------------
// TODO 1.3 (Data Loading)
// --------------------------------------------------

// a helper that takes a csv row and transforms it into something we can work with
const row = d => {
    // Read the 'Location Coordinates' and split them by the ',' separator, map each value from a string to a number, and then reverse the order
    d.coords = d['Location Coordinates'].split(',').map(d => +d).reverse();
    // Convert the 'Total Dead and Missing' string to a number
    d['Total Dead and Missing'] = +d['Total Dead and Missing'];
    // Convert the 'Reported Date' string to a Date object
    d['Reported Date'] = new Date(d['Reported Date']);
    return d;
};

// place data reading logic in a hook (hooks start with 'use')
const useData = () => {
    // create a state that is initially null
    const [data, setData] = React.useState(null);
    
    // useEffect ensures that the data is only loaded once. if it was loaded before the function
    // is not executed again
    React.useEffect(() => {
        // read data, and when finished then invoke setData. Since we are working with csv data we are using d3.csv(csvUrl, row accessor)
        // The row accessor will be the row function we defined above.
        d3.csv(csvUrl, row).then(setData);
    },[]);
    // return the data
    return data;
}; 

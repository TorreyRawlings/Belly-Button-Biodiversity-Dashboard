function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
// 1. Create the buildCharts function.
function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
        var samples = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
        var results = samples.filter(sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
        var samplefirst = results[0];
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var otuIds = samplefirst.otu_ids;
        var otuLabels = samplefirst.otu_labels;
        var sampleValues = samplefirst.sample_values;
    
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      var yticks = otuIds.map(obj => "OTU " + obj).reverse().slice(0,10);
      var xticks = sampleValues.map(ob => ob).slice(0,10).reverse();
      var barlabels = samplefirst.otu_labels.reverse().slice(0,10);
      console.log(sampleValues);
    
  
      // 8. Create the trace for the bar chart. 
      var barData = [{
        x: xticks,
        y: yticks,
        type: "bar",
        orientation: "h",
        text: barlabels}];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found"
       
      };

      
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);

      var bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
            color: sampleValues,
            size: sampleValues,
            colorscale: "picnic"
        }
      }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title : 'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID"},
      automargin: true,
      hovermode: "closest"

    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // Create a variable that holds the samples array. 

    // Create a variable that filters the samples for the object with the desired sample number.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Create a variable that holds the first sample in the array.
    var metarray = metadata.filter(obje => obje.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var metafirst = metarray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
   var wfreq = metafirst.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [ {
        value: wfreq,
        type: "indicator",
        mode: "gauge+number",
        title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
        gauge: {
            axis: {range: [0,10], dtick: "1" },
            bar: {color: "black"},
            steps: [
            { range: [0,2], color: "Red" },
            { range: [2,4], color: "Orange" },
            { range: [4,6], color: "Yellow" },
            { range: [6,8], color: "lightgreen"},
            { range: [8,10], color: "Green"} ]
        }
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { automargin: true };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
  }

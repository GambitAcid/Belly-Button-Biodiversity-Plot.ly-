function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
      var resultsarray= metadata.filter(sampleobject => 
        sampleobject.id == sample);
      var result= resultsarray[0]
      var panel = d3.select("#sample-metadata");
      panel.html("");
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });
    });
  }
//Creating Horizontal Bar Chart: Storing OTU's Found in Individual   
  function createBar(sample) {
  // Using `d3.json`
  d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => 
        sampleobject.id == sample);
    var result= resultsarray[0]
  
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;

// Creating Washing Gauge Basic Gauge: Belly Button Washing Frequency
    var metadata= data.metadata;
    console.log(metadata)
    var metaarray= metadata.filter(sampleobject => 
      sampleobject.id == sample);
    var metaresult= metaarray[0];
    var frequency = metaresult.wfreq;
    console.log(frequency)

    var gaugedata = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: frequency,
        title: { text: "Belly Button Washing Frequency <br> Scrubs per Week " },
        type: "indicator",
        mode: "gauge+number"
    }
    ];
    
    var gaugelayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', gaugedata, gaugelayout);
    
//Creating the Bubble chart: OTU ID with Clickable Bubbles  
    var BubbleChart = {
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      };
  
      var BubbleData = [ 
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          colorscale: "Earth"
          }
      }
    ];
    Plotly.newPlot("bubble", BubbleData, BubbleChart);
  
    var BarData =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
  
      }
    ];
  
    var BarLayout = {
      title: "Top 10 OTU's Found in Individual",
    };
  
    Plotly.newPlot("bar", BarData, BarLayout);
  });
  }

  function init() {
  // Drop down menu to select a specific element
  var selector = d3.select("#selDataset");
  
  // Creating our selection list
  d3.json("samples.json").then((data) => {
    console.log("The Init() function ran");
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
    const firstSample = sampleNames[0];
    createBar(firstSample);
    buildMetadata(firstSample);
  });
  }
  
  function optionChanged(newID) {
    // function that runs whenever the dropdown is changed
  createBar(newID);
  buildMetadata(newID);
  }

// function called, runs init instructions
// runs only on load and refresh of browser page
init();
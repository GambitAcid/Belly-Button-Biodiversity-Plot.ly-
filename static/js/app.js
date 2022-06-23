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
//Creating horizontal bar chart   
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
//Creating a Bubble Chart That Displays Each Sample 
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
  // Selecting specific element from drop down menu
  var selector = d3.select("#selDataset");
  
  // create select list
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
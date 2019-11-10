function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  const metadataUrl = `/metadata/${sample}`;

  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(metadataUrl).then(function(sample) {
    const sampleMeta = d3.select(`#sample-metadata`);

  // Use `.html("") to clear any existing metadata
    sampleMeta.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function([key, value]) {
      const row = sampleMeta.append("p");
      row.text(`${key}:${value}`)
    })
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  const sampleData = `/sample/${sample}`;

  // @TODO: Build a Bubble Chart using the sample data
  d3.json(sampleData).then(function(data) {
    const x_axis = data.otu_ids;
    const y_axis = data.sample_values;
    const size = data.sample_values;
    const color = data.otu_ids;
    const texts = data.otu_labels;
   
    let bubble = {
      x: x_axis,
      y: y_axis,
      text: texts,
      mode: 'markers',
      marker: {
        size: size,
        color: color,
      }
    };

    const data = [bubble];

    const layout = {
      title: Belly Button Bacteria,
      xaxis: {title: "OTU ID"},
    };
  })
};

  Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  d3.json(sampleData).then(function(data) {
    const values = data.sample_values.slice(0,10);
    const labels = data.otu_ids.slice(0,10);
    const hoverinfo = data.otu_labels.slice(0,10);

    let pie = [{
      values: values,
      labels: labels,
      hoverinfo: hoverinfo,
      type: 'pie'
    }]

    const layout = {
      height: 500,
      width: 500
    };
  })

  Plotly.newPlot('pie', pie, layout);

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

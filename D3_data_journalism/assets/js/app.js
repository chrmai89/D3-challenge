// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data
d3.csv("assets/data/data.csv").then(function(journalData) {

    console.log(journalData)
//Parse Data/Cast as numbers
// ==============================
    journalData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.abbr = data.abbr

      console.log(data.poverty);
      console.log(data.healthcare);
      console.log(data.abbr);
    });

    //Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(journalData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(journalData, d => d.healthcare)])
      .range([height, 0]);

    //Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    //Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    //Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(journalData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", ".5");

    //adding text element
    var text = chartGroup.selectAll(".stateText")
    .data(data)
    .enter()
    .append("text")
    .classed ("stateText", true)
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.healthcare))
    .attr("font-size", "8px")
    .text(d => d.abbr)
    .attr("text-anchor", "middle")
    .attr("fill", "white");


    // Create group for 3 x-axis labels
  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .text("In Poverty (%)");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - ((margin.left/2)+2))
    .attr("x", 0 - (height / 2))
    .attr("value", "Healthcare")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

  //Initialize tool tip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Hair length: ${d.poverty}<br>Hits: ${d.healthcare}`);
    });

  //Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  //Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });



  }).catch(function(error) {
    console.log(error);
  });
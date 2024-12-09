import * as d3 from "d3";

// Graph dimensions
const width = 720;
const height = 350;
const XOffset = 60;
const YOffset = 60;

// Attach the tooltip
const tooltip = d3
  .select("#graph")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

// Get data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then((data) => {
  console.log(data);
  // Create graph area
  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", width + YOffset)
    .attr("height", height + XOffset);

  // Format Data
  const rawDates = data.data.map((d) => d[0]);
  const dates = data.data.map((d) => new Date(d[0])); // This gets the date portion of the data from the json file.
  const GDPvalues = data.data.map((d) => d[1]); // This gets the GDP portion of the data from the json file.

  // Scale Data
  const xScale = d3
    .scaleTime()
    .domain([new Date(d3.min(dates)), new Date(d3.max(dates))])
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(GDPvalues)])
    .range([0, height]);

  const scaledDates = dates.map((d) => xScale(d));
  const scaledGDPvalues = GDPvalues.map((d) => yScale(d));

  // Draw x and y axes
  const xAxis = d3.axisBottom().scale(xScale);
  const yAxis = d3.axisLeft().scale(yScale);
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(${XOffset}, ${height})`);
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${YOffset}, 0)`);

  // Draw data
  const bars = svg
    .selectAll("rect")
    .data(scaledGDPvalues)
    .enter()
    .append("rect")
    .attr("x", (d, i) => XOffset + scaledDates[i])
    .attr("y", (d) => height)
    .attr("width", width / GDPvalues.length)
    .attr("index", (d, i) => i)
    .attr("class", "bar")
    .attr("data-date", (d, i) => rawDates[i])
    .attr("data-gdp", (d, i) => GDPvalues[i]);
  bars
    .transition()
    .duration((d, i) => i * 10)
    .attr("y", (d) => height - d)
    .attr("height", (d) => d);

  bars
    .on("mouseover", function (event) {
      // Tooltip already exists so we just have to move it and make it visible
      const i = this.getAttribute("index");

      tooltip
        .attr("data-date", rawDates[i])
        .attr("data-gdp", GDPvalues[i])
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html("Date: " + dates[i] + "<br>GDP: " + GDPvalues[i]);
    })
    .on("mouseout", (e, d) => {
      tooltip.transition().duration(200).style("opacity", 0);
    });
});
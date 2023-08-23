const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
const margin = {top: 50, right: 30, bottom: 100, left: 100};

const color = d3.scaleSequential(d3.interpolateBlues)
    .domain([-1, 1]);

fetch('/api/correlation_matrix')
    .then(response => response.json())
    .then(data => {
        const crimeTypes = Object.keys(data);
        const gridSize = Math.floor((Math.min(width, height) - margin.top - margin.bottom) / crimeTypes.length);

        const xScale = d3.scaleBand()
            .domain(crimeTypes)
            .range([0, crimeTypes.length * gridSize]);

        const yScale = d3.scaleBand()
            .domain(crimeTypes)
            .range([0, crimeTypes.length * gridSize]);

        const xAxis = d3.axisBottom(xScale); // Change to axisBottom
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(${margin.left},${height - margin.bottom})`) // Move the x-axis group down
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", "0.35em")
            .attr("transform", "rotate(45)")
            .style("text-anchor", "start");

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .call(yAxis);

        const cells = svg.selectAll(".cell")
            .data(d3.cross(crimeTypes, crimeTypes))
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", d => `translate(${xScale(d[0]) + margin.left},${yScale(d[1]) + margin.top})`);

        cells.append("rect")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .attr("fill", d => color(data[d[0]][d[1]]))
            .attr("stroke", "#fff");

        cells.append("text")
            .attr("x", gridSize / 2)
            .attr("y", gridSize / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(d => data[d[0]][d[1]].toFixed(2));

        cells.append("title")
            .text(d => `${d[0]} vs ${d[1]}: ${data[d[0]][d[1]]}`);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });





























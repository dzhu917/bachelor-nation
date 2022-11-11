let data;

d3.csv("data/bachelorette-data.csv", (row) => {
    row.date_size = +row.date_size
    row.first_impression = +row.first_impression
    row.season = +row.season
    row.elim_week = +row.elim_week
    row.winner = +row.winner
    return row
}).then((csv) => {
    data = csv
    console.log(data)
    drawDots(data)
})

function drawDots(data){
    // Margin object with properties for the four directions
    let margin = {top: 20, right: 40, bottom: 20, left: 20};

    let padding = 30;

    // Width and height as the inner dimensions of the chart area
    let width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let svg = d3.select("#dots")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var circles = svg.selectAll("dots")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => d.season * 10)
        .attr("cy", (d,i) => i * 10)
        .attr("r", 2)
        .attr('fill', function(d){
            if(d.winner === 1){
                return 'blue'
            }else{
                return 'red'
            }
        })
}
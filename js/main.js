let bachelorette_data;
let contestant_data;

d3.csv("data/bachelorette-data.csv", (row) => {
    row.date_size = +row.date_size
    row.first_impression = +row.first_impression
    row.season = +row.season
    row.elim_week = +row.elim_week
    row.winner = +row.winner
    return row
}).then((csv) => {
    bachelorette_data = csv
    console.log(bachelorette_data)
})

d3.csv("data/contestant-data-simplified.csv", (row) => {
    row.season = +row.season
    row.winner = +row.winner
    return row
}).then((csv) => {
    contestant_data = csv
    console.log(contestant_data)
    drawDots(contestant_data)
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

    // create circle containers
    let circles = svg.selectAll('circle')
        .data(data);

    // append circles
    circles.enter().append('circle')
        .attr('cx', function(d,i){
            if(i % 4 === 0){
                return width/10*3.5;
            } else if(i % 4 === 1) {
                return width/10 * 4.5
            } else if(i % 4 === 2) {
                return width/10 * 5.5
            } else if(i % 4 === 3) {
                return width/10 * 6.5
            }
        })
        .attr('cy', function(d,i){
            return (Math.trunc(i / 4)) * height/5 + margin.top;
        })
        .attr('r', width/30)
        .attr('fill', function(d,i){
            if(d.winner === 1){
                return 'blue'
            }else{
                return 'red'
            }
        });
}
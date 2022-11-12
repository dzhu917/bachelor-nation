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

    let allContestantDots = d3.select("#allContestantDots")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // create circle containers
    let allContestantCircles = allContestantDots.selectAll('circle')
        .data(data);

    // append circles
    allContestantCircles.enter().append('circle')
        .attr('cx', function(d){
            return d3.randomUniform(margin.right, width - 10)();
        })
        .attr('cy', function(d){
            return d3.randomUniform(margin.top, height - 10)()
        })
        .attr('r', function(d,i){
            if(d.winner === 1){
                return 5
            }
            else{
                return 3
            }
        })
        .attr('fill', function(d,i){
            if(d.winner === 1){
                return 'teal'
            }else{
                return 'lightgrey'
            }
        });
}
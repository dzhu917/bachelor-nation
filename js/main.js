let bachelorette_data;
let contestant_data;

let promises = [
    d3.csv("data/bachelorette-data.csv"),
    d3.csv("data/contestant-data-simplified.csv")
];

Promise.all(promises)
    .then(function (data) {
        createVis(data)
    })
    .catch(function (err) {
        console.log(err)
    });

function createVis(data) {
    
}

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
    drawDots(contestant_data)
})

function drawDots(data){
    // Margin object with properties for the four directions
    let margin = {top: 20, right: 40, bottom: 20, left: 20};

    let padding = 30;

    // Width and height as the inner dimensions of the chart area
    let width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // DOT PLOT 1: FOR ALL CONTESTANTS
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
            return d3.randomUniform(((d.season - 1) * (width/21) + (width/30)), (d.season * (width/21)))();
        })
        .attr('cy', function(d){
            return d3.randomUniform(margin.top + padding, height)()
        })
        .attr('r', 3)
        .attr('fill', function(d,i){
            if(d.show === "Bachelorette"){
                return '#FAB05A'
            }else{
                return '#75D6FF'
            }
        });

    // CREATE LEGEND FOR DOT PLOT 1
    let allContestantDotLegendData = ["Bachelor contestants", "Bachelorette contestants"]
    let allContestantDotLegendColors = ["#75D6FF", "#FAB05A"]

    let allContestantDotLegend = allContestantDots
        .selectAll(".allContestantDotLegend")
        .enter()
        .append('g')
        .data(allContestantDotLegendData)

    allContestantDotLegend.enter()
        .append("rect")
        .attr("class","allContestantDotLegend")
        .attr("width",20)
        .attr("height",20)
        .attr("fill", (d,i) => allContestantDotLegendColors[i])
        .attr('y', 10)
        .attr('x',(d,i) => i*250 + margin.left)

    allContestantDotLegend.enter()
        .append("text")
        .attr("class","allContestantDotLegend-label")
        .text(d => d)
        .attr('y', 25)
        .attr('x',(d,i) => margin.left + 30 + i*250)
        .style("font-size", "16px");

    // CREATE DOT PLOT 2: DIFFERENTIATE WINNERS
    let winnerDifferentiatedDots = d3.select("#winnerDifferentiatedDots")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // create circle containers
    let winnerDifferentiatedCircles = winnerDifferentiatedDots.selectAll('circle')
        .data(data);

    // append circles
    winnerDifferentiatedCircles.enter().append('circle')
        .attr('cx', function(d){
            return d3.randomUniform(((d.season - 1) * (width/21) + (width/30)), (d.season * (width/21)))();
        })
        .attr('cy', function(d){
            return d3.randomUniform(margin.top, height)()
        })
        .attr('r', function(d){
            if(d.winner === 1){
                return 6
            }
            else{
                return 3
            }
        })
        .attr('fill', function(d,i){
            if(d.show === "Bachelorette" & d.winner === 1){
                return '#AD6A1C'
            }
            else if(d.show === "Bachelorette" & d.winner === 0){
                return '#75D6FF'
            }
            else if(d.show === "Bachelor" & d.winner === 1){
                return '#2D87AD'
            }
            else {
                return '#FAB05A'
            }
        });
}

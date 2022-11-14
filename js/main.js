let bachelorette_data;
let contestant_data;
let myDots;

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
    initMainPage(contestant_data)
})

function initMainPage(data){
    myDots = new DotsVis('dotsDiv', data);
}

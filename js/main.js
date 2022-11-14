let bachelorette_data;
let contestant_data;
let myDots;

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

d3.csv("data/contestant-data-simplified-1.csv", (row) => {
    row.season = +row.season
    row.winner = +row.winner
    row.elim_week = +row.elim_week
    row.fir = +row.fir
    return row
}).then((csv) => {
    contestant_data = csv
    initMainPage(contestant_data)
})

function initMainPage(data){
    myDots = new DotsVis('dotsDiv', data);
    myFIR = new FirVis('firDiv', data);
}

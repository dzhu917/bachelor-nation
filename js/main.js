let bachelorette_data;
let contestant_data;
let myDots;
let myFIR;

let promises = [
    d3.csv("data/bachelorette-data.csv"),
    d3.csv("data/contestant-data-simplified-1.csv")
];

Promise.all(promises)
    .then(function (data) {
        data[0].forEach(function(d){
            d.date_size = +d.date_size;
            d.first_impression = +d.first_impression;
            d.season = +d.season;
            d.elim_week = +d.elim_week;
            d.winner = +d.winner;
        });

        data[1].forEach(function(d){
            d.season = +d.season;
            d.winner = +d.winner;
            d.elim_week = +d.elim_week;
            d.fir = +d.fir;
        });

        createVis(data)
    })
    .catch(function (err) {
        console.log(err)
    });

function createVis(data) {
    bachelorette_data = data[0];
    contestant_data = data[1];

    myDots = new DotsVis('dotsDiv', contestant_data);
    myFIR = new FirVis('firDiv', contestant_data);
}

let selectedCategory = document.getElementById('categorySelector').value;

function categoryChange(){
    selectedCategory = document.getElementById('categorySelector').value;
    myDots.wrangleData();
}
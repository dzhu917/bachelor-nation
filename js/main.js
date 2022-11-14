let bachelorette_data;
let contestant_data;
let myDots;
let simulation, nodes;
let svg;
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

    let margins = {top: 20, right: 20, bottom: 50, left: 20};
    let width = document.getElementById("vis").getBoundingClientRect().width - margins.left - margins.right;
    let height = window.innerHeight - margins.top - margins.bottom;

    svg = d3.select("#vis")
                    .append('svg')
                    .attr("id", "svg")
                    .attr('width', width)
                    .attr('height', height);

    myDots = new DotsVis('vis', contestant_data);
    myFIR = new FirVis('firDiv', contestant_data);
}

let selectedCategory = document.getElementById('categorySelector').value;

function categoryChange(){
    selectedCategory = document.getElementById('categorySelector').value;
    myDots.wrangleData();
}

function clean(chartType){
    if (chartType !== "dot"){
        d3.select("#dotgroup")
            .transition()
            .attr("opacity", 0)
    }
    if (chartType !== "fir"){
        d3.select("#firgroup")
            .transition()
            .attr("opacity", 0)
    }
}
function draw1(){
    console.log("draw1");

    clean("dot");

    myDots.updateVisAll();
}

function draw2(){
    console.log("draw2");

    clean("dot");
    
    myDots.updateVisWinner();
}

function draw3(){
    console.log("draw3");

    clean("dot");

    myDots.updateVisElim();
}

function draw4(){
    console.log("draw4");

    clean("dot");

    myDots.updateVisElimSorted();
}


// Enables scrolling function
// Loads text and draws graph on scroll

// Array of all graph functions
let activationFunctions = [
    draw1,
    draw2,
    draw3,
    draw4,
]

let scroll = scroller()
    .container(d3.select('#vis-text'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;
})
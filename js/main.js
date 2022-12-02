let bachelorette_data;
let contestant_data;
let hometown_data;
let myDots;
let simulation, nodes;
let svg;
let myFIR;
let myHometowns;
let myRunnerup;

let promises = [
    d3.csv("data/bachelorette-data.csv"),
    d3.csv("data/contestant-data-simplified-1.csv"),
    d3.json("data/hometowns.geojson")
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
            d.runner_up = +d.runner_up;
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
    hometown_data = data[2];

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
    myRunnerup = new RunnerupVis('runnerupDiv', contestant_data);
    myHometowns = new MapVis('mapDiv', contestant_data);

    drawIntro();
}

/*
let selectedCategory = document.getElementById('categorySelector').value;

function categoryChange(){
    selectedCategory = document.getElementById('categorySelector').value;
    myDots.wrangleData();
}
*/

function clean(chartType){
    if (chartType !== "dot"){
        d3.select("#dotgroup")
            .transition()
            .attr("visibility", "hidden")
    }
    if (chartType !== "fir"){
        d3.select("#sankeygroup")
            .transition()
            .attr("visibility", "hidden")
    }
    if (chartType !== "runnerup"){
        d3.select("#runnerupgroup")
            .transition()
            .attr("visibility", "hidden")
    }
    if (chartType !== "map"){
        d3.select("#mapgroup")
            .transition()
            .attr("visibility", "hidden")
    }
    if (chartType !== "intro"){
        d3.select("#intro")
            .html(null);
    }

}

function drawIntro(){
    console.log("drawIntro");

    clean("intro");

    d3.select("#intro")
        .html(`<p style="line-height: 1.7">If you've been on social media or watch TV, you've probably heard of ABC's Bachelor
        franchise. Every season, one person is crowned the Bachelor or Bachelorette, and a group of contestants
        vie for their love by going on dates throughout the season. Contestants are eliminated every week
        at rose ceremonies, during which the Bachelor(ette) grants a rose to contestants chosen
        to move forward.</p>
        <br>
        <p style="line-height: 1.7">The franchise has run for a while — the Bachelor has 21 seasons, and
            the Bachelorette has 13. With hundreds of contestants who have gone through this unconventional process
            of finding love, we wondered what a visualization of the franchise might look like. <b>Who tends to win the
            Bachelor(ette)'s heart? Do first impression roses mean anything? We dove into the data behind the franchise, its
            contestants, and how it all pans out!
        </p>
        <br>
        <p>Scroll to explore the data!</p>`); 
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

function draw5(){
    console.log("draw5");

    clean("fir");

    myFIR.updateVis();
}

function draw6(){
    console.log("draw6");

    clean("runnerup");

    myRunnerup.updateRunnerup();
}

function draw7(){
    console.log("draw7");

    clean("runnerup");

    myRunnerup.updateRunnerupFIR();
}

function draw8(){
    console.log("draw8");

    clean("runnerup");

    myRunnerup.updateRunnerupRoses();
}
function draw9(){
    console.log("draw9");

    clean("map");

    myHometowns.updateVis();
}

// Enables scrolling function
// Loads text and draws graph on scroll

// Array of all graph functions
let activationFunctions = [
    drawIntro,
    draw1,
    draw2,
    draw3,
    draw4,
    draw9,
    draw5,
    draw6,
    draw7,
    draw8
]

let scroll = scroller()
    .container(d3.select('#vis-text'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    console.log("index", index);
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
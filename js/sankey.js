// this is a test

class FirVis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis()

    }
    initVis() {
        let vis = this

        // Margin object with properties for the four directions
        vis.margin = {top: 20, right: 40, bottom: 20, left: 20};

        vis.padding = 30;

        // Width and height as the inner dimensions of the chart area
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // sort data by FIR

        vis.svg = d3.select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

        vis.initFIRVis();
        vis.initSortedFIRVis();
        vis.wrangleData();
    }

    initFIRVis() {

        let vis = this

        // sort data by FIR
        vis.data.sort((a,b) => {return b.fir - a.fir})

        // append div container for tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'divTooltip')

        // Create legend
        vis.allContestantDotLegendData = ["Received first impression rose", "Did not receive first impression rose", "Eliminated"]
        vis.allContestantDotLegendColors = ["rgba(255,49,49,0.62)", '#cce5cc', "#525750"]

        vis.allContestantDotLegend = vis.svg
            .selectAll(".allContestantDotLegend")
            .enter()
            .append('g')
            .data(vis.allContestantDotLegendData)

        vis.allContestantDotLegend.enter()
            .append("rect")
            .attr("class","allContestantDotLegend")
            .attr("width",20)
            .attr("height",20)
            .attr("fill", (d,i) => vis.allContestantDotLegendColors[i])
            .attr('y', 10)
            .attr('x',(d,i) => i*300 + vis.margin.left)

        vis.allContestantDotLegend.enter()
            .append("text")
            .attr("class","allContestantDotLegend-label")
            .text(d => d)
            .attr('y', 25)
            .attr('x',(d,i) => 30 + i*300 + vis.margin.left)
            .style("font-size", "16px");

        // CREATE SLIDER
        vis.sliderFill = d3.sliderBottom()
            .min(0)
            .max(10)
            .width(300)
            .ticks(10)
            .step(1)
            .default(0.015)
            .fill('#0f4f65')
            .on('onchange', val => {
                // d3.select('p#value-fill').text(val);
                vis.updateVis(val);
            });

        vis.gFill = d3.select('div#slider')
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');

        vis.gFill.call(vis.sliderFill);

        // console.log(vis.sliderFill.value())

    }

    initSortedFIRVis() {
        let vis = this;

        // sort data by FIR and then by winner
        vis.data.sort((a,b) => {return b.fir - a.fir || b.winner - a.winner})

        // create sorted array of contestants
        vis.allContestantCirclesSorted = vis.svg
            .selectAll(".allContestantCirclesSorted")
            .enter()
            .append('g')
            .data(vis.data)

        vis.allContestantCirclesSorted.enter().append('circle')
            .attr('class', 'allContestantCirclesSorted')
            .attr('cx', function(d, i){
                return vis.padding + 15*(i % 26)
            })
            .attr('cy', function(d, i){
                return 2*vis.padding + 15*Math.floor(i / 26) + 600
            })
            .attr('r', 5)
            .attr('fill', function(d){
                // if contestant has been eliminated, fill circle gray
                if (d.winner === 1 && d.fir === 1) {
                    return 'rgba(255,49,49,0.62)'
                } else if (d.winner === 1 && d.fir === 0){
                    return '#cce5cc'
                } else if (d.winner === 0){
                    return '#525750'
                }
            })
            .on("mouseover", function(event,d){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 3px;">
                     <p style="font-weight: bold;">${d.name}</p>
                     <p style="line-height: 0.5"> Season: ${d.season}</p>
                     <p style="line-height: 0.5"> Elim Week: ${d.elim_week}</p>                     
                 </div>\``);

                d3.select(this)
                    .style("stroke", "black")
            })
            .on("mouseout", function(){
                d3.select(this)
                    .attr("opacity", "1")
                    .attr("stroke-width", 0)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

    }

    wrangleData(){
        let vis = this;

        vis.updateVis();
    }

    updateVis(val){
        // console.log(val)
        let vis = this;

        // create circle containers
        let allContestantCircles = vis.svg.selectAll('.allContestantCircles')
            .data(vis.data);

        // append circles
        allContestantCircles.enter().append('circle')
            .attr("class", "allContestantCircles")
            .merge(allContestantCircles)
            .attr('cx', function(d, i){
                return vis.padding + 15*(i % 26)
            })
            .attr('cy', function(d, i){
                return 2*vis.padding + 15*Math.floor(i / 26)
            })
            .attr('r', 5)
            .attr('fill', function(d){
                // if contestant has been eliminated, fill circle gray
                if(d.elim_week <= val) {
                    return '#525750'
                } else if (d.fir === 1){
                    return 'rgba(255,49,49,0.62)'
                } else{
                    return '#cce5cc'
                }
            })
            .on("mouseover", function(event,d){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 3px;">
                     <p style="font-weight: bold;">${d.name}</p>
                     <p style="line-height: 0.5"> Season: ${d.season}</p>
                     <p style="line-height: 0.5"> Elim Week: ${d.elim_week}</p>                     
                 </div>\``);

                d3.select(this)
                    .style("stroke", "black")
            })
            .on("mouseout", function(){
                d3.select(this)
                    .attr("opacity", "1")
                    .attr("stroke-width", 0)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        allContestantCircles.exit().remove();
    }
}
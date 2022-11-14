// this is a test

class FirVis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis()
    }
    initVis() {
        let vis = this

        // sort data by FIR
        vis.data.sort((a,b) => {return b.fir - a.fir})

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

        // create circle containers
        vis.allContestantCircles = vis.svg.selectAll('circle')
            .data(vis.data);

        // append circles
        vis.allContestantCircles.enter().append('circle')
            .attr('cx', function(d, i){
                return vis.padding + 10*(i % 10)
            })
            .attr('cy', function(d, i){
                return 2*vis.padding + 10*Math.floor(i / 10)
            })
            .attr('r', 3)
            .attr('fill', function(d){
                if(d.fir === 1){
                    return 'rgba(255,49,49,0.62)'
                } else{
                    return '#0f4f65'
                }
            });

        // create legend where red = FIR, blue = not FIR, grey '#525750' = eliminated
        vis.allContestantDotLegendData = ["Received first impression rose", "Did not receive first impression rose", "Eliminated"]
        vis.allContestantDotLegendColors = ["rgba(255,49,49,0.62)", '#0f4f65', "#525750"]

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

        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;

        vis.updateVis();
    }

    updateVis(){
        let vis = this;
    }
}
class DotsVis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis()
    }

    initVis(){
        let vis = this

        // Margin object with properties for the four directions
        vis.margin = {top: 20, right: 40, bottom: 20, left: 20};

        vis.padding = 30;

        // Width and height as the inner dimensions of the chart area
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // DOT PLOT 1: FOR ALL CONTESTANTS
        vis.svg = d3.select("#allContestantDots")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

        // create circle containers
        vis.allContestantCircles = vis.svg.selectAll('circle')
            .data(vis.data);

        // append circles
        vis.allContestantCircles.enter().append('circle')
            .attr('cx', function(d){
                return d3.randomUniform(((d.season - 1) * (vis.width/21) + (vis.width/30)), (d.season * (vis.width/21)))();
            })
            .attr('cy', function(d){
                return d3.randomUniform(vis.margin.top + vis.padding, vis.height)()
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
        vis.allContestantDotLegendData = ["Bachelor contestants", "Bachelorette contestants"]
        vis.allContestantDotLegendColors = ["#75D6FF", "#FAB05A"]

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
            .attr('x',(d,i) => i*250 + vis.margin.left)

        vis.allContestantDotLegend.enter()
            .append("text")
            .attr("class","allContestantDotLegend-label")
            .text(d => d)
            .attr('y', 25)
            .attr('x',(d,i) => vis.margin.left + 30 + i*250)
            .style("font-size", "16px");

        // CREATE DOT PLOT 2: DIFFERENTIATE WINNERS
        vis.winnerDifferentiatedDots = d3.select("#winnerDifferentiatedDots")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

        // create circle containers
        vis.winnerDifferentiatedCircles = vis.winnerDifferentiatedDots.selectAll('circle')
            .data(vis.data);

        // append circles
        vis.winnerDifferentiatedCircles.enter().append('circle')
            .attr('cx', function(d){
                return d3.randomUniform(((d.season - 1) * (vis.width/21) + (vis.width/30)), (d.season * (vis.width/21)))();
            })
            .attr('cy', function(d){
                return d3.randomUniform(vis.margin.top, vis.height)()
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
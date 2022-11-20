class RunnerupVis {

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

        vis.svg = d3.select("#svg");
        
        vis.width = vis.svg.style("width").replace("px", "");
        vis.height = vis.svg.style("height").replace("px", "");

        vis.runnerupgroup = vis.svg
            .append("g")
            .attr("id", "runnerupgroup")
            .attr("opacity", 1)

        vis.allContestantDot = vis.runnerupgroup
            .append("g")
            .attr("id", "allContestantDot")
            .attr("opacity", 1)

        // append div container for tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'divTooltip')

        // CREATE LEGEND FOR DOT PLOT 1
        vis.allContestantDotLegendData = ["Bachelor contestants", "Bachelorette contestants"]
        vis.allContestantDotLegendColors = ["#75D6FF", "#FAB05A"]

        vis.allContestantDotLegend = vis.runnerupgroup
            .append('g')
            .attr("id", "allContestantDotLegend")
            .attr("opacity", 1)

        vis.seasonLabel = vis.allContestantDotLegend
            .append("g")
            .attr("id", "seasonLabel")
            .attr("opacity", 1)

        vis.contestantLabel = vis.allContestantDotLegend
            .append("g")
            .attr("id", "contestantLabel")
            .attr("opacity", 1)

        vis.contestantLabel
            .selectAll("rect")
            .data(vis.allContestantDotLegendData)
            .enter()
            .append("rect")
            .attr("class","allContestantDotLegend")
            .attr("width",15)
            .attr("height",15)
            .attr("fill", (d,i) => vis.allContestantDotLegendColors[i])
            .attr('y', 10)
            .attr('x',(d,i) => i*250 + vis.margin.left)

        vis.contestantLabel
            .selectAll("text")
            .data(vis.allContestantDotLegendData)
            .enter()
            .append("text")
            .attr("class","allContestantDotLegend-label")
            .text(d => d)
            .attr('y', 22)
            .attr('x',(d,i) => vis.margin.left + 20 + i*250)
            .style("font-size", "16px");

        vis.wrangleData();
    }

    wrangleData(){

        // filter data for only winners and runner ups
        let vis = this;

        vis.data = vis.data.filter(d => d.winner == 1 || d.runner_up == 1)
    }

updateRunnerup(){
        let vis = this;
        
        vis.runnerupgroup
            .transition()
            .attr("opacity", 1);

        vis.allContestantDotLegend
            .transition()
            .attr("opacity", 1);

        vis.highlights = vis.allContestantDot
            .selectAll(".allHighlights")
            .data(vis.data)

        vis.highlights
            .enter()
            .append("rect")
            .attr("class", "allHighlights")
            .merge(vis.highlights)
            .transition()
            .attr('x', function(d, i){
                return ((d.season - 1) * (vis.width/21) + (vis.width/75));

            })
            .attr('y', function(d){
                if (d.show === "Bachelorette"){
                    return 125 + vis.margin.top + vis.padding
                }
                else{
                    return 25 + vis.margin.top + vis.padding
                }
            })
            .attr('width', vis.width/25)
            .attr('height', 75)
            .attr('fill', function(d,i){
                if(d.show === "Bachelorette"){
                    return '#FAB05A'
                }else{
                    return '#75D6FF'
                }
            })
            .attr("opacity", 0)
            
            // create circle containers
        vis.allContestantCircles = vis.allContestantDot
        .selectAll(".allContestantCircles")
        .data(vis.data)

    vis.allContestantCircles
        .enter()
        .append('circle')
        .attr("class", "allContestantCircles")
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
        })
        .attr('fill', function(d,i){
            if(d.show === "Bachelorette"){
                return '#FAB05A'
            }else{
                return '#75D6FF'
            }
        })
            .merge(vis.allContestantCircles)
            .transition()
            .attr("opacity", d => (d.winner == 1 || d.runner_up == 1) ? 1 : 0)
            .attr('cx', function(d){
                if (d.winner == 1){
                    return (d.season - 1) * (vis.width/21) + (vis.width/50);
                }
                else if (d.runner_up == 1){
                    return (d.season - 1) * (vis.width/21) + (vis.width/50) + 10;
                }
            })
            .attr('cy', function(d){
                if (d.show === "Bachelorette"){
                    return 150 + vis.margin.top + vis.padding
                }
                else{
                    return 50 + vis.margin.top + vis.padding
                }
            })
            .attr("r", 3)

        // ADD LABELS TO CLUSTERS
        vis.seasonLabel
            .selectAll("text")
            .data(vis.data)
            .enter()
            .append("text")
            .attr("class", "allContestantCirclesSeasonLabels")
            .merge(vis.seasonLabel)
            .attr('x', function(d){
                if (d.show === "Bachelorette"){
                    return ((d.season - 1) * (vis.width/21) + (vis.width/50));
                }
                else{
                    return ((d.season - 1) * (vis.width/21) + (vis.width/50));
                }
            })
            .attr('y', function(d){
                if (d.show === "Bachelorette"){
                    return 115 + 100 + vis.margin.top
                }
                else{
                    return 115 + vis.margin.top
                }
            })
            .text(d => "S" + d.season)
            .style("font-size", 12)
    }

    updateRunnerupFIR(){
        let vis = this;
        
        vis.runnerupgroup
            .transition()
            .attr("opacity", 1);

        vis.allContestantDotLegend
            .transition()
            .attr("opacity", 1);
            
        vis.allContestantDot
            .selectAll(".allHighlights")
            .attr("opacity", function(d, i) {
                if (d.runner_up === 1 && d.fir === 1){
                    if (d.show === "Bachelorette"){
                        return 0.50
                    }else{
                        return 0.50
                    }}
                else{
                    return 0
                }
            })
            
        vis.allContestantDot
            .selectAll(".allContestantCircles")
            .data(vis.data)
            .merge(vis.allContestantCircles)
            .transition()
            .attr("opacity", d => (d.winner == 1 || d.runner_up == 1) ? 1 : 0)
            .attr('cx', function(d){
                if (d.winner == 1){
                    return (d.season - 1) * (vis.width/21) + (vis.width/50);
                }
                else if (d.runner_up == 1){
                    return (d.season - 1) * (vis.width/21) + (vis.width/50) + 10;
                }
            })
            .attr('cy', function(d){
                if (d.show === "Bachelorette"){
                    return 150 + vis.margin.top + vis.padding
                }
                else{
                    return 50 + vis.margin.top + vis.padding
                }
            })
            .attr("r", function(d){
                return d.fir == 1 ? 6 : 3
            })
        }

    updateRunnerupRoses(){
        let vis = this;
        
        vis.runnerupgroup
            .transition()
            .attr("opacity", 1);

        vis.allContestantDotLegend
            .transition()
            .attr("opacity", 1);

            vis.allContestantDot
            .selectAll(".allHighlights")
            .attr("opacity", function(d, i) {
                if (d.runner_up === 1 && d.fir === 1){
                    if ((d.show === "Bachelorette" && (d.season == 5 || d.season == 10 || d.season == 12)) ||
                        (d.show === "Bachelor" && (d.season == 12 || d.season == 14))){
                        return 0.5
                    }else{
                        return 0.0
                    }}


                else{
                    return 0
                }
            })
            
            vis.allContestantDot
            .selectAll(".allContestantCircles")
            .data(vis.data)
            .merge(vis.allContestantCircles)
            .transition()
            .attr("opacity", d => (d.winner == 1 || d.runner_up == 1) ? 1 : 0)
            .attr('cx', function(d){
                if (d.winner == 1){
                    return (d.season - 1) * (vis.width/21) + (vis.width/50);
                }
                else if (d.runner_up == 1){
                    return (d.season - 1) * (vis.width/21) + (vis.width/50) + 10;
                }
            })
            .attr('cy', function(d){
                if (d.show === "Bachelorette"){
                    return 150 + vis.margin.top + vis.padding
                }
                else{
                    return 50 + vis.margin.top + vis.padding
                }
            })
            .attr("r", function(d){
                return d.roses
            })
        }
    }
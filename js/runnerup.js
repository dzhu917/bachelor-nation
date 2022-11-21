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

        vis.seasons = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12,-13]

        vis.seasonLabel = vis.allContestantDotLegend
            .append("g")
            .attr("id", "seasonLabel")
            .attr("opacity", 1)

        vis.seasonLabel
            .selectAll("text")
            .data(vis.seasons)
            .enter()
            .append("text")
            .attr('x', function(d){
                if (d > 0){
                    return ((d - 1) % 7 * (vis.width / 7) + (vis.width / 14));
                }
                else if (d < 0){
                    return ((-d - 1) % 7 * (vis.width / 7) + (vis.width / 14));
                }
            })
            .attr('y', function(d){
                if (d > 0){
                    return (vis.height / 5) * (1 + Math.floor((d -1) / 7))
                }
                else if (d < 0){
                    return (vis.height * 3/5) + (vis.height / 5) * (1 + Math.floor((-d -1) / 7))
                }
            })
            .text(d => d > 0 ? "S" + d : "S" + -d)
            .style("font-size", 12)
            .attr("text-anchor", "middle")

        vis.highlights = vis.allContestantDot
            .selectAll(".allHighlights")
            .data(vis.seasons)

        vis.highlights
            .enter()
            .append("rect")
            .attr("class", "allHighlights")
            .merge(vis.highlights)
            .transition()
            .attr('x', function(d){
                if (d > 0){
                    return ((d - 1) % 7 * (vis.width / 7) + 3);
                }
                else if (d < 0){
                    return ((-d - 1) % 7 * (vis.width / 7) + 3);
                }
            })
            .attr('y', function(d){
                if (d > 0){
                    return (vis.height / 5) * (Math.floor((d -1) / 7)) + 3 + vis.margin.bottom
                }
                else if (d < 0){
                    return (vis.height * 3/5) + (vis.height / 5) * (Math.floor((-d -1) / 7)) + 3 + vis.margin.bottom
                }
            })
            .attr('width', vis.width/7 - 6)
            .attr('height', vis.height/5 - 6)
            .attr('fill', function(d,i){
                return d < 0 ? "#FAB05A" : "#75D6FF"
            })
            .attr("opacity", 0)

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
        
            .merge(vis.allContestantCircles)
            .transition()
            .attr("opacity", d => (d.winner == 1 || d.runner_up == 1) ? 1 : 0)
            .attr('cx', function(d){
                if(d.show === "Bachelor" && d.season == 11){
                    if(d.name === "DEANNA P"){
                        return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) + (vis.width / 75));
                    }
                    return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) - (vis.width / 75));
                }
                return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14));
            })
            .attr('cy', function(d){
                if (d.show === "Bachelorette"){
                    if (d.winner == 1){
                        return (vis.height * 3/5) + (vis.height / 5) * (Math.floor((d.season -1) / 7)) + (vis.height * 1/4 / 5)+ 3 + vis.margin.bottom
                    }
                    else if (d.runner_up == 1){
                        return (vis.height * 3/5) + (vis.height / 5) * (Math.floor((d.season -1) / 7)) + (vis.height * 1/2 / 5) + 3+ vis.margin.bottom
                    }
                }
                else if (d.show === "Bachelor"){
                    if (d.winner == 1){
                        return (vis.height / 5) * (Math.floor((d.season -1) / 7)) + (vis.height * 1/4 / 5) +3+ vis.margin.bottom
                    }
                    else if (d.runner_up == 1){
                        return (vis.height / 5) * (Math.floor((d.season -1) / 7)) + (vis.height * 1/2 / 5) + 3+ vis.margin.bottom
                    }
                }
            })
            .attr("r", 5)
            .attr('fill', function(d,i){
            if(d.show === "Bachelorette"){
                return '#FAB05A'
            }else{
                return '#75D6FF'
            }
        })

            vis.highlights = vis.allContestantDot
            .selectAll(".allHighlights")
            .data(vis.seasons)

        vis.highlights
            .enter()
            .append("rect")
            .attr("class", "allHighlights")
            .merge(vis.highlights)
            .transition()
            .attr('x', function(d){
                if (d > 0){
                    return ((d - 1) % 7 * (vis.width / 7) + 3);
                }
                else if (d < 0){
                    return ((-d - 1) % 7 * (vis.width / 7) + 3);
                }
            })
            .attr('y', function(d){
                if (d > 0){
                    return (vis.height / 5) * (Math.floor((d -1) / 7)) + 3
                }
                else if (d < 0){
                    return (vis.height * 3/5) + (vis.height / 5) * (Math.floor((-d -1) / 7)) + 3
                }
            })
            .attr('width', vis.width/7 - 6)
            .attr('height', vis.height/5 - 6)
            .attr('fill', function(d,i){
                return d < 0 ? "#FAB05A" : "#75D6FF"
            })
            .attr("opacity", 0)
    }

    updateRunnerupFIR(){
        let vis = this;
        
        vis.runnerupgroup
            .transition()
            .attr("opacity", 1);

        vis.allContestantDotLegend
            .transition()
            .attr("opacity", 1);

        
            
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
            .merge(vis.allContestantCircles)
            .transition()
            .attr("opacity", d => (d.winner == 1 || d.runner_up == 1) ? 1 : 0)
            .attr('cx', function(d){
                if(d.show === "Bachelor" && d.season == 11){
                    if(d.name === "DEANNA P"){
                        return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) + (vis.width / 75));
                    }
                    return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) - (vis.width / 75));
                }
                return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) );
            })
            .attr('cy', function(d){
                if (d.show === "Bachelorette"){
                    if (d.winner == 1){
                        return (vis.height * 3/5) + (vis.height / 5) * (Math.floor((d.season -1) / 7)) + (vis.height * 1/4 / 5)+ 3 + vis.margin.bottom
                    }
                    else if (d.runner_up == 1){
                        return (vis.height * 3/5) + (vis.height / 5) * (Math.floor((d.season -1) / 7)) + (vis.height * 1/2 / 5) + 3+ vis.margin.bottom
                    }
                }
                else if (d.show === "Bachelor"){
                    if (d.winner == 1){
                        return (vis.height / 5) * (Math.floor((d.season -1) / 7)) + (vis.height * 1/4 / 5) +3+ vis.margin.bottom
                    }
                    else if (d.runner_up == 1){
                        return (vis.height / 5) * (Math.floor((d.season -1) / 7)) + (vis.height * 1/2 / 5) + 3+ vis.margin.bottom
                    }
                }
            })
            .attr("r", 5)
            .attr('fill', function(d,i){
                if(d.fir == 1){
                    return "#FF0000"
                }
                if(d.show === "Bachelorette"){
                    return '#FAB05A'
                }else{
                    return '#75D6FF'
                }
            })

            vis.highlights = vis.allContestantDot
            .selectAll(".allHighlights")
            .data(vis.seasons)

        vis.highlights
            .enter()
            .append("rect")
            .attr("class", "allHighlights")
            .merge(vis.highlights)
            .transition()
            .attr('x', function(d){
                if (d > 0){
                    return ((d - 1) % 7 * (vis.width / 7) + 3);
                }
                else if (d < 0){
                    return ((-d - 1) % 7 * (vis.width / 7) + 3);
                }
            })
            .attr('y', function(d){
                if (d > 0){
                    return (vis.height / 5) * (Math.floor((d -1) / 7)) + 3 + vis.margin.bottom
                }
                else if (d < 0){
                    return (vis.height * 3/5) + (vis.height / 5) * (Math.floor((-d -1) / 7)) + 3 + vis.margin.bottom
                }
            })
            .attr('width', vis.width/7 - 6)
            .attr('height', vis.height/5 - 6)
            .attr('fill', function(d,i){
                return d < 0 ? "#FAB05A" : "#75D6FF"
            })
            // change opacity if d.fir == 1
            .attr('opacity', function(d){
                return (d == 11 || d == 14 || d == 16 || d == -9) ? 0.5 : 0
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
            .merge(vis.allContestantCircles)
            .transition()
            .attr('cx', function(d){
                if(d.show === "Bachelor" && d.season == 11){
                    if(d.name === "DEANNA P"){
                        return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) + (vis.width / 75));
                    }
                    return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) - (vis.width / 75));
                }
                return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) );
            })
            .attr('cy', function(d){
                if (d.show === "Bachelorette"){
                    if (d.winner == 1){
                        return (vis.height * 3/5) + (vis.height / 5) * (Math.floor((d.season -1) / 7)) + (vis.height * 1/4 / 5)+ 3+ vis.margin.bottom
                    }
                    else if (d.runner_up == 1){
                        return (vis.height * 3/5) + (vis.height / 5) * (Math.floor((d.season -1) / 7)) + (vis.height * 1/2 / 5) + 3+ vis.margin.bottom
                    }
                }
                else if (d.show === "Bachelor"){
                    if (d.winner == 1){
                        return (vis.height / 5) * (Math.floor((d.season -1) / 7)) + (vis.height * 1/4 / 5) +3+ vis.margin.bottom
                    }
                    else if (d.runner_up == 1){
                        return (vis.height / 5) * (Math.floor((d.season -1) / 7)) + (vis.height * 1/2 / 5) + 3+ vis.margin.bottom
                    }
                }
            })
            .attr("r", d => Math.sqrt(d.roses) * 5)
            .attr('fill', function(d,i){
                if(d.fir == 1){
                    return "#FF0000"
                }
                if(d.show === "Bachelorette"){
                    return '#FAB05A'
                }else{
                    return '#75D6FF'
                }
            })

            vis.highlights = vis.allContestantDot
            .selectAll(".allHighlights")
            .data(vis.seasons)

        vis.highlights
            .enter()
            .append("rect")
            .attr("class", "allHighlights")
            .merge(vis.highlights)
            .transition()
            .attr('x', function(d){
                if (d > 0){
                    return ((d - 1) % 7 * (vis.width / 7) + 3);
                }
                else if (d < 0){
                    return ((-d - 1) % 7 * (vis.width / 7) + 3);
                }
            })
            .attr('y', function(d){
                if (d > 0){
                    return (vis.height / 5) * (Math.floor((d -1) / 7)) + 3+ vis.margin.bottom
                }
                else if (d < 0){
                    return (vis.height * 3/5) + (vis.height / 5) * (Math.floor((-d -1) / 7)) + 3+ vis.margin.bottom
                }
            })
            .attr('width', vis.width/7 - 6)
            .attr('height', vis.height/5 - 6)
            .attr('fill', function(d,i){
                return d < 0 ? "#FAB05A" : "#75D6FF"
            })
            // change opacity if d.fir == 1
            .attr("opacity", function(d, i) {
                if (d == -5 || d == -10 || d == -12 || d == 12 || d == 14){
                    return 0.5
                }else{
                    return 0.0
                }
        })


 
            
            
            
        }
    }
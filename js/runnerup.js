class RunnerupVis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis()
    }

    initVis() {
        let vis = this

        // Margin object with properties for the four directions
        vis.margin = { top: 20, right: 40, bottom: 20, left: 20 };

        vis.padding = 30;

        vis.svg = d3.select("#svg");

        vis.width = vis.svg.style("width").replace("px", "");
        vis.height = vis.svg.style("height").replace("px", "");

        // Group for all elements
        vis.runnerupgroup = vis.svg
            .append("g")
            .attr("id", "runnerupgroup")
            .attr("visibility", "hidden")

        // Group for dots
        vis.allContestantDot = vis.runnerupgroup
            .append("g")
            .attr("id", "allContestantDot")

        // Append div container for tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'divTooltip')

        // Create legend
        vis.allContestantDotLegend = vis.runnerupgroup
            .append('g')
            .attr("id", "allContestantDotLegend")
            .attr("visibility", "visibile")

        vis.contestantLabel = vis.allContestantDotLegend
            .append("g")
            .attr("id", "contestantLabel")

        vis.contestantLabel
            .append("text")
            .text("Bachelor contestants")
            .attr('y', vis.height * 1/50)
            .attr('x', vis.width / 20)
            .style("font-size", "16px")

        vis.contestantLabel
            .append("text")
            .text("Bachelorette contestants")
            .attr('y', vis.height * (3 / 5 + 1/50))
            .attr('x', vis.width / 20)
            .style("font-size", "16px")

        vis.seasons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13]

        vis.seasonLabel = vis.allContestantDotLegend
            .append("g")
            .attr("id", "seasonLabel")

        vis.seasonLabel
            .selectAll("text")
            .data(vis.seasons)
            .enter()
            .append("text")
            .attr('x', function (d) {
                if (d > 0) {
                    return ((d - 1) % 7 * (vis.width / 7) + (vis.width / 14));
                }
                else if (d < 0) {
                    return ((-d - 1) % 7 * (vis.width / 7) + (vis.width / 14));
                }
            })
            .attr('y', function (d) {
                if (d > 0) {
                    return (vis.height / 5) * (1 + Math.floor((d - 1) / 7)) - vis.margin.bottom
                }
                else if (d < 0) {
                    return (vis.height * 3 / 5) + (vis.height / 5) * (1 + Math.floor((-d - 1) / 7)) - vis.margin.bottom
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
            .attr('x', function (d) {
                if (d > 0) {
                    return ((d - 1) % 7 * (vis.width / 7) + 3);
                }
                else if (d < 0) {
                    return ((-d - 1) % 7 * (vis.width / 7) + 3);
                }
            })
            .attr('y', function (d) {
                if (d > 0) {
                    return (vis.height / 5) * (Math.floor((d - 1) / 7)) + 3
                }
                else if (d < 0) {
                    return (vis.height * 3 / 5) + (vis.height / 5) * (Math.floor((-d - 1) / 7)) + 3
                }
            })
            .attr("rx", 10)
            .attr('width', vis.width / 7 - 6)
            .attr('height', vis.height / 5 - 6)
            .attr("stroke-width", 5)
            .attr('stroke', function (d, i) {
                return d < 0 ? "#D7A7A0" : "#E0D188"
            })
            .attr('stroke-opacity', 0)
            .attr("fill-opacity", 0)

        vis.wrangleData();
    }

    wrangleData() {

        // filter data for only winners and runner ups
        let vis = this;

        vis.data = vis.data.filter(d => d.winner == 1 || d.runner_up == 1)
    }

updateRunnerup() {
        let vis = this;

        vis.runnerupgroup
            .transition()
            .attr("visibility", "visible")
        
        // create circle containers
        vis.allContestantCircles = vis.allContestantDot
            .selectAll(".allContestantCircles")
            .data(vis.data)

        vis.allContestantCircles
            .enter()
            .append('circle')
            .attr("class", "allContestantCircles")
            .on("mouseover", function (event, d) {
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 3px;">
                 <p style="color: #242635; font-weight: bold;">${d.name}</p>
                 <p style="color: #242635; line-height: 0.5"> ${d.show} season ${d.season} ${d.winner == 1 ? "winner" : "runner-up"}</p>                 
             </div>\``);

                d3.select(this)
                    .style("stroke", "black")
            })
            .on("mouseout", function () {
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
            .attr('cx', function (d) {
                if (d.show === "Bachelor" && d.season == 11) {
                    if (d.name === "DEANNA P") {
                        return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) + (vis.width / 75));
                    }
                    return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) - (vis.width / 75));
                }
                return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14));
            })
            .attr('cy', function (d) {
                if (d.show === "Bachelorette") {
                    if (d.winner == 1) {
                        return (vis.height * 3 / 5) + (vis.height / 5) * (Math.floor((d.season - 1) / 7)) + (vis.height * 1 / 4 / 5) + 3
                    }
                    else if (d.runner_up == 1) {
                        return (vis.height * 3 / 5) + (vis.height / 5) * (Math.floor((d.season - 1) / 7)) + (vis.height * 1 / 2 / 5) + 3
                    }
                }
                else if (d.show === "Bachelor") {
                    if (d.winner == 1) {
                        return (vis.height / 5) * (Math.floor((d.season - 1) / 7)) + (vis.height * 1 / 4 / 5) + 3
                    }
                    else if (d.runner_up == 1) {
                        return (vis.height / 5) * (Math.floor((d.season - 1) / 7)) + (vis.height * 1 / 2 / 5) + 3
                    }
                }
            })
            .attr("r", 5)
            .attr('fill', function (d, i) {
                if (d.show === "Bachelorette") {
                    return '#E0D188'
                } else {
                    return '#D7A7A0'
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
            .attr('x', function (d) {
                if (d > 0) {
                    return ((d - 1) % 7 * (vis.width / 7) + 3);
                }
                else if (d < 0) {
                    return ((-d - 1) % 7 * (vis.width / 7) + 3);
                }
            })
            .attr('y', function (d) {
                if (d > 0) {
                    return (vis.height / 5) * (Math.floor((d - 1) / 7)) + 3
                }
                else if (d < 0) {
                    return (vis.height * 3 / 5) + (vis.height / 5) * (Math.floor((-d - 1) / 7)) + 3
                }
            })
            .attr('width', vis.width / 7 - 6)
            .attr('height', vis.height / 5 - 6)
            .attr("stroke-width", 5)
            .attr('stroke', function (d, i) {
                return d < 0 ? "#D7A7A0" : "#E0D188"
            })
            .attr('stroke-opacity', 0)
            .attr("fill-opacity", 0)
    }

    updateRunnerupFIR() {
        let vis = this;

        vis.runnerupgroup
            .transition()
            .attr("visibility", "visible")

        // create circle containers
        vis.allContestantCircles = vis.allContestantDot
            .selectAll(".allContestantCircles")
            .data(vis.data)

        vis.allContestantCircles
            .enter()
            .append('circle')
            .attr("class", "allContestantCircles")
            .on("mouseover", function (event, d) {
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 3px;">
                 <p style="color: #242635; font-weight: bold;">${d.name}</p>
                 <p style="color: #242635; line-height: 0.5"> ${d.show} season ${d.season} ${d.winner == 1 ? "winner" : "runner-up"}</p>                 
             </div>\``);

                d3.select(this)
                    .style("stroke", "black")
            })
            .on("mouseout", function () {
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
            .attr('cx', function (d) {
                if (d.show === "Bachelor" && d.season == 11) {
                    if (d.name === "DEANNA P") {
                        return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) + (vis.width / 75));
                    }
                    return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) - (vis.width / 75));
                }
                return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14));
            })
            .attr('cy', function (d) {
                if (d.show === "Bachelorette") {
                    if (d.winner == 1) {
                        return (vis.height * 3 / 5) + (vis.height / 5) * (Math.floor((d.season - 1) / 7)) + (vis.height * 1 / 4 / 5) + 3
                    }
                    else if (d.runner_up == 1) {
                        return (vis.height * 3 / 5) + (vis.height / 5) * (Math.floor((d.season - 1) / 7)) + (vis.height * 1 / 2 / 5) + 3
                    }
                }
                else if (d.show === "Bachelor") {
                    if (d.winner == 1) {
                        return (vis.height / 5) * (Math.floor((d.season - 1) / 7)) + (vis.height * 1 / 4 / 5) + 3
                    }
                    else if (d.runner_up == 1) {
                        return (vis.height / 5) * (Math.floor((d.season - 1) / 7)) + (vis.height * 1 / 2 / 5) + 3 
                    }
                }
            })
            .attr("r", function(d) {
                if ((d.show == "Bachelor" && (d.season == 11 || d.season == 14 || d.season == 16 || d.season == 17 || d.season == 21)) || (d.show == "Bachelorette" && (d.season == 4 || d.season == 6 || d.season == 9 || d.season == 11 || d.season == 12 || d.season == 13))) {
                    return 5
                }
                else {
                    return 0
                }})
            .attr('fill', function (d, i) {
                if (d.fir == 1) {
                    return "#FF0000"
                }
                if (d.show === "Bachelorette") {
                    return '#E0D188'
                } else {
                    return '#D7A7A0'
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
            .attr('x', function (d) {
                if (d > 0) {
                    return ((d - 1) % 7 * (vis.width / 7) + 3);
                }
                else if (d < 0) {
                    return ((-d - 1) % 7 * (vis.width / 7) + 3);
                }
            })
            .attr('y', function (d) {
                if (d > 0) {
                    return (vis.height / 5) * (Math.floor((d - 1) / 7)) + 3
                }
                else if (d < 0) {
                    return (vis.height * 3 / 5) + (vis.height / 5) * (Math.floor((-d - 1) / 7)) + 3
                }
            })
            .attr('width', vis.width / 7 - 6)
            .attr('height', vis.height / 5 - 6)
            .attr("stroke-width", 5)
            .attr('stroke', function (d, i) {
                return d > 0 ? "#D7A7A0" : "#E0D188"
            })
            // change opacity if d.fir == 1
            .attr('stroke-opacity', function (d) {
                return (d == 11 || d == 14 || d == 16 || d == -9) ? 0.5 : 0})
            .attr("stroke-dasharray", function (d) {
                return (d == 11 || d == 14 || d == 16 || d == -9) ? "7,7" : "0"}
            )
            
    }

    updateRunnerupRoses() {
        let vis = this;

        vis.runnerupgroup
            .transition()
            .attr("visibility", "visible")

        // create circle containers
        vis.allContestantCircles = vis.allContestantDot
            .selectAll(".allContestantCircles")
            .data(vis.data)

        vis.allContestantCircles
            .enter()
            .append('circle')
            .attr("class", "allContestantCircles")
            .merge(vis.allContestantCircles)
            .on("mouseover", function (event, d) {
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 3px;">
                 <p style="color: #242635; font-weight: bold;">${d.name}</p>
                 <p style="color: #242635; line-height: 0.5"> ${d.show} season ${d.season} ${d.winner == 1 ? "winner" : "runner-up"}</p>
                 <p style="color: #242635; line-height: 0.5"> Went on ${d.roses} dates</p>                 
             </div>\``);

                d3.select(this)
                    .style("stroke", "black")
            })
            .on("mouseout", function () {
                d3.select(this)
                    .attr("opacity", "1")
                    .attr("stroke-width", 0)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .transition()
            .attr('cx', function (d) {
                if (d.show === "Bachelor" && d.season == 11) {
                    if (d.name === "DEANNA P") {
                        return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) + (vis.width / 75));
                    }
                    return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14) - (vis.width / 75));
                }
                return ((d.season - 1) % 7 * (vis.width / 7) + (vis.width / 14));
            })
            .attr('cy', function (d) {
                if (d.show === "Bachelorette") {
                    if (d.winner == 1) {
                        return (vis.height * 3 / 5) + (vis.height / 5) * (Math.floor((d.season - 1) / 7)) + (vis.height * 1 / 4 / 5) + 3
                    }
                    else if (d.runner_up == 1) {
                        return (vis.height * 3 / 5) + (vis.height / 5) * (Math.floor((d.season - 1) / 7)) + (vis.height * 1 / 2 / 5) + 3
                    }
                }
                else if (d.show === "Bachelor") {
                    if (d.winner == 1) {
                        return (vis.height / 5) * (Math.floor((d.season - 1) / 7)) + (vis.height * 1 / 4 / 5) + 3
                    }
                    else if (d.runner_up == 1) {
                        return (vis.height / 5) * (Math.floor((d.season - 1) / 7)) + (vis.height * 1 / 2 / 5) + 3
                    }
                }
            })
            .attr("r", d => Math.sqrt(d.roses) * 5)
            .attr('fill', function (d, i) {
                if (d.show === "Bachelorette") {
                    return '#E0D188'
                } else {
                    return '#D7A7A0'
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
            .attr('x', function (d) {
                if (d > 0) {
                    return ((d - 1) % 7 * (vis.width / 7) + 3);
                }
                else if (d < 0) {
                    return ((-d - 1) % 7 * (vis.width / 7) + 3);
                }
            })
            .attr('y', function (d) {
                if (d > 0) {
                    return (vis.height / 5) * (Math.floor((d - 1) / 7)) + 3
                }
                else if (d < 0) {
                    return (vis.height * 3 / 5) + (vis.height / 5) * (Math.floor((-d - 1) / 7)) + 3
                }
            })
            .attr('width', vis.width / 7 - 6)
            .attr('height', vis.height / 5 - 6)
            .attr("stroke-width", 5)
            .attr('stroke', function (d, i) {
                return d > 0 ? "#D7A7A0" : "#E0D188"
            })
            .attr("stroke-opacity", function (d, i) {
                if (d == -5 || d == -10 || d == -12 || d == 12 || d == 14) {
                    return 0.5
                } else {
                    return 0
                }
            })
            .attr("stroke-dasharray", function (d, i) {
                if (d == -5 || d == -10 || d == -12 || d == 12 || d == 14) {
                    return "7,7"
                } else {
                    return "0"
                }
            })

    }
}
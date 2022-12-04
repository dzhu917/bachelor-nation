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
                return d < 0 ? "#DEFFBO" : "#F59BBB"
            })
            .attr('stroke-opacity', 0)
            .attr("fill-opacity", 0)

        vis.ruIntroLegend = d3.select("#ru-intro-legend")
            .append("svg")
            .attr("id", "ru-intro-legend-svg")
            .attr("height", 125)

        vis.ruIntroLegend
            .append("rect")
            .attr("x", 5)
            .attr("y", 5)
            .attr("width", 60)
            .attr("height", 100)
            .attr("fill-opacity", 0)
            .attr("stroke", "#D7A7A0")
            .attr("stroke-width", 2)

        
        vis.ruIntroLegend
            .append("circle")
            .attr("cx", 35)
            .attr("cy", 20)
            .attr("r", 5)
            .attr("fill", "#66c000")

        vis.ruIntroLegend
            .append("text")
            .text("← Winner")
            .attr("x", 70)
            .attr("y", 25)

        vis.ruIntroLegend
            .append("circle")
            .attr("cx", 35)
            .attr("cy", 60)
            .attr("r", 5)
            .attr("fill", "#DEFFB0")

        vis.ruIntroLegend
            .append("text")
            .text("← Runner up")
            .attr("x", 70)
            .attr("y", 65)

        vis.ruIntroLegend
            .append("text")
            .text("S1")
            .attr("x", 35)
            .attr("y", 100)
            .attr("text-anchor", "middle")
            .style("font-size", 12)

        vis.ruFirLegend = d3.select("#ru-fir-legend")
            .append("svg")
            .attr("id", "ru-fir-legend-svg")
            .attr("height", 200)
            .attr("width", 350)
        
        vis.ruFirLegend
            .append("circle")
            .attr("cx", 40)
            .attr("cy", 20)
            .attr("r", 8)
            .attr("fill", "#C8BAFB")

        vis.ruFirLegend
            .append("text")
            .text("← Received first impression rose")
            .attr("x", 60)
            .attr("y", 25)

        vis.ruFirLegend
            .append("rect")
            .attr("x", 5)
            .attr("y", 60)
            .attr("height", 60)
            .attr("width", 35)
            .attr("stroke-width", 5)
            .attr('stroke', function (d, i) {
                return d < 0 ? "#DEFFBO" : "#F59BBB"
            })
            .attr('stroke-opacity', 0.5)
            .attr("fill-opacity", 0)
            .attr("stroke-dasharray", "7,7")

        vis.ruFirLegend
            .append("text")
            .text("← Winner did not receive the")
            .attr("x", 60)
            .attr("y", 80)

        vis.ruFirLegend
            .append("text")
            .text("first impression rose")
            .attr("x", 60)
            .attr("y", 100)

        vis.ruDatesLegend = d3.select("#ru-dates-legend")
            .append("svg")
            .attr("id", "ru-dates-legend-svg")
            .attr("height", 200)
            .attr("width", 350)

        vis.ruDatesLegend
            .append("circle")
            .attr("cx", 20)
            .attr("cy", 20)
            .attr("r", 5)
            .attr("fill", "#DEFFB0")

        vis.ruDatesLegend
            .append("circle")
            .attr("cx", 95)
            .attr("cy", 20)
            .attr("r", Math.sqrt(4) * 5)
            .attr("fill", "#DEFFB0")

        vis.ruDatesLegend
            .append("circle")
            .attr("cx", 170)
            .attr("cy", 20)
            .attr("r", Math.sqrt(7) * 5)
            .attr("fill", "#DEFFB0")

        // insert x axes with tickes 1, 4, and 7 using d3.axes
        vis.ruDatesLegend
            .append("g")
            .attr("id", "bottom")
            .attr("transform", "translate(20, 50)")
        
        
        let scale = d3.scaleOrdinal().domain(["1 date", "4 dates", "7 dates"]).range([0, 75, 150]);

        let axisBottom = d3.axisBottom(scale)

        d3.select('#bottom').call(axisBottom);
            
        vis.ruDatesLegend
            .append("rect")
            .attr("x", 5)
            .attr("y", 100)
            .attr("height", 60)
            .attr("width", 35)
            .attr("stroke-width", 5)
            .attr('stroke', function (d, i) {
                return d < 0 ? "#DEFFBO" : "#F59BBB"
            })
            .attr('stroke-opacity', 0.5)
            .attr("fill-opacity", 0)
            .attr("stroke-dasharray", "7,7")

        vis.ruDatesLegend
            .append("text")
            .text("← Winner went on fewer dates")
            .attr("x", 60)
            .attr("y", 120)

        vis.ruDatesLegend
            .append("text")
            .text("than the runner up")
            .attr("x", 60)
            .attr("y", 140)
        
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
            .merge(vis.allContestantCircles)
            .on("mouseover", function (event, d) {
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 3px;">
                 <p style="color: #242635; font-weight: bold;">${d.name}</p>
                 <p style="color: #242635"> ${d.show} season ${d.season} ${d.winner == 1 ? "winner" : "runner-up"}</p>                 
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
            .attr("opacity", d => (d.winner == 1 || d.runner_up == 1) ? 1 : 0)
            .attr('cx', function (d) {
                if (d.show === "Bachelor" && d.season == 11) {
                    if (d.name === "Deanna P") {
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
                    if (d.winner == 1) {
                        return "#FF005A"
                    }
                    else{
                        return '#F59BBB'
                    }
                } else {
                    if (d.winner == 1) {
                        return "#66C000"
                    }
                    else{
                        return '#DEFFB0'
                    }
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
                return d < 0 ? "#DEFFBO" : "#F59BBB"
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
            .merge(vis.allContestantCircles)
            .on("mouseover", function (event, d) {
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 3px;">
                 <p style="color: #242635; font-weight: bold;">${d.name}</p>
                 <p style="color: #242635;"> ${d.show} season ${d.season} ${d.winner == 1 ? "winner" : "runner-up"}</p>                 
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
            .attr("opacity", d => (d.winner == 1 || d.runner_up == 1) ? 1 : 0)
            .attr('cx', function (d) {
                if (d.show === "Bachelor" && d.season == 11) {
                    if (d.name === "Deanna P") {
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
                    if (d.fir == 1) {
                        return 8
                    }
                    else{
                        return 5
                    }
                }
                else {
                    return 0
                }})
            .attr('fill', function (d, i) {
                if (d.fir == 1) {
                    return "#C8BAFB"
                }
                if (d.show === "Bachelorette") {
                    return '#F59BBB'
                } else {
                    return '#DEFFB0'
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
                return d < 0 ? "#DEFFBO" : "#F59BBB"
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
                 <p style="color: #242635;"> ${d.show} season ${d.season} ${d.winner == 1 ? "winner" : "runner-up"}</p>
                 <p style="color: #242635;"> Went on ${d.roses} dates</p>                 
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
                    if (d.name === "Deanna P") {
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
                    if (d.winner == 1) {
                        return "#FF005A"
                    }
                    else{
                        return '#F59BBB'
                    }
                } else {
                    if (d.winner == 1) {
                        return "#66C000"
                    }
                    else{
                        return '#DEFFB0'
                    }
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
                return d < 0 ? "#DEFFBO" : "#F59BBB"
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
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

        vis.svg = d3.select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

        // Add visualization
        vis.initAllDotsVis();
        vis.initWinnerDotsVis();
        vis.initElimWeekDotsVis();
        vis.initSortedElimWeekDotsVis();

        vis.wrangleData();
    }

    initAllDotsVis(){
        let vis = this

        // DOT PLOT 1: FOR ALL CONTESTANTS

        // create circle containers
        vis.allContestantCircles = vis.svg.selectAll('.allContestantCircles')
            .data(vis.data);

        // append div container for tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'divTooltip')

        // append circles
        vis.allContestantCircles.enter()
            .append('circle')
            .attr("class", "allContestantCircles")
            .merge(vis.allContestantCircles)
            .attr('cx', function(d){
                if (d.show === "Bachelorette"){
                    return d3.randomUniform(((d.season - 1) * (vis.width/21) + (vis.width/50)), (d.season * (vis.width/21)))();
                }
                else{
                    return d3.randomUniform(((d.season - 1) * (vis.width/21) + (vis.width/50)), (d.season * (vis.width/21)))();
                }
            })
            .attr('cy', function(d){
                if (d.show === "Bachelorette"){
                    return 90 + (d3.randomUniform(vis.margin.top + vis.padding, 100)())
                }
                else{
                    return d3.randomUniform(vis.margin.top + vis.padding, 100)()
                }
            })
            .attr('r', 3)
            .attr('fill', function(d,i){
                if(d.show === "Bachelorette"){
                    return '#FAB05A'
                }else{
                    return '#75D6FF'
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

        // ADD LABELS TO CLUSTERS
        vis.allContestantCircles.enter()
            .append("text")
            .attr("class", "allContestantCirclesSeasonLabels")
            .merge(vis.allContestantCircles)
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
                    return 90 + 100 + vis.margin.top
                }
                else{
                    return 100 + vis.margin.top
                }
            })
            .text(d => "S" + d.season)
            .style("font-size", 12)

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
            .attr("width",15)
            .attr("height",15)
            .attr("fill", (d,i) => vis.allContestantDotLegendColors[i])
            .attr('y', 10)
            .attr('x',(d,i) => i*250 + vis.margin.left)

        vis.allContestantDotLegend.enter()
            .append("text")
            .attr("class","allContestantDotLegend-label")
            .text(d => d)
            .attr('y', 22)
            .attr('x',(d,i) => vis.margin.left + 20 + i*250)
            .style("font-size", "16px");
    }

    initWinnerDotsVis(){
        let vis = this

        // CREATE DOT PLOT 2: DIFFERENTIATE WINNERS

        vis.winnerDifferentiatedCircles = vis.svg
            .selectAll(".winnerDifferentiatedCircles")
            .enter()
            .append('g')
            .data(vis.data)

        // append circles
        vis.winnerDifferentiatedCircles.enter()
            .append('circle')
            .attr('class', 'winnerDifferentiatedCircles')
            .attr('cx', function(d){
                if (d.show === "Bachelorette"){
                    return d3.randomUniform(((d.season - 1) * (vis.width/21) + (vis.width/50)), (d.season * (vis.width/21)))();
                }
                else{
                    return d3.randomUniform(((d.season - 1) * (vis.width/21) + (vis.width/50)), (d.season * (vis.width/21)))();
                }
            })
            .attr('cy', function(d){
                if (d.show === "Bachelorette"){
                    return 200 + 90 + (d3.randomUniform(vis.margin.top + vis.padding, 100)())
                }
                else{
                    return 200 + d3.randomUniform(vis.margin.top + vis.padding, 100)()
                }
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
                    return '#2D87AD'
                }
                else if(d.show === "Bachelorette" & d.winner === 0){
                    return '#75D6FF'
                }
                else if(d.show === "Bachelor" & d.winner === 1){
                    return '#AD6A1C'
                }
                else {
                    return '#FAB05A'
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

        // ADD LABELS TO CLUSTERS
        vis.winnerDifferentiatedCircles.enter()
            .append("text")
            .attr("class", "allContestantCirclesSeasonLabels")
            .merge(vis.winnerDifferentiatedCircles)
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
                    return 200 + 90 + 100 + vis.margin.top
                }
                else{
                    return 200 + 100 + vis.margin.top
                }
            })
            .text(d => "S" + d.season)
            .style("font-size", 12)

    }

    initElimWeekDotsVis(){
        let vis = this

        // CREATE DOT PLOT 3: DIFFERENTIATE BY ELIMINATION WEEK

        vis.elimWeekDifferentiatedCircles = vis.svg
            .selectAll(".elimWeekDifferentiatedCircles")
            .enter()
            .append('g')
            .data(vis.data)

        // append circles
        vis.elimWeekDifferentiatedCircles.enter()
            .append('circle')
            .attr('class', 'elimWeekDifferentiatedCircles')
            .attr('cx', function(d){
                if (d.show === "Bachelorette"){
                    return d3.randomUniform(((d.season - 1) * (vis.width/21) + (vis.width/50)), (d.season * (vis.width/21)))();
                }
                else{
                    return d3.randomUniform(((d.season - 1) * (vis.width/21) + (vis.width/50)), (d.season * (vis.width/21)))();
                }
            })
            .attr('cy', function(d){
                if (d.show === "Bachelorette"){
                    return 400 + 90 + (d3.randomUniform(vis.margin.top + vis.padding, 100)())
                }
                else{
                    return 400 + d3.randomUniform(vis.margin.top + vis.padding, 100)()
                }
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
                if(d.show == "Bachelorette"){
                    if(d.winner === 1){
                        return '#2d87ad'
                    }
                    else if(d.elim_week === 10){
                        return '#4690b3'
                    }
                    else if(d.elim_week === 9){
                        return '#5a99ba'
                    }
                    else if(d.elim_week === 8){
                        return '#6ba2c0'
                    }
                    else if(d.elim_week === 7){
                        return '#7cacc6'
                    }
                    else if(d.elim_week === 6){
                        return '#8cb5cd'
                    }
                    else if(d.elim_week === 5){
                        return '#9cbed3'
                    }
                    else if(d.elim_week === 4){
                        return '#abc8da'
                    }
                    else if(d.elim_week === 3){
                        return '#bbd2e0'
                    }
                    else if(d.elim_week === 2){
                        return '#cadbe7'
                    }
                    else if(d.elim_week === 1){
                        return '#d9e5ed'
                    }
                    else {
                        return '#d9e5ed'
                    }
                }
                else{
                    if(d.winner === 1){
                        return '#AD6A1C'
                    }
                    else if(d.elim_week === 10){
                        return '#b67631'
                    }
                    else if(d.elim_week === 9){
                        return '#bf8244'
                    }
                    else if(d.elim_week === 8){
                        return '#c88f57'
                    }
                    else if(d.elim_week === 7){
                        return '#d09b6a'
                    }
                    else if(d.elim_week === 6){
                        return '#d8a87d'
                    }
                    else if(d.elim_week === 5){
                        return '#dfb590'
                    }
                    else if(d.elim_week === 4){
                        return '#e6c2a3'
                    }
                    else if(d.elim_week === 3){
                        return '#eccfb7'
                    }
                    else if(d.elim_week === 2){
                        return '#f2ddcb'
                    }
                    else if(d.elim_week === 1){
                        return '#f8eadf'
                    }
                    else {
                        return '#f8eadf'
                    }

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

        // ADD LABELS TO CLUSTERS
        vis.elimWeekDifferentiatedCircles.enter()
            .append("text")
            .attr("class", "allContestantCirclesSeasonLabels")
            .merge(vis.elimWeekDifferentiatedCircles)
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
                    return 400 + 90 + 100 + vis.margin.top
                }
                else{
                    return 400 + 100 + vis.margin.top
                }
            })
            .text(d => "S" + d.season)
            .style("font-size", 12)
    }

    initSortedElimWeekDotsVis(){
        let vis = this

        // CREATE DOT PLOT 4: SORT THE DOTS DIFFERENTIATED BY ELIMINATION WEEK

        vis.elimWeekDifferentiatedCircles = vis.svg
            .selectAll(".elimWeekDifferentiatedCircles")
            .enter()
            .append('g')
            .data(vis.data)

        // append circles
        vis.elimWeekDifferentiatedCircles.enter()
            .append('circle')
            .attr('class', 'elimWeekDifferentiatedCircles')
            .attr('cx', function(d){
                if (d.show === "Bachelorette"){
                    return d3.randomUniform(((d.season - 1) * (vis.width/21) + (vis.width/50)), (d.season * (vis.width/21)))();
                }
                else{
                    return d3.randomUniform(((d.season - 1) * (vis.width/21) + (vis.width/50)), (d.season * (vis.width/21)))();
                }
            })
            .attr('cy', function(d){
                if (d.show === "Bachelor" & d.winner === 1){
                    return 700
                }
                else if (d.show === "Bachelor" & d.winner === 0){
                    return 640 + d.elim_week * 6
                }
                else if (d.show === "Bachelorette" & d.winner === 1){
                    return 700 + 100
                }
                else{
                    return 640 + 100 + d.elim_week * 6
                }
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
                if(d.show == "Bachelorette"){
                    if(d.winner === 1){
                        return '#2d87ad'
                    }
                    else if(d.elim_week === 10){
                        return '#4690b3'
                    }
                    else if(d.elim_week === 9){
                        return '#5a99ba'
                    }
                    else if(d.elim_week === 8){
                        return '#6ba2c0'
                    }
                    else if(d.elim_week === 7){
                        return '#7cacc6'
                    }
                    else if(d.elim_week === 6){
                        return '#8cb5cd'
                    }
                    else if(d.elim_week === 5){
                        return '#9cbed3'
                    }
                    else if(d.elim_week === 4){
                        return '#abc8da'
                    }
                    else if(d.elim_week === 3){
                        return '#bbd2e0'
                    }
                    else if(d.elim_week === 2){
                        return '#cadbe7'
                    }
                    else if(d.elim_week === 1){
                        return '#d9e5ed'
                    }
                    else {
                        return '#d9e5ed'
                    }
                }
                else{
                    if(d.winner === 1){
                        return '#AD6A1C'
                    }
                    else if(d.elim_week === 10){
                        return '#b67631'
                    }
                    else if(d.elim_week === 9){
                        return '#bf8244'
                    }
                    else if(d.elim_week === 8){
                        return '#c88f57'
                    }
                    else if(d.elim_week === 7){
                        return '#d09b6a'
                    }
                    else if(d.elim_week === 6){
                        return '#d8a87d'
                    }
                    else if(d.elim_week === 5){
                        return '#dfb590'
                    }
                    else if(d.elim_week === 4){
                        return '#e6c2a3'
                    }
                    else if(d.elim_week === 3){
                        return '#eccfb7'
                    }
                    else if(d.elim_week === 2){
                        return '#f2ddcb'
                    }
                    else if(d.elim_week === 1){
                        return '#f8eadf'
                    }
                    else {
                        return '#f8eadf'
                    }

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

        // ADD LABELS TO CLUSTERS
        vis.elimWeekDifferentiatedCircles.enter()
            .append("text")
            .attr("class", "allContestantCirclesSeasonLabels")
            .merge(vis.elimWeekDifferentiatedCircles)
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
                    return 705 + 100 + vis.margin.top
                }
                else{
                    return 705 + vis.margin.top
                }
            })
            .text(d => "S" + d.season)
            .style("font-size", 12)
    }

    wrangleData(){
        let vis = this;

        vis.updateVis();
    }

    updateVis(){
        let vis = this;
    }

}
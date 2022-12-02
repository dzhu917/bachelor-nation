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

        vis.svg = d3.select("#svg");
        
        vis.width = vis.svg.style("width").replace("px", "");
        vis.height = vis.svg.style("height").replace("px", "");

        vis.dotgroup = vis.svg
            .append("g")
            .attr("id", "dotgroup")
            .attr("visibility", "hidden");

        // append div container for tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'divTooltip')

        // create group to fill white space below
        vis.zoomedgroup = vis.dotgroup
            .selectAll(".zoomedgroup")
            .append("g")
            .data(vis.data)
            .attr("id", "zoomedgroup")

        // CREATE LEGEND FOR DOT PLOT 1
        vis.allContestantDotLegendData = ["Bachelor contestants", "Bachelorette contestants"]
        vis.allContestantDotLegendColors = ["#75D6FF", "#FAB05A"]

        vis.allContestantDotLegend = vis.dotgroup
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

        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;

        vis.updateVisAll();
    }

    updateVisAll(){
        let vis = this;

        vis.dotgroup
            .transition()
            .attr("visibility", "visible");

        // create circle containers
        vis.allContestantCircles = vis.dotgroup
            .selectAll(".allContestantCircles")
            .data(vis.data)

        vis.allContestantCircles
            .enter()
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
                    return 100 + (d3.randomUniform(vis.margin.top + vis.padding, 100)())
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

        vis.allContestantCircles.transition();

        vis.allContestantCircles.on("mouseover", function(event,d){

            d3.select(this).style("stroke", "black")

            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 3px;">
                 <p style="font-weight: bold;">${d.name}</p>
                 <p style="line-height: 0.5"> Season: ${d.season}</p>
                 <p style="line-height: 0.5"> Elim Week: ${vis.winnerPrint(d.elim_week)}</p>                     
             </div>\``);


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
        vis.allContestantCircles
            .enter()
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
                    return 115 + 100 + vis.margin.top
                }
                else{
                    return 115 + vis.margin.top
                }
            })
            .text(d => "S" + d.season)
            .style("font-size", 12);

        vis.allContestantCircles
            .exit()
            .remove()

    }

    updateVisWinner(){
        let vis = this;

        vis.dotgroup
            .transition()
            .attr("visibility", "visible");

        // create circle containers
        vis.allContestantCircles = vis.dotgroup
            .selectAll(".allContestantCircles")
            .data(vis.data)

        vis.allContestantCircles
            .merge(vis.allContestantCircles)
            .transition()
            .attr('r', d => d.winner === 1 ? 6 : 3)
            .attr('fill', function(d){
                if(d.show === "Bachelor" & d.winner === 1){
                    return '#2D87AD'
                }
                else if(d.show === "Bachelor" & d.winner === 0){
                    return '#75D6FF'
                }
                else if(d.show === "Bachelorette" & d.winner === 1){
                    return '#AD6A1C'
                }
                else {
                    return '#FAB05A'
                }
            });
    }

    updateVisElim(){
        let vis = this;

        vis.dotgroup
            .transition()
            .attr("visibility", "visible");

        vis.allContestantCircles = vis.dotgroup
            .selectAll(".allContestantCircles")
            .data(vis.data)

        vis.allContestantCircles
            .merge(vis.allContestantCircles)
            .transition()
            .attr('r', d => d.winner === 1 ? 6 : 3)
            .attr('fill', function(d,i){
                if(d.show == "Bachelorette"){
                    if(d.winner === 1){return '#2d87ad'}
                    else if(d.elim_week === 10){return '#4690b3'}
                    else if(d.elim_week === 9){return '#5a99ba'}
                    else if(d.elim_week === 8){return '#6ba2c0'}
                    else if(d.elim_week === 7){return '#7cacc6'}
                    else if(d.elim_week === 6){return '#8cb5cd'}
                    else if(d.elim_week === 5){return '#9cbed3'}
                    else if(d.elim_week === 4){return '#abc8da'}
                    else if(d.elim_week === 3){return '#bbd2e0'}
                    else if(d.elim_week === 2){return '#cadbe7'}
                    else if(d.elim_week === 1){return '#d9e5ed'}
                    else {return '#d9e5ed'}
                }
                else{
                    if(d.winner === 1){return '#AD6A1C'}
                    else if(d.elim_week === 10){return '#b67631'}
                    else if(d.elim_week === 9){return '#bf8244'}
                    else if(d.elim_week === 8){return '#c88f57'}
                    else if(d.elim_week === 7){return '#d09b6a'}
                    else if(d.elim_week === 6){return '#d8a87d'}
                    else if(d.elim_week === 5){return '#dfb590'}
                    else if(d.elim_week === 4){return '#e6c2a3'}
                    else if(d.elim_week === 3){return '#eccfb7'}
                    else if(d.elim_week === 2){return '#f2ddcb'}
                    else if(d.elim_week === 1){return '#f8eadf'}
                    else {return '#f8eadf'}
                }
            });
    }

    updateVisElimSorted(){
        let vis = this;

        vis.dotgroup
            .transition()
            .attr("visibility", "visible");

        // create circle containers
        vis.allContestantCircles = vis.dotgroup
            .selectAll(".allContestantCircles")
            .data(vis.data)

        vis.allContestantCircles
            .merge(vis.allContestantCircles)
            .transition()
            .attr('cy', function(d){
                if (d.show === "Bachelor" & isNaN(d.elim_week)){
                    return 115
                }
                else if (d.show === "Bachelorette" & isNaN(d.elim_week)){
                    return 115 + 100
                }
                else if (d.show === "Bachelor" & d.winner === 0){
                    return vis.margin.top + vis.padding + (Number(d.elim_week) * 6)
                }
                else if (d.show === "Bachelorette" & d.winner === 0){
                    return vis.margin.top + vis.padding + (Number(d.elim_week) * 6) + 100
                }
                else{
                    return 0;
                }
            })
            .attr('r', d => d.winner === 1 ? 6 : 3)
            .attr('fill', function(d){
                if(d.show == "Bachelorette"){
                    if(d.winner === 1){return '#2d87ad'}
                    else if(d.elim_week === 10){return '#4690b3'}
                    else if(d.elim_week === 9){return '#5a99ba'}
                    else if(d.elim_week === 8){return '#6ba2c0'}
                    else if(d.elim_week === 7){return '#7cacc6'}
                    else if(d.elim_week === 6){return '#8cb5cd'}
                    else if(d.elim_week === 5){return '#9cbed3'}
                    else if(d.elim_week === 4){return '#abc8da'}
                    else if(d.elim_week === 3){return '#bbd2e0'}
                    else if(d.elim_week === 2){return '#cadbe7'}
                    else if(d.elim_week === 1){return '#d9e5ed'}
                    else {return '#d9e5ed'}
                }
                else{
                    if(d.winner === 1){return '#AD6A1C'}
                    else if(d.elim_week === 10){return '#b67631'}
                    else if(d.elim_week === 9){return '#bf8244'}
                    else if(d.elim_week === 8){return '#c88f57'}
                    else if(d.elim_week === 7){return '#d09b6a'}
                    else if(d.elim_week === 6){return '#d8a87d'}
                    else if(d.elim_week === 5){return '#dfb590'}
                    else if(d.elim_week === 4){return '#e6c2a3'}
                    else if(d.elim_week === 3){return '#eccfb7'}
                    else if(d.elim_week === 2){return '#f2ddcb'}
                    else if(d.elim_week === 1){return '#f8eadf'}
                    else {return '#f8eadf'}
                }
            })

        vis.zoomedgroupX = d3.scaleLinear()
            .range([vis.margin.left, vis.width - vis.margin.right - 120])
            .domain([1, 10]);

        vis.zoomedgroupXAxis = d3.axisBottom()
            .scale(vis.zoomedgroupX);

        vis.allContestantCircles
            .on("mouseover", function(d){
                d3.select(this).attr("opacity", "0.5");
            })
            .on("mouseout", function(d){
                d3.select(this).attr("opacity", "1");
            })
            .on("click", function(d,i){

                vis.dotgroup.append("g")
                    .attr("class", "x-axis axis")
                    .attr("transform", "translate(0," + 520 + ")")
                    .call(vis.zoomedgroupXAxis);

                vis.dotgroup.append("text")
                    .attr("class", "chart-label")
                    .attr("transform", "translate(10," + 280 + ")")
                    .text("Season timeline: Hover over each contestant below to see their age & occupation!");

                vis.dotgroup.append("text")
                    .attr("class", "x-axis-label")
                    .attr("transform", "translate(300," + 560 + ")")
                    .text("Elimination Week");

                vis.renderZoomedGroup(d.target.__data__.season, d.target.__data__.show);
                vis.changeSelectedSeasonColor(d.target.__data__.season, d.target.__data__.show);

                vis.dotgroup.exit().remove();

                document.getElementById("selectedShow").innerText = d3.select(this)._groups[0][0].__data__.show;
                document.getElementById("selectedSeason").innerText = d3.select(this)._groups[0][0].__data__.season;
        })

    }

    renderZoomedGroup(season_input, show_input){
        let vis = this;

        vis.dotgroup.selectAll('.zoomedgroupdots').remove()

        // Filter data based on input season
        vis.filteredData = vis.data.filter(function (d) {
            return d.season === season_input & d.show === show_input;
        });

        // Create new set of dots using filtered data
        vis.dotgroup.append('g')
            .selectAll("zoomedgroupdots")
            .data(vis.filteredData)
            .enter()
            .append("circle")
            .attr("class", "zoomedgroupdots")
            .attr("cx", function(d){
                if (d.winner != 1){return vis.zoomedgroupX(d.elim_week)}
                else{return vis.zoomedgroupX(10) + 10}
            })
            .attr("cy", d3.randomUniform(vis.margin.top + vis.padding + 250, vis.margin.top + vis.padding + 450))
            .attr("r", function(d){
                if(d.winner != 1){return 8}
                else{return 12}
            })
            .attr('fill', function(d){
                if(d.show == "Bachelorette"){
                    if(d.winner === 1){return '#2d87ad'}
                    else if(d.elim_week === 10){return '#4690b3'}
                    else if(d.elim_week === 9){return '#5a99ba'}
                    else if(d.elim_week === 8){return '#6ba2c0'}
                    else if(d.elim_week === 7){return '#7cacc6'}
                    else if(d.elim_week === 6){return '#8cb5cd'}
                    else if(d.elim_week === 5){return '#9cbed3'}
                    else if(d.elim_week === 4){return '#abc8da'}
                    else if(d.elim_week === 3){return '#bbd2e0'}
                    else if(d.elim_week === 2){return '#cadbe7'}
                    else if(d.elim_week === 1){return '#d9e5ed'}
                    else {return '#d9e5ed'}
                }
                else{
                    if(d.winner === 1){return '#AD6A1C'}
                    else if(d.elim_week === 10){return '#b67631'}
                    else if(d.elim_week === 9){return '#bf8244'}
                    else if(d.elim_week === 8){return '#c88f57'}
                    else if(d.elim_week === 7){return '#d09b6a'}
                    else if(d.elim_week === 6){return '#d8a87d'}
                    else if(d.elim_week === 5){return '#dfb590'}
                    else if(d.elim_week === 4){return '#e6c2a3'}
                    else if(d.elim_week === 3){return '#eccfb7'}
                    else if(d.elim_week === 2){return '#f2ddcb'}
                    else if(d.elim_week === 1){return '#f8eadf'}
                    else {return '#f8eadf'}
                }
            })
            .on("mouseover", function(event,d){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 3px;">
                     <p style="font-weight: bold;">${d.name}</p>
                     <p style="line-height: 0.5"> Show: ${d.show}</p>
                     <p style="line-height: 0.5"> Season: ${d.season}</p>
                     <p style="line-height: 0.5"> Elim Week: ${vis.winnerPrint(d.elim_week)}</p>     
                     <p style="line-height: 0.5"> Age: ${d.age}</p>
                     <p style="line-height: 0.9"> Occupation: ${d.occupation}</p>                
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

        vis.dotgroup.exit().remove();

    }

    changeSelectedSeasonColor(season_input, show_input){
        let vis = this;

        vis.allContestantCircles
            .merge(vis.allContestantCircles)
            .attr("fill", function(d){
                if(d.season === season_input & d.show === show_input){
                    return "lightgray";
                }
                else if (d.show == "Bachelorette"){
                    if(d.winner === 1){return '#2d87ad'}
                    else if(d.elim_week === 10){return '#4690b3'}
                    else if(d.elim_week === 9){return '#5a99ba'}
                    else if(d.elim_week === 8){return '#6ba2c0'}
                    else if(d.elim_week === 7){return '#7cacc6'}
                    else if(d.elim_week === 6){return '#8cb5cd'}
                    else if(d.elim_week === 5){return '#9cbed3'}
                    else if(d.elim_week === 4){return '#abc8da'}
                    else if(d.elim_week === 3){return '#bbd2e0'}
                    else if(d.elim_week === 2){return '#cadbe7'}
                    else if(d.elim_week === 1){return '#d9e5ed'}
                    else {return '#d9e5ed'}
                }
                else{
                    if(d.winner === 1){return '#AD6A1C'}
                    else if(d.elim_week === 10){return '#b67631'}
                    else if(d.elim_week === 9){return '#bf8244'}
                    else if(d.elim_week === 8){return '#c88f57'}
                    else if(d.elim_week === 7){return '#d09b6a'}
                    else if(d.elim_week === 6){return '#d8a87d'}
                    else if(d.elim_week === 5){return '#dfb590'}
                    else if(d.elim_week === 4){return '#e6c2a3'}
                    else if(d.elim_week === 3){return '#eccfb7'}
                    else if(d.elim_week === 2){return '#f2ddcb'}
                    else if(d.elim_week === 1){return '#f8eadf'}
                    else {return '#f8eadf'}
                }
            })
    }

    winnerPrint(week){
        if (Number.isNaN(week)){
            return "Winner";
        }
        else{
            return week;
        }
    }

}
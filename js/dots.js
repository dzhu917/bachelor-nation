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
        vis.allContestantDotLegendColors = ["#deffb0", "#F59BBB"]

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
                    return '#F59BBB'
                }else{
                    return '#deffb0'
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
                 <p style="color: #242635; font-weight: bold;">${d.name}</p>
                 <p style="color: #242635; line-height: 0.5"> Season: ${d.season}</p>
                 <p style="color: #242635; line-height: 0.5"> Elim Week: ${vis.winnerPrint(d.elim_week)}</p>                     
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
            .attr('r', d => d.winner === 1 ? 7 : 3)
            .attr('fill', function(d){
                if(d.show === "Bachelor" && d.winner === 1){
                    return '#72d700'
                }
                else if(d.show === "Bachelor" && d.winner === 0){
                    return '#deffb0'
                }
                else if(d.show === "Bachelorette" && d.winner === 1){
                    return '#ec095a'
                }
                else {
                    return '#F59BBB'
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
            .attr('r', d => d.winner === 1 ? 7 : 3)
            .attr('fill', function(d,i){
                if(d.show == "Bachelor"){
                    if(d.winner === 1){return '#66c000'}
                    else if(d.elim_week === 10){return '#69be1c'}
                    else if(d.elim_week === 9){return '#8ad746'}
                    else if(d.elim_week === 8){return '#96d95b'}
                    else if(d.elim_week === 7){return '#a7ea6c'}
                    else if(d.elim_week === 6){return '#b4e583'}
                    else if(d.elim_week === 5){return '#c4ea99'}
                    else if(d.elim_week === 4){return '#d0ecac'}
                    else if(d.elim_week === 3){return '#d3ecb8'}
                    else if(d.elim_week === 2){return '#e4fccb'}
                    else if(d.elim_week === 1){return '#ffffff'}
                    else {return 'rgba(255,255,255,0.45)'}
                }
                else{
                    if(d.winner === 1){return '#ff005a'}
                    else if(d.elim_week === 10){return '#f82254'}
                    else if(d.elim_week === 9){return '#f34c6b'}
                    else if(d.elim_week === 8){return '#ff6b82'}
                    else if(d.elim_week === 7){return '#fc7e8e'}
                    else if(d.elim_week === 6){return '#fd96a2'}
                    else if(d.elim_week === 5){return '#ffb1b9'}
                    else if(d.elim_week === 4){return '#ff9da6'}
                    else if(d.elim_week === 3){return '#ffc3c6'}
                    else if(d.elim_week === 2){return '#ffd2d4'}
                    else if(d.elim_week === 1){return '#ffffff'}
                    else {return 'rgba(255,255,255,0.45)'}
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
            .attr('fill', function(d,i){
                if(d.show == "Bachelor"){
                    if(d.winner === 1){return '#66c000'}
                    else if(d.elim_week === 10){return '#69be1c'}
                    else if(d.elim_week === 9){return '#8ad746'}
                    else if(d.elim_week === 8){return '#96d95b'}
                    else if(d.elim_week === 7){return '#a7ea6c'}
                    else if(d.elim_week === 6){return '#b4e583'}
                    else if(d.elim_week === 5){return '#c4ea99'}
                    else if(d.elim_week === 4){return '#d0ecac'}
                    else if(d.elim_week === 3){return '#d3ecb8'}
                    else if(d.elim_week === 2){return '#e4fccb'}
                    else if(d.elim_week === 1){return '#ffffff'}
                    else {return 'rgba(255,255,255,0.45)'}
                }
                else{
                    if(d.winner === 1){return '#ff005a'}
                    else if(d.elim_week === 10){return '#f82254'}
                    else if(d.elim_week === 9){return '#f34c6b'}
                    else if(d.elim_week === 8){return '#ff6b82'}
                    else if(d.elim_week === 7){return '#fc7e8e'}
                    else if(d.elim_week === 6){return '#fd96a2'}
                    else if(d.elim_week === 5){return '#ffb1b9'}
                    else if(d.elim_week === 4){return '#ff9da6'}
                    else if(d.elim_week === 3){return '#ffc3c6'}
                    else if(d.elim_week === 2){return '#ffd2d4'}
                    else if(d.elim_week === 1){return '#ffffff'}
                    else {return 'rgba(255,255,255,0.45)'}
                }
            });

        vis.zoomedgroupX = d3.scaleLinear()
            .range([10 + vis.margin.left, vis.width - vis.margin.right - 300])
            .domain([1, 10]);

        vis.zoomedgroupXAxis = d3.axisTop()
            .scale(vis.zoomedgroupX);

        vis.zoomedgroupText = vis.dotgroup.append("text")
            .attr("class", "chart-label")
            .attr("transform", "translate(15," + 300 + ")")
            .style("font-size", "15px")
            .text("Hover over each contestant below to see their age & occupation!")
            .attr("visibility", "hidden");

        let winnerchartlabelx = vis.width - vis.margin.right - 300 + 50;

        vis.zoomedgroupWinnerLabel = vis.dotgroup.append("text")
            .attr("class", "winner-chart-label")
            .attr("x", winnerchartlabelx)
            .attr("y", "330")
            .style("font-size", "15px")
            .text("Winner")
            .attr("visibility", "hidden");

        vis.zoomedgroupAxisLabel = vis.dotgroup.append("text")
            .attr("class", "x-axis-label")
            .attr("transform", "translate(15," + 280 + ")")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .style("fill", "#C8BAFB")
            .text("Contestants grouped by elimination week")
            .attr("visibility", "hidden");

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
                    .attr("transform", "translate(0," + 340 + ")")
                    .style("font-size", "15px")
                    .call(vis.zoomedgroupXAxis);

                vis.zoomedgroupText.attr("visibility", "visible");
                vis.zoomedgroupWinnerLabel.attr("visibility", "visible");
                vis.zoomedgroupAxisLabel.attr("visibility", "visible");

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
        vis.filteredData = vis.data.filter(function (d) {return d.season === season_input & d.show === show_input;})
            .sort((a, b) => d3.descending(a.elim_week, b.elim_week))

        // Create new set of dots using filtered data
        vis.dotgroup.append('g')
            .selectAll("zoomedgroupdots")
            .data(vis.filteredData)
            .enter()
            .append("circle")
            .attr("class", "zoomedgroupdots")
            .attr("cx", function(d){
                if (d.winner != 1){return vis.zoomedgroupX(d.elim_week)}
                else{return vis.zoomedgroupX(10) + 70}
            })
            .attr("cy", function(d){
                return (vis.margin.top + vis.padding + 300 + d.num_in_elim_week * 270 / 14)
            })
            .attr("r", function(d){
                if(d.winner != 1){return 8}
                else{return 12}
            })
            .attr('fill', function(d,i){
                if(d.show == "Bachelor"){
                    if(d.winner === 1){return '#66c000'}
                    else if(d.elim_week === 10){return '#69be1c'}
                    else if(d.elim_week === 9){return '#8ad746'}
                    else if(d.elim_week === 8){return '#96d95b'}
                    else if(d.elim_week === 7){return '#a7ea6c'}
                    else if(d.elim_week === 6){return '#b4e583'}
                    else if(d.elim_week === 5){return '#c4ea99'}
                    else if(d.elim_week === 4){return '#d0ecac'}
                    else if(d.elim_week === 3){return '#d3ecb8'}
                    else if(d.elim_week === 2){return '#e4fccb'}
                    else if(d.elim_week === 1){return '#ffffff'}
                    else {return 'rgba(255,255,255,0.45)'}
                }
                else{
                    if(d.winner === 1){return '#ff005a'}
                    else if(d.elim_week === 10){return '#f82254'}
                    else if(d.elim_week === 9){return '#f34c6b'}
                    else if(d.elim_week === 8){return '#ff6b82'}
                    else if(d.elim_week === 7){return '#fc7e8e'}
                    else if(d.elim_week === 6){return '#fd96a2'}
                    else if(d.elim_week === 5){return '#ffb1b9'}
                    else if(d.elim_week === 4){return '#ff9da6'}
                    else if(d.elim_week === 3){return '#ffc3c6'}
                    else if(d.elim_week === 2){return '#ffd2d4'}
                    else if(d.elim_week === 1){return '#ffffff'}
                    else {return 'rgba(255,255,255,0.45)'}
                }
            })
            .on("mouseover", function(event,d){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 3px;">
                     <p style="color: #242635; font-weight: bold;">${d.name}</p>
                     <p style="color: #242635; line-height: 0.5"> Show: ${d.show}</p>
                     <p style="color: #242635; line-height: 0.5"> Season: ${d.season}</p>
                     <p style="color: #242635; line-height: 0.5"> Elim Week: ${vis.winnerPrint(d.elim_week)}</p>     
                     <p style="color: #242635; line-height: 0.5"> Age: ${d.age}</p>
                     <p style="color: #242635; line-height: 0.9"> Occupation: ${d.occupation}</p>                
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
            .attr('fill', function(d,i){
                if(d.season === season_input & d.show === show_input){
                    return "#C8BAFB";
                }
                else if(d.show == "Bachelor"){
                    if(d.winner === 1){return '#66c000'}
                    else if(d.elim_week === 10){return '#69be1c'}
                    else if(d.elim_week === 9){return '#8ad746'}
                    else if(d.elim_week === 8){return '#96d95b'}
                    else if(d.elim_week === 7){return '#a7ea6c'}
                    else if(d.elim_week === 6){return '#b4e583'}
                    else if(d.elim_week === 5){return '#c4ea99'}
                    else if(d.elim_week === 4){return '#d0ecac'}
                    else if(d.elim_week === 3){return '#d3ecb8'}
                    else if(d.elim_week === 2){return '#e4fccb'}
                    else if(d.elim_week === 1){return '#ffffff'}
                    else {return 'rgba(255,255,255,0.45)'}
                }
                else{
                    if(d.winner === 1){return '#ff005a'}
                    else if(d.elim_week === 10){return '#f82254'}
                    else if(d.elim_week === 9){return '#f34c6b'}
                    else if(d.elim_week === 8){return '#ff6b82'}
                    else if(d.elim_week === 7){return '#fc7e8e'}
                    else if(d.elim_week === 6){return '#fd96a2'}
                    else if(d.elim_week === 5){return '#ffa1aa'}
                    else if(d.elim_week === 4){return '#ff9da6'}
                    else if(d.elim_week === 3){return '#ffc7ca'}
                    else if(d.elim_week === 2){return '#ffd2d4'}
                    else if(d.elim_week === 1){return '#ffffff'}
                    else {return 'rgba(255,255,255,0.45)'}
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
class TreeMapVis {

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

        vis.treemapgroup = vis.svg
            .append("g")
            .attr("id", "treemapgroup")
            .attr("opacity", 0)

        // append div container for tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'divTooltip')

        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;

        vis.updateVis();
    }

    updateVis(){
        let vis = this;

        vis.treemapgroup
            .transition()
            .attr("opacity", 1);

        vis.treemapgroup
            .append("text")
            .text("testing testing")

        // vis.allContestantCircles = vis.dotgroup
        //     .selectAll(".allContestantCircles")
        //     .data(vis.data)

    }

}
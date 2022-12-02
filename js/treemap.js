class TreeMapVis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis()
    }

    initVis(){
        let vis = this;

        // Margin object with properties for the four directions
        vis.margin = {top: 20, right: 40, bottom: 20, left: 20};

        vis.padding = 30;

        vis.svg = d3.select("#svg");
        
        vis.width = vis.svg.style("width").replace("px", "");
        vis.height = vis.svg.style("height").replace("px", "");

        vis.treemapgroup = vis.svg
            .append("g")
            .attr("id", "treemapgroup")
            .attr("visibility", "hidden");

        // append div container for tooltip
        // vis.tooltip = d3.select("body").append('div')
        //     .attr('class', "tooltip")
        //     .attr('id', 'divTooltip')

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
            .attr("visibility", "visible");

        vis.treemapgroup
            .append("text")
            .attr("x", 500)
            .attr("y", 300)
            .text("testing testing")

        console.log(vis.data);

        // vis.root = d3.stratify()
        //     .id(function(d) { return d.name; })   // Name of the entity (column name is name in csv)
        //     .parentId(function(d) { return d.occupation; })   // Name of the parent (column name is parent in csv)
        //     (vis.data);

        // console.log(vis.root);

        // vis.root.sum(function(d) { return +d.value })



        // vis.allContestantCircles = vis.dotgroup
        //     .selectAll(".allContestantCircles")
        //     .data(vis.data)

    }

}
// this is a test

class MapVis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis()

    }
    initVis() {
        let vis = this

        // Margin object with properties for the four directions
        vis.margin = {top: 20, right: 40, bottom: 20, left: 20};

        vis.padding = 30;
        vis.svg = d3.select("#svg");

        vis.width = vis.svg.style("width").replace("px", "");
        vis.height = vis.svg.style("height").replace("px", "");

        vis.mapgroup = vis.svg
            .append("g")
            .attr("id", "mapgroup")
            .attr("opacity", 0)

        // append div container for tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'divTooltip')

        // create a projection
        vis.projection = d3.geoStereographic() // geoOrthographic()
            .translate([vis.width / 2, vis.height / 2])
            .scale(230)

        // define a geo generator and pass your projection to it
        vis.path = d3.geoPath()
            .projection(vis.projection);


        // add sphere
        // vis.svg.append("path")
        //     .datum({type: "Sphere"})
        //     .attr("class", "graticule")
        //     .attr('fill', '#ADDEFF')
        //     .attr("stroke","rgba(129,129,129,0.35)")
        //     .attr("d", vis.path);

        console.log(vis.data.objects.state)
        // convert your TopoJSON data into GeoJSON data structure
        // vis.world = topojson.feature(vis.data, vis.data.objects.state).features

        // draw countries
        // vis.countries = vis.svg.selectAll(".country")
        //     .data(vis.world)
        //     .enter().append("path")
        //     .attr('class', 'country')
        //     .attr("d", vis.path)
        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;

    }

    updateVis() {

        let vis = this;

        vis.mapgroup
            .transition()
            .attr("opacity", 1);

    }
}
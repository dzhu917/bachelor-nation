class FirVis {
  constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;

    this.initVis();
  }
  initVis() {
    let vis = this;

    // Margin object with properties for the four directions
    vis.margin = { top: 20, right: 40, bottom: 20, left: 20 };

    vis.padding = 30;
    vis.svg = d3.select("#svg");

    vis.width = vis.svg.style("width").replace("px", "");
    vis.height = vis.svg.style("height").replace("px", "");

    vis.sankeygroup = vis.svg
      .append("g")
      .attr("id", "sankeygroup")
      .attr("visibility", "hidden");

    // Append div container for tooltip
    vis.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "divTooltip");

    // Create legend
    vis.allContestantDotLegendData = [
      "Got first impression rose",
      "Did not get first impression rose",
      "Eliminated",
    ];
    vis.allContestantDotLegendColors = [
      "rgba(255,49,49,0.62)",
      "#269CE0",
      "#525750",
    ];
    vis.allContestantDotLegend = vis.sankeygroup
      .selectAll(".allContestantDotLegend")
      .enter()
      .append("g")
      .data(vis.allContestantDotLegendData);

    vis.allContestantDotLegend
      .enter()
      .append("rect")
      .attr("class", "allContestantDotLegend")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d, i) => vis.allContestantDotLegendColors[i])
      .attr("y", 10)
      .attr("x", (d, i) => {
        if (i == 0) {
          return vis.margin.left;
        } else if (i == 1) {
          return 225 + vis.margin.left;
        } else {
          return 500 + vis.margin.left;
        }
      });

    vis.allContestantDotLegend
      .enter()
      .append("text")
      .attr("class", "allContestantDotLegend-label")
      .text((d) => d)
      .attr("y", 25)
      .attr("x", (d, i) => {
        if (i == 0) {
          return vis.margin.left + 20;
        } else if (i == 1) {
          return 225 + vis.margin.left + 20;
        } else {
          return 500 + vis.margin.left + 20;
        }
      });

    // Create slider
    vis.sliderFill = d3
      .sliderBottom()
      .min(0)
      .max(10)
      .width(300)
      .ticks(10)
      .step(1)
      .default(0.015)
      .fill("#C8BAFB")
      .on("onchange", (val) => {
        vis.selected = val;
        vis.updateVis();
      });

    vis.gFill = d3
      .select("div#slider")
      .append("svg")
      .attr("width", 500)
      .attr("height", 100)
      .append("g")
      .attr("transform", "translate(30,30)");

    vis.gFill.call(vis.sliderFill);

    // Add divider line
    vis.dividerRect = vis.sankeygroup
      .append("rect")
      .attr("width", 385)
      .attr("height", 2)
      .attr("fill", "#C8BAFB")
      .attr("x", 25)
      .attr("y", 85)
      .attr("opacity", 0.5);

    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    // Sort data by FIR
    vis.data.sort((a, b) => {
      return b.fir - a.fir;
    });
  }

  updateVis() {
    // console.log(val)
    let vis = this;

    vis.sankeygroup.transition().attr("visibility", "visible");

    // Create circle containers
    let allContestantCircles = vis.sankeygroup
      .selectAll(".allContestantCircles")
      .data(vis.data);

    // Append circles
    allContestantCircles
      .enter()
      .append("circle")
      .attr("class", "allContestantCircles")
      .on("mouseover", function (event, d) {
        vis.tooltip
          .style("opacity", 1)
          .style("left", event.pageX + 20 + "px")
          .style(
            "top",
            event.pageY + "px"
          ).html(`<div style="border: thin solid grey; border-radius: 5px; background: white; padding: 3px;">
                     <p style="color: #242635; font-weight: bold;">${d.name}</p>
                     <p style="color: #242635; line-height: 0.5"> Season: ${
                       d.season
                     }</p>
                     <p style="color: #242635; line-height: 0.5"> Elim Week: ${vis.winnerPrint(
                       d.elim_week
                     )}</p>                     
                 </div>\``);

        d3.select(this).style("stroke", "black");
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", "1").attr("stroke-width", 0);

        vis.tooltip
          .style("opacity", 0)
          .style("left", 0)
          .style("top", 0)
          .html(``);
      })
      .merge(allContestantCircles)
      .transition()
      .attr("cx", function (d, i) {
        return vis.padding + 15 * (i % 26);
      })
      .attr("cy", function (d, i) {
        if (i < 26) {
          return 2 * vis.padding + 15 * Math.floor(i / 26);
        } else {
          return 2 * vis.padding + 40 + 15 * Math.floor(i / 26);
        }
      })
      .attr("r", 5)
      .attr("fill", function (d) {
        // if contestant has been eliminated, fill circle gray
        if (d.elim_week <= vis.selected) {
          return "#525750";
        } else if (d.fir === "1") {
          return "rgba(255,49,49,0.62)";
        } else {
          return "#269CE0";
        }
      });

    allContestantCircles.exit().remove();
  }

  // Check if contestant is winner
  winnerPrint(week) {
    if (Number.isNaN(week)) {
      return "Winner";
    } else {
      return week;
    }
  }
}

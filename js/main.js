let contestant_data;
let myDots;
let svg;
let myFIR;
let myRunnerup;

// Load in data
let promises = [
  d3.csv("data/contestant-data.csv"),
  d3.json("data/hometowns.json"),
];

Promise.all(promises)
  .then(function (data) {
    data[0].forEach(function (d) {
      d.date_size = +d.date_size;
      d.first_impression = +d.first_impression;
      d.season = +d.season;
      d.elim_week = +d.elim_week;
      d.winner = +d.winner;
    });

    createVis(data);
  })
  .catch(function (err) {
    console.log(err);
  });

function createVis(data) {
  contestant_data = data[0];

  let margins = { top: 20, right: 20, bottom: 50, left: 20 };
  let width =
    document.getElementById("vis").getBoundingClientRect().width -
    margins.left -
    margins.right;
  let height = window.innerHeight - margins.top - margins.bottom;

  svg = d3
    .select("#vis")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height);

  myDots = new DotsVis("vis", contestant_data);
  myFIR = new FirVis("firDiv", contestant_data);
  myRunnerup = new RunnerupVis("runnerupDiv", contestant_data);

  drawIntro();
}

function clean(chartType) {
  if (chartType !== "dot") {
    d3.select("#dotgroup").transition().attr("visibility", "hidden");
  }
  if (chartType !== "dotlast") {
    d3.select("#dotgroup").transition().attr("visibility", "hidden");

    d3.selectAll(".zoomedgroupdots").remove();
  }
  if (chartType !== "fir") {
    d3.select("#sankeygroup").transition().attr("visibility", "hidden");
  }
  if (chartType !== "runnerup") {
    d3.select("#runnerupgroup").transition().attr("visibility", "hidden");
  }
  if (chartType !== "intro") {
    d3.select("#intro").html(null);
  }
}

function drawIntro() {
  console.log("drawIntro");

  clean("intro");

  d3.select("#intro")
    .html(`<p style="line-height: 1.7">If you've been on social media or watch TV, you've probably heard of ABC's Bachelor
        franchise. Every season, one person is crowned the Bachelor or Bachelorette, and a group of contestants
        vie for their love by going on dates throughout the season. Contestants are eliminated every week
        at rose ceremonies, during which the Bachelor(ette) grants a rose to contestants chosen
        to move forward.</p>
        <br>
        <p style="line-height: 1.7">The franchise has run for a while — the Bachelor has 21 seasons, and
            the Bachelorette has 13. With hundreds of contestants who have gone through this unconventional process
            of finding love, we wondered what a visualization of the franchise might look like. <b>Who tends to win the
            Bachelor(ette)'s heart? Do first impression roses mean anything? We dove into the data behind the franchise, its
            contestants, and how it all pans out!
        </p>
        <br>
        <h2>Scroll to explore the data!</h2>`);
}

function draw1() {
  console.log("draw1");

  clean("dot");

  myDots.updateVisAll();
}

function draw2() {
  console.log("draw2");

  clean("dot");

  myDots.updateVisWinner();
}

function draw3() {
  console.log("draw3");

  clean("dot");

  myDots.updateVisElim();
}

function draw4() {
  console.log("draw4");

  clean("dotlast");

  myDots.updateVisElimSorted();
}

function draw5() {
  console.log("draw5");

  clean("fir");

  myFIR.updateVis();
}

function draw6() {
  console.log("draw6");

  clean("runnerup");

  myRunnerup.updateRunnerup();
}

function draw7() {
  console.log("draw7");

  clean("runnerup");

  myRunnerup.updateRunnerupFIR();
}

function draw8() {
  console.log("draw8");

  clean("runnerup");

  myRunnerup.updateRunnerupRoses();
}

// Enables scrolling function
// Loads text and draws graph on scroll

// Array of all graph functions
let activationFunctions = [
  drawIntro,
  draw1,
  draw2,
  draw3,
  draw4,
  draw5,
  draw6,
  draw7,
  draw8,
];

let scroll = scroller().container(d3.select("#vis-text"));
scroll();

let lastIndex,
  activeIndex = 0;

scroll.on("active", function (index) {
  console.log("index", index);
  d3.selectAll(".step")
    .transition()
    .duration(500)
    .style("opacity", function (d, i) {
      return i === index ? 1 : 0.1;
    });

  activeIndex = index;
  let sign = activeIndex - lastIndex < 0 ? -1 : 1;
  let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
  scrolledSections.forEach((i) => {
    activationFunctions[i]();
  });
  lastIndex = activeIndex;
});

// Slot machine widget function
// Source: https://medium.com/@victortoschi/how-to-create-a-slot-machine-animation-with-css-and-javascript-9073ab9db9ea
(function slotMachine() {
  // Possible results
  const items = [
    "10%",
    "33%",
    "47%",
    "55%",
    "68%",
    "80%",
    "2%",
    "5%",
    "100%",
    "72%",
    "30%",
    "11%",
    "22%",
    "92%",
    "5%",
    "69%",
    "42%",
    "0.5%",
  ];

  const doors = document.querySelectorAll(".door");

  // Two buttons
  document.querySelector("#spinner").addEventListener("click", spin);
  document.querySelector("#reseter").addEventListener("click", init);

  // Initialize shapes
  function init(firstInit = true, groups = 1, duration = 1) {
    for (const door of doors) {
      if (firstInit) {
        door.dataset.spinned = "0";
      } else if (door.dataset.spinned === "1") {
        return;
      }

      const boxes = door.querySelector(".boxes");
      const boxesClone = boxes.cloneNode(false);
      const pool = ["🔮"];

      // Make sure to generate different result each time
      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        pool.push(...shuffle(arr));

        boxesClone.addEventListener(
          "transitionstart",
          function () {
            door.dataset.spinned = "1";
            this.querySelectorAll(".box").forEach((box) => {
              box.style.filter = "blur(1px)";
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          "transitionend",
          function () {
            this.querySelectorAll(".box").forEach((box, index) => {
              box.style.filter = "blur(0)";
              if (index > 0) this.removeChild(box);
            });
          },
          { once: true }
        );
      }

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = door.clientWidth + "px";
        box.style.height = door.clientHeight + "px";
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      }
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${
        door.clientHeight * (pool.length - 1)
      }px)`;
      door.replaceChild(boxesClone, boxes);
    }
  }

  // Adds transition when spinning
  async function spin() {
    init(false, 1, 2);

    for (const door of doors) {
      const boxes = door.querySelector(".boxes");
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = "translateY(0)";
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }
  }

  // Choose random element from array
  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  init();
})();

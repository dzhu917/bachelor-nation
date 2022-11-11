console.log("let's get started!")

let data;

d3.csv("data/bachelorette-data.csv", (csv) => {
    console.log(csv)
    data = csv
})

console.log(data)
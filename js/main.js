console.log("let's get started!")

let data;

d3.csv("data/bachelorette-data.csv", (row) => {
    row.date_size = +row.date_size
    row.first_impression = +row.first_impression
    row.season = +row.season
    row.elim_week = +row.elim_week
    row.winner = +row.winner
    return row
}).then((csv) => {
    data = csv
    console.log(data)
})


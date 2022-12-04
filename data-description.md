## Data sets
### contestant-data.csv
This dataset consists of basic demographic and show-related information for each contestant over each season. 
We cleaned and merged data sets from the official Bachelor Nation Wiki, Kaggle, and fivethirtyeight.

*Description of columns:* 

show: whether the show was Bachelor or Bachelorette (women are contestants on the Bachelor, men are contestants on the Bachelorette)

season: season that the contestant was on 

name: name of contestant 

winner: whether the contestant won

runner_up: whether the contestant was a runner up (eliminated in the last week)

elim_week: elimination week (1 to 10)

fir: whether the contestant received a first impression rose

occupation: occupation of contestant 

hometown: hometown of contestant 

age: age of contestant

roses: total number of roses received throughout the show

num_in_elim_week: number of contestants in their elimination week.

### hometowns.json 
We did not ultimately implement the visualization for hometown data, but it is something we would like to work on in future
iterations of this project. This dataset contains latitude and longitude data for each contestant, along with their other 
demographic information, in the form of a json file. 
# bachelor-nation
### CS 171 Final Project by Kevin Tan, Kelsey Wu, and Diana Zhu

The README file must give an overview of what you are handing in: which parts are your code, which parts are libraries, 
and so on. The README must also explain any non-obvious features of your interface.

Project website: [insert link]

Video demo: [insert link]

Our project aims to conduct an exploratory analysis of the Bachelor/Bachelorette franchise, the wildly popular reality dating show that has been airing since 2002. Over 6-10 weeks, each season narrows an initial group of ~30 contestants through Rose Ceremonies, during which the Bachelor/Bachelorette chooses which contestants to bring to the next round. Throughout each week, the Bachelor/Bachelorette can also grant special roses to contestants, such as group date roses or first impression roses. At the end of the season, the Bachelor/Bachelorette is expected to get engaged to the final contestant. Each week, producers carefully curate an entertaining, dramatic portrayal of the Bachelor/Bachelorette’s journey to love, while viewers at home tune into each episode with nervous anticipation. Throughout the 26 seasons of “The Bachelor” and 19 seasons of “The Bachelorette,” fans have predicted many different potential determinants/indicators of a winning contestant (e.g. screen time, reception of first impression rose). 

## Description of Javascript Files 

### main.js
This file reads in our data, generates the visualizations, and overall compiles everything together.

### scroller.js
This file dictates the overall grid of the project. We use "scrollytelling" to present interactive visualizations that explore each of these questions, where each visualization fades in and out as the user scrolls. 

### dots.js
This file contains the code for our first visualization, which creates multiple linked views of the contestants’ profile information. The visualization starts off with a randomized cluster of contestants grouped by season. In the next scroll, the winner of each season is emphasized as a larger dot, and the following scroll differentiates the contestants by elimination week in a monochromatic color gradient. The last view shows a "trickle-down elimination", where the contestants are sorted by elimination week and the user can click on any season to reveal an additional chart with detailed information for the season.

### sankey.js
This file creates our second main visualization, which explores the success rates of contestants that receive a first impression rose. We implemented a D3 simple slider to show the progression of eliminations throughout the show, in respect to whether a contestant received the first impression rose. 

### runnerup.js
This file creates the winner vs. runnerup visualization 

### roses.js 
This file creates the rose and glitter animations on the first slide. 

This project uses Bootstrap for its CSS framework and the JavaScript library D3.js for its interactive visualizations. 



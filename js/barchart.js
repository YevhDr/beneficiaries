var margin1 = {top: 10, right: 50, bottom: 20, left: 100};

var widther = window.outerWidth;

var width1 = widther - margin1.left - margin1.right,
    height1 = 250 - margin1.top - margin1.bottom;

//Appends the svg to the chart-container div
var svg = d3.select(".g-chart").append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

//Creates the xScale
var xScale = d3.scale.linear()
    .range([0,width1]);

//Creates the yScale
var y0 = d3.scale.ordinal()
    .rangeBands([height1, 0], 0.2)
    .domain(["М.Фрідман", "Р.Ахметов", "А.Веревський", "О.Бахматюк", "С.Тігіпко", "NCH Capital", "В.Іванчик", "Ю.Косюк", "П.Порошенко", "К.Іаковідес"]);

//Defines the y axis styles
var yAxis = d3.svg.axis()
    .scale(y0)
    .orient("left");

//Defines the y axis styles
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(function(d) {return d + "%"; })
    .tickSize(height1)
    .ticks(numTicks(width1));

//Loads the data
var file = "data/top10_businessman.csv";
d3.csv(file, ready);

function ready(err, data) {

    if (err) throw "error loading data";
    console.log("hello");

    //FORMAT data
    data.forEach(function(d) {
        d.value = +d.value;
    });

    console.log(data);

    //Appends chart headline
    d3.select(".g-hed").text("ЛИШЕ БІЗНЕС ЧИ Й ПОЛІТИКА");

    //Appends chart intro text
    d3.select(".g-intro").text("Бізнесмени, з чиїми компаніями повʼязано найбільше місцевих депутатів");

    //Sets the max for the xScale
    var maxX = d3.max(data, function(d) { return d.value; });

    //Defines the xScale max
    xScale.domain([0, maxX ]);

    //Appends the y axis
    var yAxisGroup = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    //Appends the x axis
    var xAxisGroup = svg.append("g")
        .attr("class", "x axis");
        // .call(xAxis);

    //Binds the data to the bars
    var categoryGroup = svg.selectAll(".g-category-group")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "g-category-group")
        .attr("transform", function(d) {
            return "translate(0," + y0(d.name) + ")";
        })
        ;

    //Appends first bar
    var bars = categoryGroup.append("rect")
        .attr("width", function(d) { return xScale(d.value) / 2; })
        .attr("height", y0.rangeBand() )
        .attr("class", "g-num")
        .attr("transform", "translate(0,4)");

    //Binds data to labels
    var labelGroup = svg.selectAll("g-num")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "g-label-group")
        .attr("transform", function(d) {
            return "translate(0," + y0(d.name) + ")";
        });

    //Appends labels
    var barLabels = labelGroup.append("text")
        .text(function(d) {return  d.value;})
        .attr("x", function(d) { return xScale(1)})
        .attr("y", y0.rangeBand() )
        .attr("class", "g-labels");

    //Appends chart source
    d3.select(".g-source-bold")
        .text("ДЖЕРЕЛО: ")
        .attr("class", "g-source-bold");

    d3.select(".g-source-reg")
        .text("дані про бенефіціарів з реєстру юридичних та фізичних осіб, електронні декларації")
        .attr("class", "g-source-reg");


    //RESPONSIVENESS
    d3.select(window).on("resize", resized);

    function resized() {

        //new margin
        var newMargin = {top: 10, right: 80, bottom: 20, left: 50};

        //Get the width of the window
        var w = d3.select(".g-chart").node().clientWidth;
        console.log("resized", w);

        //Change the width of the svg
        d3.select("svg")
            .attr("width", w);

        //Change the xScale
        xScale
            .range([0, w - newMargin.right]);

        //Update the bars
        bars
            .attr("width", function(d) { return xScale(d.value); });

        //Updates bar labels
        barLabels
            .attr("x", function(d) { return xScale(1); })
            .attr("y", y0.rangeBand() );

        // //Updates xAxis
        // xAxisGroup
        //     .call(xAxis);

        //Updates ticks
        xAxis
            .scale(xScale)
            .ticks(numTicks(w));

    }

}

//Determines number of ticks base on width
function numTicks(widther) {
    if (widther <= 400) {
        return 4
        console.log("return 4")
    }
    else {
        return 10
        console.log("return 5")
    }
}
window.addEventListener('resize', function() {
    console.log("hello")
});

var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByClassName('div.heatmap'),
    x = w.innerWidth || e.clientWidth || g.clientWidth;


var width = x;


//    var itemSize;
if (x < 400)  {
    var itemSize = x / 20;
    var height = 300;
} else if (x > 400 && x < 700)  {
    var itemSize = x / 25;
    var height = 350;
} else if (x > 700 && x < 1000)  {
    var itemSize = x / 40;
    var height = 350
} else {
    var itemSize = x / 50;
    var height = 400;
}



var cellSize = itemSize - 1,
    margin = {top: 100, right: 0, bottom: -20, left: 80};

d3.select(".h-hed").text("ПАРТІЙНІ СТАВКИ");

//Appends chart intro text
d3.select(".h-intro").text("Зелений колір вказує на високу ймовірність підтримки, червоний - на уникання співпраці");

d3.csv('data/heatmap_d3.csv', function ( response ) {

    var data = response.map(function( item ) {
        var newItem = {};
        newItem.country = item.x;
        newItem.product = item.y;
        newItem.full_y = item.full_y;
        newItem.full_x = item.full_x;
        newItem.value = item.value;

        return newItem;
    });

    var x_elements = d3.set(data.map(function( item ) { return item.product; } )).values(),
        y_elements = d3.set(data.map(function( item ) { return item.country; } )).values();

    var xScale = d3.scale.ordinal()
        .domain(x_elements)
        .rangeBands([0, x_elements.length * itemSize]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickFormat(function (d) {
            return d;
        })
        .orient("top");

    var yScale = d3.scale.ordinal()
        .domain(y_elements)
        .rangeBands([0, y_elements.length * itemSize]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickFormat(function (d) {
            return d;
        })
        .orient("left");

    var colors = ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'];

    var colorScale = d3.scale.quantile()
        .domain([-5, 0, 5])
        .range(colors);

    var svg = d3.select('div.heatmap')
        .append("svg")
        .attr("width", width / 2 )
        .attr("height", height)
        .attr("overflow", "visible")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return  "<div><span style='color:white'>" + d.full_x + " і " + d.full_y + "</span></div>" +
                "<div><span style='color:white'>" + d3.round(d.value, 3) + "</span></div>";
        });

    svg.call(tip);

    var cells = svg.selectAll('rect')
        .data(data)
        .enter().append('g').append('rect')
        .attr('class', 'cell')
        .attr('width', itemSize)
        .attr('height', itemSize)
        .attr('y', function(d) { return yScale(d.country); })
        .attr('x', function(d) { return xScale(d.product); })
        .attr('fill', function(d) { return colorScale(d.value); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal');

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style("text-anchor", "start")
        .attr("dx", ".8em")
        .attr("dy", ".5em")
        .attr("transform", function (d) {
            return "rotate(-65)";
        });

    d3.select(".h-source-bold")
        .text("ДЖЕРЕЛО: ")
        .attr("class", "g-source-bold");

    d3.select(".h-source-reg")
        .text("дані про бенефіціарів з реєстру юридичних та фізичних осіб, електронні декларації")
        .attr("class", "g-source-reg");

});

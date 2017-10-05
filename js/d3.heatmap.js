window.addEventListener('resize', function() {
    console.log("resized")
});

// var w = window,
//     d = document,
//     e = d.documentElement,
//     g = d.getElementsByClassName('div.heatmap'),
//     x = w.innerWidth || e.clientWidth || g.clientWidth;

var width = 700;
var aspectRatio = 4.0 / 3.0;
var height = width / aspectRatio / 1.5;



margin = {top: 50, right: 0, bottom: 100, left: 100};

d3.select(".h-hed").text("Партійні ставки");

//Appends chart intro text
d3.select(".h-intro").html('<span style="color: #2166ac"><b>Синій</b></span> колір вказує на високу ймовірність підтримки, <span style="color: #b2182b"><b>червоний</b></span> - на уникання співпраці');

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
        .rangeBands([0, width]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickFormat(function (d) {
            return d;
        })
        .orient("top");

    var yScale = d3.scale.ordinal()
        .domain(y_elements)
        .rangeBands([0, height]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickFormat(function (d) {
            return d;
        })
        .orient("left");

    var colors = ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac'];

    var colorScale = d3.scale.quantile()
        .domain([-15, 0, 40])
        .range(colors);

    var svg = d3.select('div.heatmap')
        .append("svg")
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        // .attr("width", x / 2 )
        // .attr("height", height)
        .attr("content-align", "center")
        .attr("overflow", "visible")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function(d) {
            return  "<div><span style='color:white'>" + d.full_x + " і " + d.full_y + "</span></div>" +
                "<div><span style='color:white'>" + d3.round(d.value, 3) + "</span></div>";
        }) ;


    svg.call(tip);

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var cells = svg.selectAll('rect')
        .data(data)
        .enter().append('g').append('rect')
        .attr('class', 'cell')
        .attr('width', width/10)
        .attr('height', height / 10)
        .attr('y', function(d) { return yScale(d.country); })
        .attr('x', function(d) { return xScale(d.product); })
        .attr('fill', function(d) { return colorScale(d.value); })
        .on("mouseover", function(d) {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(d.full_x + " і " + d.full_y + "<br>" + "рівень підтримки: " + d3.round(d.value, 3))
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 10) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition().duration(500).style("opacity", 0);
        });


        // .on('mouseover', tip.show)
        // .on('mouseout', tip.hide);

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
        .style("text-anchor", "center")
        .attr("dx", "0em")
        .attr("dy", "-0.5em");
    //     .attr("transform", function (d) {
    //         return "rotate(-65)";
    //     })
    // ;

    d3.select(".h-source-bold")
        .text("ДЖЕРЕЛО: ")
        .attr("class", "g-source-bold");

    d3.select(".h-source-reg")
        .text("дані про бенефіціарів з реєстру юридичних та фізичних осіб, електронні декларації")
        .attr("class", "g-source-reg");

});


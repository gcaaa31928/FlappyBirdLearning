var netChart = function (row_length, column_length) {
    var margin = {top: 50, right: 0, bottom: 100, left: 30},
        width = 960 - margin.left - margin.right,
        height = 430 - margin.top - margin.bottom,
        gridSize = Math.floor(width / 24),
        legendElementWidth = gridSize * 2,
        buckets = 9,
        colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"], // alternatively colorbrewer.YlGnBu[9]
        row_cells = [],
        column_cells= [];

    for (var i = 0; i < row_length; i++) {
        row_cells.push(i);
    }
    for (var i = 0; i < column_length; i++) {
        column_cells.push(i);
    }


    var svg = d3.select("#net_chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var columnLabels = svg.selectAll(".columnLabels")
        .data(column_cells)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * gridSize;
        })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", function (d, i) {
            return "columnLabels mono axis axis-workweek";
        });

    var rowLabels = svg.selectAll(".rowLabels")
        .data(row_cells)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", function (d, i) {
            return i * gridSize;
        })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        .attr("class", function (d, i) {
            return "rowLabels mono axis axis-worktime";
        });

    this.updateData = function (gridData) {

        var data = gridData.map(function (d) {
            return {
                columnCell: d[0],
                rowCell: d[1],
                value: d[2]
            };
        });
        var colorScale = d3.scale.quantile()
            .domain([0, buckets - 1, d3.max(data, function (d) {
                return d.value;
            })])
            .range(colors);

        var cards = svg.selectAll(".cell")
            .data(data, function (d) {
                return d.rowCell + ',' + d.columnCell;
            });

        cards.append("title");

        cards.enter().append("rect")
            .attr("x", function (d) {
                return (d.rowCell - 1) * gridSize;
            })
            .attr("y", function (d) {
                return (d.columnCell - 1) * gridSize;
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0]);

        cards.transition().duration(1000)
            .style("fill", function (d) {
                return colorScale(d.value);
            });

        cards.select("title").text(function (d) {
            return d.value;
        });

        cards.exit().remove();

        //var legend = svg.selectAll(".legend")
        //    .data([0].concat(colorScale.quantiles()), function (d) {
        //        return d;
        //    });
        //
        //legend.enter().append("g")
        //    .attr("class", "legend");
        //
        //legend.append("rect")
        //    .attr("x", function (d, i) {
        //        return legendElementWidth * i;
        //    })
        //    .attr("y", height)
        //    .attr("width", legendElementWidth)
        //    .attr("height", gridSize / 2)
        //    .style("fill", function (d, i) {
        //        return colors[i];
        //    });
        //
        //legend.append("text")
        //    .attr("class", "mono")
        //    .text(function (d) {
        //        return "≥ " + Math.round(d);
        //    })
        //    .attr("x", function (d, i) {
        //        return legendElementWidth * i;
        //    })
        //    .attr("y", height + gridSize);
        //
        //legend.exit().remove();
    };

};
'use strict';

angular.module('myApp.Module.FlowChart', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/flowchart', {
            templateUrl: 'Module/FlowChart/flow-chart.html',
            controller: 'flowChartController',
            title: 'Flow Chart'
        });
    }])

    .controller('flowChartController', ['$scope', function ($scope) {

        var lastXGroup;
        var hashTableX = [];
        var hashTableY = [];
        var r1 = 300;
        var pi = 3;
        var w = $('#tags').width(), h = $('#tags').height();
        var fill = d3.scale.category20();
        var xValue;
        var yValue;
        var vis = d3.select('#tags')
            .append('svg:svg')
            .attr('width', w)
            .attr('height', h);

        d3.json("http://localhost/flow-chart/Module/FlowChart/sample.json", function (json) {
            var delta = (2 * pi) / json.Components.length;


            var link = vis.selectAll('line.link')
                .data(json.Connections)
                .enter().append('svg:line')
                .attr("class", "link")
                .style('stroke-width', 2);


            var node = vis.selectAll("circle.node")
                .data(json.Components)
                .enter().append("svg:rect")
                .attr("class", "node")
                .attr("x", function (d, i) {
                    if (i == 0) {
                        xValue = getX(i + 1);
                        hashTableX.push(xValue);
                        return xValue;
                    }
                    else {
                        if(lastXGroup != d.Level)
                        {
                            xValue = xValue + 200;
                        }
                        lastXGroup= d.Level;
                        hashTableX.push(xValue);
                        return xValue;
                    }
                })
                .attr("y", function (d, i) {
                    if (i == 0) {
                        yValue = getY(i + 1);
                        hashTableY.push(yValue);
                        return yValue;
                    }
                    else {
                        if(lastXGroup == d.Level)
                        {
                            yValue = yValue + 80;
                        }
                        else
                        {
                            yValue = getY(1);
                        }
                        lastXGroup = d.Level;
                        hashTableY.push(yValue);
                        return yValue;
                    }

                })
                .attr("rx", 5).attr("ry", 5).attr("width", 100).attr("height", 50).attr("stroke", "#658BA5")
                .style("fill","#fff")


            vis.selectAll("circle.node")
                .data(json.Components)
                .enter().append('text').attr("class", "title")
                .attr("x", function(d,i) {
                    if (i == 0) {
                    xValue = getX(i + 1)+10;
                    hashTableX.push(xValue);
                    return xValue;
                }
                else {
                    if(lastXGroup != d.Level)
                    {
                        xValue = xValue + 100;
                    }
                    lastXGroup= d.Level;
                    hashTableX.push(xValue);

                    return xValue;
                } })
                .attr("y",function(d,i) { if (i == 0) {
                    yValue = getY(i + 1)+10;
                    return yValue;
                }
                else {
                    if(lastXGroup == d.Level)
                    {
                        yValue = yValue + 78;
                    }
                    else
                    {
                        yValue = getY(1)+10;
                    }
                    lastXGroup = d.Level;
                    return yValue;
                }})
              //  .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .each(function (d,j) {
                    var lines = wordwrap(d.Name, 12)
                    for (var i = 0; i < lines.length; i++) {
                        d3.select(this).append("tspan").attr("dy",15).attr("x",hashTableX[j]+50).text(lines[i])
                    }
                });

            link.attr("x1", function (d,i) {
                return hashTableX[d.From-1]+50;
            })
                .attr("y1", function (d) {
                    return hashTableY[d.From-1]+25;
                })
                .attr("x2", function (d) {
                    return  hashTableX[d.To-1]+50;
                })
                .attr("y2", function (d) {
                    return  hashTableY[d.To-1]+25;
                });


            function getX(d) {
                var theta = +d * delta;
                return r1 * Math.cos(theta);
            }

            function getY(d) {
                var theta = +d * delta;
                return r1 * Math.sin(theta);
            }

            // to wrap long text
            function wordwrap(text, max) {
                var regex = new RegExp(".{0,"+max+"}(?:\\s|$)","g");
                var lines = []

                var line
                while ((line = regex.exec(text))!="") {
                    lines.push(line);
                }

                return lines
            }
        });


    }]);
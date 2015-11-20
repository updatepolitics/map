http://tributary.io/inlet/5037035


var numSteps = 14;
var width = 540;
var step = Math.ceil(width/numSteps);
var colors = ['#adcc8f','#9e8fcc'];
var colors2 = ['#d87d7d','#ccdba7'];
var dom = [0, numSteps-1];


var colorScale1 = d3.scale.linear().domain(dom).range(colors).interpolate(d3.interpolateHcl);
var colorScale2 = d3.scale.linear().domain(dom).range(colors2).interpolate(d3.interpolateHcl);


g.selectAll('rect.hcl1')
	.data(d3.range(numSteps))
	.enter().append('rect')
	.attr({
      width: step-2,
      height: 39,
      transform: function(d, i) {
      	return 'translate(' + [50 + i*step, 375	] + ')'
      },
      fill: function(d, i) {
      	return colorScale1(d);
      },
      class: 'hcl1'
	});


g.selectAll('rect.hcl2')
	.data(d3.range(numSteps))
	.enter().append('rect')
	.attr({
      width: step-2,
      height: 39,
      transform: function(d, i) {
      	return 'translate(' + [50 + i*step, 307	] + ')'
      },
      fill: function(d, i) {
      	return colorScale2(d);
      },
      class: 'hcl2'
	});

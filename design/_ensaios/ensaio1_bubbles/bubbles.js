window.onload = function(){

    var json;
    var scale = 10;
    var total_alpha = .15;

    var width;
    var height;

    var nodes;

    var force;
    var svg;
    var circle;

    var metodos = ['#accd8c','#86cc9d', '#5fc8b3', '#3bc1c8'];

	d3.json("dados.json", function(error, data)  {

		json = data;

        width = 960,
        height = 500;

        nodes = json.sub_metodos.map(function ( d ) {
            return {
                total: scale * Math.sqrt(d.total / Math.PI),
                parcial: scale * Math.sqrt(d.parcial / Math.PI),
                cor: metodos[ d.metodo ],
                cx: width / 2,
                cy: height / 2,
            };
        });

        force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(0)
            .charge(0)
            .on("tick", tick)
            .start();

        svg = d3.select("#chart").append("svg")
            .attr("style", 'background:#212733')
            .attr("width", width )
            .attr("height", height );

        circle = svg.selectAll("g")
            .data(nodes)
            .enter()
            .append('g')
            .each(function(d) {
                d3.select(this)
                    .append("circle")
                    .attr("r", function (d) { return d.total; })
                    .attr("fill", function (d) { return d.cor; })
                    .attr("fill-opacity",  total_alpha)
                d3.select(this)
                    .append("circle")
                    .attr("r", function (d) { return d.parcial; })
                    .attr("fill", function (d) { return d.cor; })
            });


        function tick(e) {
            circle.each(gravity(.2 * e.alpha))
                .each(collide(.75))
                .attr("transform", function (d) {
                return 'translate(' + d.x + ' ' + d.y + ')' ;
            });
        }

        // Move nodes toward cluster focus.
        function gravity(alpha) {
            return function (d) {
                d.y += (d.cy - d.y) * alpha;
                d.x += (d.cx - d.x) * alpha;
            };
        }

        // Resolve collisions between nodes.
        function collide(alpha) {
            var quadtree = d3.geom.quadtree(nodes);
            return function (d) {
                var r = d.total,
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function (quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.total + quad.point.total + (d.color !== quad.point.color);
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            };
        }
    });

} // onload

/*

var circle = svg.selectAll("g")
    .data(nodes)
    .enter().append('g')
    .append("circle")
    .attr("r", function (d) {
        return d.total;
    })
    .style("fill", function (d) {
        return d.color;
    })
    // .call(force.drag);
*/

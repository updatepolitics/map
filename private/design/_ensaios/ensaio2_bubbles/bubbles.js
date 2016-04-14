window.onload = function () {

    var json;
    var scale = 50;
    var total_alpha = .15;
    var dur = 500;

    var win_w;
    var win_h;

    var nodes;
    var c_total;
    var c_parcial;

    var force;
    var svg;
    var circle;

    var metodos = ['#accd8c', '#86cc9d', '#5fc8b3', '#3bc1c8'];

    // funcs

    function resize(){
		win_w = $( window ).width();
		win_h = $( window ).height();
	}

	resize();
	window.onresize = resize;

    function calc_raio(area){
        return scale * Math.sqrt(area / Math.PI);
    }

    // objetos

    $('#bt1').on('click', function(){
        nodes.forEach(function (d,i) {
            d.parcial = d.total;
            d.c_parcial
                .transition().duration(dur)
                .attr('r', calc_raio( d.parcial));
        });
    })

    $('#bt2').on('click', function(){
        nodes.forEach(function (d,i) {
            d.parcial = d.parcial * Math.random();
            d.c_parcial
                .transition().duration(dur)
                .attr('r', calc_raio( d.parcial));
        });
    });

    $('#bt3').on('click', function(){
        nodes.forEach(function (d,i) {
            if(d.metodo != 1){
                d.parcial = 0;
            }

            d.c_parcial
                .transition().duration(dur)
                .attr('r', calc_raio( d.parcial));
        });
    });

    // dados

    d3.json('dados.json', function (error, data) {

        json = data;

        nodes = json.sub_metodos.map(function (d,i) {
            return {
                ID: d.id,
                metodo: d.metodo,
                cor: metodos[d.metodo],
                cx: win_w / 2,
                cy: win_h / 2,
            };
        });

        force = d3.layout.force()
        .nodes(nodes)
        .size([win_w, win_h])
        .gravity(0)
        .charge(10)
        .on('tick', tick)
        .start();

        svg = d3.select('#chart').append('svg')

        circle = svg.selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('style', 'cursor:pointer')
        // .on('click', function(d){
        //     alert('CÍRCULO ' + d.ID);
        // })
        .call(force.drag)
        .each(function (d, i) {
            //d.circle = d3.select('#circ' + i);

            c_total = d3.select(this)
                .append('circle')
                .attr('id', 'circ' + i + '_total')
                .attr('fill-opacity', total_alpha)
                .attr('fill', function (d) {
                    return d.cor;
                });

            c_parcial = d3.select(this)
                .append('circle')
                .attr('id', 'circ' + i + '_parcial')
                .attr('fill', function (d) {
                    return d.cor;
                });

            d.c_total = c_total;
            d.c_parcial = c_parcial;
            d.total = 0;
            d.parcial = 0;

            json.sinais.forEach( function( sd, si ){
                if(sd.sub_metodos.indexOf(i) >= 0) {
                    d.total ++;
                    d.parcial ++;
                }
            });

            d.radius = calc_raio(d.total) + 1;
            c_total.attr('r', calc_raio(d.total));
            c_parcial.attr('r', calc_raio(d.parcial));
        });


        function tick(e) {
            circle.each(gravity(.1 * e.alpha))
            .each(collide(.25))
            .attr('transform', function (d) {
                return 'translate(' + d.x + ' ' + d.y + ')';
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
                var r = d.radius,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
                quadtree.visit(function (quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.color !== quad.point.color);
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

var circle = svg.selectAll('g')
.data(nodes)
.enter().append('g')
.append('circle')
.attr('r', function (d) {
return d.total;
})
.style('fill', function (d) {
return d.color;
})
//
*/

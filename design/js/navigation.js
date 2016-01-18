
// public vars
var i, a, b, c, d, itm1, itm2, itm3;
var div, ul, li, span, img, hr;
var dbody = document.body,
    mobile,
    bt_event,
    lg,
    delay;

var dur = 350, // animation
    dur2 = 550, // layout
    in_out = "easeInOutQuart",
    _out = "easeOutQuart",
    in_ = "easeInQuart";

// public funcions

function get(id){ return document.getElementById(id)};
function reg(id){ document[id] = get(id) }

var root = location.origin;
var path = location.pathname.split('/');
console.log( "ROOT: " + root );

var cur_page = path[path.length-1];
console.log( "cur_page: " + cur_page );

for(i=0; i<path.length-1; i++){
    root += path[i] + '/';
}

// placeholders for local functions

var resize_update = false,
    resize_content = false;

var lang_update = false,
    lang_methodology = false,
    lang_about = false;

// location

function set_location( html, section, cod, push ){
    var new_loc = root;
    var navigate = false;
    if ( section ){
        new_loc += "index.html?section=" + section;
        if(cod) new_loc += "&cod=" + cod;
        if ( cur_page != "index.html" ){
            navigate = true;
        } else { // + update.js
            if(section != cur_layout) set_layout(section);
            if( cod && cod != cur_target ){
                set_target( cod );
            }
            if(push) history.pushState({page: new_loc}, '', new_loc );
        }
    } else {
        new_loc += html;
        navigate = true;
    }

    if(navigate) document.location.href = new_loc;
}

function $_GET() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var get_section,
    get_cod;

function check_get(){
    get_section = $_GET()["section"];
    if(get_section) set_layout(get_section);

    get_cod = $_GET()["cod"];
    if(get_cod && get_cod != cur_target) set_target( get_cod );
}

window.onpopstate = check_get;

// MOBILE

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


if( isMobile.any() ){
    mobile = true;
    $(dbody).addClass('mobile');
    bt_event = 'touchstart';
}else{
    mobile = false;
    bt_event = 'click';
}

console.log( "MOBILE: " + mobile );

// Lang

var lgs = [
    {lg:"_pt", lb:"PT"},
    {lg:"_es", lb:"ES"},
    {lg:"_en", lb:"EN"}
];

function set_lg(_lg){
    for( i in lgs ){
        if( lgs[i].lg != _lg ) $(lgs[i].li).removeClass('selected');
        else $(lgs[i].li).addClass('selected');
    }
    sessionStorage.setItem('lg', _lg);
    lg = _lg;

    // menu

    // pages
    if(lang_update) lang_update();
    if(lang_methodology) lang_methodology();
    if(lang_about) lang_about();

}

// header objects

reg('header');
reg('language');
reg('update_logo');
reg('menu');
reg('menu_bt');
reg('menu_bts');
reg('menu_close');
reg('email');
reg('twitter');
reg('github');
reg('fbook');
reg('curtain');

// lg

for( i in lgs ){
    li = document.createElement('li');
    li.lg = lgs[i].lg;
    $(li).html(lgs[i].lb);
    $(li).addClass("lang");
    lgs[i].li = li;
    language.appendChild(li);
    $(li).on(bt_event, function(){
        set_lg(this.lg);
    });
    if( i < lgs.length-1){
        li = document.createElement('li');
        li.className = "lg_sep";
        language.appendChild(li);
    }
}

if( !sessionStorage.getItem('lg')) set_lg('_pt'); // defaut lang
else  set_lg(sessionStorage.getItem('lg'));

// WINDOW

function resize(){

    // public resize

	win_w = $( window ).width();
	win_h = $( window ).height();

	if(mobile){
		if(win_w < win_h) $(dbody).addClass('port');
		else $(dbody).addClass('land');
	}else{
		if( win_w > 1200 ) $(dbody).addClass('layout2');
		else $(dbody).removeClass('layout2');
	}

    // local resize

	if(resize_update) resize_update();
	// if(resize_content) resize_content();

}

window.onresize = resize;
resize();

// menu

var pages = [
    { _pt:'IN&Iacute;CIO', html:"index.html", section:"home", cod:false },
    { _pt:'EXPLORE', html:"index.html", section:"map", cod: false },
    { _pt:'SINAIS', html:"index.html", section:"list", cod:'sig' },
    { _pt:'HUBS', html:"index.html", section:"list", cod:'hub' },
    { _pt:'METODOLOGIA', html:"methodology.html", section:false, cod:false },
    { _pt:'SOBRE', html:"about.html", section:false, cod:false }
];

function open_menu(){
    menu.open = true;
    $(menu).animate({left:0}, dur, _out);
    $(container).animate({left:$(menu).width()/5}, dur, _out);
    $(header).animate({left:$(menu).width()/5 }, dur, _out);
    $(curtain).fadeIn(dur, _out);
}

function close_menu(){
    menu.open = true;
    $(menu).animate({left:-1*$(menu).width()}, dur, _out);
    $(container).animate({left:0}, dur, _out);
    $(header).animate({left:0 }, dur, _out);
    $(curtain).fadeOut(dur, _out);
}

function set_menu(id){
    for( i in pages ){
        if( i == id) $(pages[i].li).addClass('selected');
        else $(pages[i].li).removeClass('selected');
    }
}

if( cur_page == '' ){
    cur_page = 'index.html';
    set_location('index.html', false, false, false);
}

for( i in pages ){

    li = document.createElement('li');
    li.d = pages[i];
    pages[i].li = li;
    $(li)
        .addClass('bt')
        .html( pages[i][lg] )
        .on( bt_event, function(){
            set_location(this.d.html, this.d.section, this.d.cod, true);
        });

    if(pages[i].html == cur_page){
        $(li).addClass('selected');
    }

    menu_bts.appendChild(li);

}

menu.open = false;

$(menu_bt).on( bt_event, function (){
    open_menu();
});

$(menu_close).on( bt_event, function (){
    close_menu();
});

if(!mobile){
    $(menu).on('mouseleave', function (){
        close_menu();
    });
}

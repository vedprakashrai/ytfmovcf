let props = ["original_title","year_of_release","genres","imdb_rating","actors","director","yt","poster_path","tplus"];

var categories=["Classic","50s","60s","70s","80s","90s","00s","10s","20s","High Rated","Latest","Art","Most Watched","Memetic","Black and White","New Arrival"]

function expandPP(spath,title,year){
  if(!spath) 
    return "";
  if(!isNaN(spath)){
    return "./posters/"+spath;
  }
  var fpath = "";
  if(spath.indexOf('@')===0){
      fpath+='commons/thumb/';
      spath=spath.slice(1);
  }else{
      fpath+='en/thumb/'; 
  }
  fpath+= spath[0]+"/" +spath[1] +spath[2] +"/";
  spath = spath.slice(3);
  fpath+=  spath.replace("&",title.replaceAll(" ","_"),)
  .replaceAll("=","poster").replaceAll("!","Poster")
  .replaceAll("+","film").replaceAll(",","Film")
  .replace("*",".jpg") .replaceAll("<","movie")
  .replaceAll(">","Movie").replace("^",".JPG")
  .replace("?",".jpeg").replaceAll("~",year)
  .replace("(","%28").replace(")","%29");

  return "https://upload.wikimedia.org/wikipedia/"+fpath +"/220px-"+fpath.split("/").slice(-1);
}


var tooltip=function (ele) {
  var n;
  var i;
  var h = false;
  if (!(window.innerWidth < 1024)) {
    (n = ele.tooltipster({
      contentAsHTML: true,
      updateAnimation: false,
      arrow: false,
      side: ["right", "left"],
      interactive: true,
      delay: 200,
      minWidth: 320,
      maxWidth: 320,
      content: "Loading..",
      functionBefore: function (n, t) {
        if (!h) {
          h = true;
         /* $.ajax("ajax/film/tooltip/".concat(u.data("tip")), o).done(function (t) {
            return n.content(t);
          }); */
          $.ajax("tooltips/".concat(ele.data("tip")).concat(".html"), {dataType: "html" }).done(function (ttHtml) {
            return n.content(ttHtml);
          });
        }
      },
      functionPosition: function (t, n, i) {
        if ("left" === i.side) {
          i.coord.left += 0.5 * n.geo.origin.size.width;
        } else {
          i.coord.left -= 0.5 * n.geo.origin.size.width;
        }
        i.coord.top -= (n.geo.origin.size.height - i.size.height) / 2;
        i.coord.top += 0.5 * n.geo.origin.size.height;
        return i;
      }
    }).tooltipster("instance")).on("before", i = function () {
      setTimeout(function () {
        try {
          $(ele.tooltipster("elementTooltip")).activate();
        } catch (t) {}
      }, 10);
    });
    n.on("updated", i);
  }
}


let movies = [];
let allMovies = [];
let pageSize = 32;
let pages = [];
var firstPageLoad = true;

//$.get("m.json", function(ph, status){
var moviedb = ph.moviedb;
var actorsFreq = ph.actorsFreq;
var dirFreq = ph.dirFreq;
var genres = ph.genres;
moviedb.forEach(mo=>{

  mo[4] = mo[4].split("|").map(m=>expandName(!isNaN(m)?actorsFreq[m]:m));
  mo[5] = mo[5].split("|").map(m=>expandName(!isNaN(m)?dirFreq[m]:m));
  mo[2] = mo[2].split("|").map(m=>genres[m]);
  mo[1] = mo[1]>24?1900+mo[1]:2000+mo[1];
  if(mo.length==7)
    {
      mo.push('');
    }else{
      mo[7] = expandPP(mo[7],mo[0],mo[1]);
    }
  if(mo.length==8)
    {
      mo.push(0);
    }
  let movie = {};
  props.forEach(p=>{
      movie[p] = mo[props.indexOf(p)];
      })
  movie.tooltip= movie.original_title.replaceAll(' ','').replace(/[^a-zA-Z 0-9]+/g, '')+movie.year_of_release;
  movies.push(movie);
});

allMovies =sort([...movies],"imdb_rating");


pages = paginate(allMovies, pageSize);

init();
  
//});
/*window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if(!!preloader)
    preloader.style.display = 'none';
  });*/

  document.getElementById("searchAll")
  .addEventListener("keydown", function(event) {
 //change to include filter selection also
  if (event.key === "Enter" && document.getElementById("searchAll").value )  {
    event.preventDefault();
    filterAll();
  }
});


  
//movies.forEach(d=>document.getElementById("cards").insertAdjacentHTML('beforeend',getNewDiv(d)));
function renderPage(page){
 // console.log(document.getElementById("cards"));
 // if(!!document.getElementById("cards") && !!document.getElementById("cards").children())
   document.getElementById("cards").innerHTML='';
   
   if(!page || !page.length){
    document.getElementById("cards").insertAdjacentHTML('beforeend',"<h3>No Results</h3>");
   }else{
    page.forEach(d=>document.getElementById("cards").insertAdjacentHTML('beforeend',getNewDivTemplate(d)));
    document.querySelectorAll('.tooltipstered').forEach(e=>tooltip($(e)));
   }
}

function getNewDivTemplate(mov){
    //data-bs-toggle="modal" data-bs-target="#ytModal" 
    var div=
    `<div class="movie-item item">
    <div class="item-inner">
      <a class="cover tooltipstered" data-tip="${mov.tooltip}"  onclick = "openYT('${mov.yt}','${mov.tplus}','${mov.original_title}');">
        <div>
          <img class=" ls-is-cached lazyloaded" 
            src="${mov.poster_path}" alt= "${mov.original_title}">
        </div>
     </a>
      <div class="detail">
        <div class="title">${mov.original_title}</div>
        <div class="info"> <span class="type">${mov.year_of_release}</span> <span><i class="fa-solid fa-star"></i>${mov.imdb_rating}</span> </div>
      </div>
    </div>
  </div>`;

  return div;
   }

function openYT(yt,tplus,title){
     window.open("https://www.youtube.com/watch?v="+yt+(tplus!=undefined?"&t="+tplus:""), '_blank').focus();
    
    //*document.getElementById('video').src = "https://www.youtube.com/embed/"+yt+"?"+(!!tplus || tplus!=undefined?"&t="+tplus:"")+"&autoplay=1&mute=1";
   // document.getElementById('modalHeader').innerHTML = title;
    //document.getElementById('ytModal').modal({keyboard: true});
   }


   function createPagination(totPages){
    totPages = totPages||1;
    window.pagObj = $('#pagination').twbsPagination({
       //initiateStartPageClick: false,
        totalPages: totPages,
        visiblePages: 5,
        first:"<i class=\"fa-solid fa-angles-left\"></i>",
        prev:"<i class=\"fa-solid fa-angle-left\"></i>",
        next:"<i class=\"fa-solid fa-angle-right\"></i>",
        last:"<i class=\"fa-solid fa-angles-right\"></i>",
        onPageClick: function (event, pageNumber) {
          //  console.info(page + ' (from options)');
          //  document.getElementById("cards").children().remove();
          if(!firstPageLoad){
            renderPage(pages[pageNumber-1]);
          }
          firstPageLoad = false;
        }
    }).on('page', function (event, page) {
        //console.info(page + ' (from event listening)');
    });
   }

  
   function paginate(arr, size) {
    return arr.reduce((acc, val, i) => {
        let idx = Math.floor(i / size)
        let page = acc[idx] || (acc[idx] = [])
        page.push(val)
        return acc
    }, [])
}


var change = function (n) {
    var e;
    var o;
    var f = "";
    var c = $(this).closest(".dropdown-menu");
    var W = c.parent().find("[data-label-placement]");
    if ((W = W && W.length ? W : c.parent().find("[data-toggle=\"dropdown\"]")) && W.length && false !== W.data("placeholder") && (null == W.data("placeholder") && W.data("placeholder",  $.trim(W.text())),
     f = $.data(W[0], "placeholder"), 
     e = parseInt(W.data("maxItems")), 
     isNaN(e) && (e = 1), o = (o = W.data("maxText")) || "%s selected", 
     (c = c.find("li > input:checked")).length && (f = [], c.each(function () {
      var t;
      var r = $(this).parent().find("label").eq(0);
      var e = r.find(".data-label");
      if (r = (e.length ? ((t = $("<p></p>")).append(e.clone()), t) : r).html()) {
        f.push($.trim(r));
      }
    }), f = f.length > e ? o.replace("%s", f.length) : f.join(", ")), c = W.find(".caret"), W.html(f || ""), c.length) && W.append(" ")) {
      c.appendTo(W);
    }
  };
  

  document.querySelectorAll(".dropdown-menu li input").forEach(e=>e.onchange= change);
 

 // document.querySelectorAll('input[name=genre]:checked');


  function filterAll(){
    movies = [...allMovies];

    var searchText =document.getElementById("searchAll").value ;
    var searchIn =  document.getElementById("searchIn").innerHTML.trim();

    if(searchText){
      searchText = searchText.trim();
      movies = searchAll(searchText,searchIn,movies);
    }
    
    var selectedGenre =[...document.querySelectorAll('input[name=genre]:checked')].map(f=>f.value);
    if(selectedGenre.length){
      movies = movies.filter(movie=>selectedGenre.some(gen=>movie.genres.includes(gen)));
     
    }

    var selectedYear =[...document.querySelectorAll('input[name=year]:checked')].map(f=>f.value);
    if(selectedYear.length){
      movies = movies.filter(movie=> selectedYear.some( years =>{
        let startYear,endYear;
        [startYear,endYear] = years.split("-");
       // console.log(movie.year_of_release,movie.year_of_release >=Number(startYear) && movie.year_of_release <=Number(endYear));
        return movie.year_of_release >=Number(startYear) && movie.year_of_release <=Number(endYear)
      }));
    }else{
    //  movies = [...allMovies];
    }

    var sortBy  =document.querySelector('input[name=sort]:checked')?.value;

    if(searchText ||  selectedGenre.length || selectedYear.length || sortBy){
    	movies =  sort(movies,sortBy);
    }
    pages = paginate(movies, pageSize);
    //renderPage(pages[0]);
    $('#pagination').twbsPagination('destroy');
    createPagination(pages.length);
    //document.querySelectorAll('.tooltipstered').forEach(e=>tooltip($(e)));
  }

  function searchAll(searchText,searchIn,movies){

   
    if(searchText.length){
      switch (searchIn){
        case "Title":
          movies = movies.filter(movie=>~movie.original_title.toUpperCase().indexOf(searchText.toUpperCase()));
          break;
        case "Actor": {
            // var actorIndex = actorsFreq.indexOf(searchText);
            movies = movies.filter(movie=>movie.actors.filter(actor=>!!actor && ~actor.toUpperCase().indexOf(searchText.toUpperCase())).length>0);
            break;
          }
         
        case "Director": {
            // var actorIndex = actorsFreq.indexOf(searchText);
            movies = movies.filter(movie=>movie.director.filter(director=>!!director && ~director.toUpperCase().indexOf(searchText.toUpperCase())).length>0);
            break;
          }
        }
    }else if(movies.length!=allMovies.length){
      movies = [...allMovies];
    }

    return movies;
    
    /*pages = paginate(movies, pageSize);
    //renderPage(pages[0]);
    $('#pagination').twbsPagination('destroy');
    createPagination(pages.length);
    //document.querySelectorAll('.tooltipstered').forEach(e=>tooltip($(e)));
    */
  }

  function sort(movs,sortBy){
    sortBy = sortBy || "year_of_release"; //default sort by year asc

    switch(sortBy){
      case "original_title" : movs.sort((a,b)=>a[sortBy].localeCompare(b[sortBy])); 
                              break;
      case "imdb_rating" : movs.sort((a,b)=>b[sortBy]===a[sortBy] ? b["year_of_release"]<a["year_of_release"]? 1 :-1 : b[sortBy]>a[sortBy]? 1 :-1);
                           break;
      default : movs.sort((a,b)=>((a[sortBy]>b[sortBy]) || (a["year_of_release"]>b["year_of_release"])) ? 1 :((a[sortBy]<b[sortBy]) || (a["year_of_release"]>b["year_of_release"])) ? -1 : 0);
    }

   /* if(sortBy=="original_title"){
      movs.sort((a,b)=>a[sortBy].localeCompare(b[sortBy]));
    }else{
      movs.sort((a,b)=>((a[sortBy]>b[sortBy]) || (a["year_of_release"]>b["year_of_release"])) ? 1 :((a[sortBy]<b[sortBy]) || (a["year_of_release"]>b["year_of_release"])) ? -1 : 0);
    }
    if(sortBy==="imdb_rating") //decending for rating
    movs.sort((a,b)=>{if(b[sortBy]===a[sortBy]){
        return b["year_of_release"]<a["year_of_release"]? 1 :-1
         }else{
          return b[sortBy]>a[sortBy]? 1 :-1
         }})

    //  movs.sort((a,b)=>((b[sortBy]>a[sortBy]) || (b["year_of_release"]>a["year_of_release"])) ? 1 : ((b[sortBy]<a[sortBy]) || (b["year_of_release"]<a["year_of_release"])) ? -1 :0);
    */  
    return movs;
    }       

    var searchInField = "Title";
    function searchIn(item) {
      document.getElementById("searchIn").innerHTML = item.innerHTML;
      searchInField = item.innerHTML;
      document.getElementsByName("keyword")[0].placeholder = "Search "+item.innerHTML.toLowerCase()+"s";
    }


function expandName(name){
  if(!name)
    return "";
   return name.replace(/([^.\s])([A-Z])/g, function(match, prev, cap) {
        return prev + ' ' + cap;
    });
}
  window.openYT = openYT;
//main code
function init(){
  createPagination(pages.length);
  document.querySelectorAll('.tooltipstered').forEach(e=>tooltip($(e)));

}


$(document)//.off(".bs.dropdown.data-api")
        //.on("click.bs.dropdown.data-api", C)
        //.on("click.bs.dropdown.data-api", "[data-toggle=\"dropdown\"]", e.toggle)
        .on("click.bs.dropdown.data-api", ".dropdown-menu li > input[type=\"checkbox\"] ~ label, .dropdown-menu li > input[type=\"checkbox\"], .dropdown-menu.noclose li, .dropdown-menu.noclose", function (n) {
  n.stopPropagation();
})
 // document.querySelectorAll('.tooltipstered').forEach(e=>tooltip($(e)));
  //renderPage(pages[0]);

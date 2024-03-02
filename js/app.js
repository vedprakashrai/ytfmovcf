

//const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
//const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
//import { getDatabase } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getFirestore,doc, getDoc,collection,getDocs,query,limit} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";


// Initialize Firebase
/*var config = {
    apiKey: "AIzaSyBnSrCl0UvzIq1yrDMJ3zsHyLKkuQ_nPvA",
    authDomain: "asdfadsf-a56e7.firebaseapp.com",
    databaseURL: "https://asdfadsf-a56e7.firebaseio.com",
    projectId: "asdfadsf-a56e7",
    storageBucket: "asdfadsf-a56e7.appspot.com",
    messagingSenderId: "104313484945"
};

firebase.initializeApp(config);*/

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  preloader.style.display = 'none';
});

const firebaseConfig = {
    apiKey: "AIzaSyBHMz-HEdFk4Co9M1XkIx_CcLNAvDXuIB4",
    authDomain: "ytfmov.firebaseapp.com",
    projectId: "ytfmov",
    storageBucket: "ytfmov.appspot.com",
    messagingSenderId: "781323708342",
    appId: "1:781323708342:web:f7494342adb8ed540bc317",
    measurementId: "G-5CCKPR01G5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  //const database = getDatabase();
  const db = getFirestore(app);


  //const docRef = doc(db, "ytfmov", "tt0118680");
  const docAllRef = collection(db, "ytfmov");
  ///const docSnap = await getDoc(docRef);
  //const docAll = await db.collection('ytfmov').get();
  const q = query(collection(db, "ytfmov"),limit(20));
  //all data
 // const docAll = await getDocs(docAllRef);
 //limit 20
  const docAll = await getDocs(q);
  
  //if (docAll.exists()) {
   // if (!!docAll.length) {
   // console.log("Document data:", docSnap.data());

    console.log("all:",docAll.docs.map(d=>d.data()));
    //docAll.docs.forEach(d=>document.body.insertAdjacentHTML('beforeend',getDiv(d.data())));
    docAll.docs.forEach(d=>document.getElementById("cards").insertAdjacentHTML('beforeend',getDiv(d.data())));
  /*} else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }*/

  function getDiv(mov){
   //return  "<div class=\"parent\"> <div class=\"img\"><a href=\"https://www.youtube.com/watch?v="+mov.yt+"&t="+mov.tplus+"\"><img src="+mov.poster_path+" /></a></div><div class=\"text\">"+
    //mov.original_title +"</div><a href=\"https://www.youtube.com/watch?v="+mov.yt+"&t="+mov.tplus+"+Youtube</a></div>";

    
   var div = "<div class=\"card\">"+
               "<img src=\""+mov.poster_path+"\">"+
                "<div class=\"content\">"+
                    "<h1>"+mov.original_title+"</h1>"+
                    "<p>"+mov.summary.substring(0,50)+"...</p>"+
                    "<div class=\"rating\">"+
                        "<i class=\"fa-solid fa-star\"></i><i class=\"fa-solid fa-star\"></i><i class=\"fa-solid fa-star\"></i><i class=\"fa-solid fa-star\"></i><i class=\"fa-regular fa-star\"></i>"+
                        "<h2>"+mov.imdb_rating +" RATING</h2>"+
                    "</div>"+
                    "<div class=\"buttons\">"+
                        "<button class=\"play\" onclick = \"openYT('"+mov.yt+"','"+mov.tplus+"');\"><i class=\"fa fa-play\" ></i>PLAY</button>"+
                        "<button class=\"plus\"><i class=\"fa fa-plus\"></i></button>"+
                    "</div>"+
                "</div>"+
                "<b>"+mov.original_title+"</b>"+
            "</div>";
    return div;

  }

  function openYT(yt,tplus){
    window.open("https://www.youtube.com/watch?v="+yt+(tplus!=undefined?"&t="+tplus:""), '_blank').focus();

  }

  window.openYT = openYT;

  var currentPage = 0;
 //  let pages = [];
   let page = [];
  // let pageSize = 36;
   //pages = paginate(moviedb, pageSize);
   let pageLi = "";
   pages.forEach((element, index) => {
       if (index != 0)
           pageLi += '<li onclick="pageChange(' + index + ')" id="page_' + index + '" class="page-item list-item" id="page_' + index + '"><a class="page-link" href="javascript:void(0)">' + index + '</a></li>';
   });
 
 
 
 
 //this.render(this.getPages(this.options.startPage));
 
 
 
   $(".page-list").after(pageLi);
   page = pages[currentPage];

   function pageChange(page) {
    currentPage = page;
    $(".list-item").removeClass("active");
    $("#page_" + page).addClass("active");
    $(".page-data").html("");
    page = pages[page];
    printRows(page);
}

   function nextPage() {
    if (pages.length - 1 > currentPage)
        page = currentPage + 1;
    pageChange(page);
}

function prePage() {
    if (currentPage < pages.length && currentPage != 0)
        page = currentPage - 1;
    pageChange(page);
}


let paginationFn={

  getPages :function (currentPage,visiblePages,totalPages) {
    var pages = [];
  
    var half = Math.floor(visiblePages / 2);
    var start = currentPage - half + 1 - visiblePages % 2;
    var end = currentPage + half;
  
    var visiblePages = visiblePages;
    if (visiblePages > totalPages) {
        visiblePages = totalPages;
    }
  
    // handle boundary case
    if (start <= 0) {
        start = 1;
        end = visiblePages;
    }
    if (end > totalPages) {
        start = totalPages - visiblePages + 1;
        end = totalPages;
    }
  
    var itPage = start;
    while (itPage <= end) {
        pages.push(itPage);
        itPage++;
    }
  
    return {"currentPage": currentPage, "numeric": pages};
  },
  
  
  
  buildListItems: function (pages,loop,totalPages) {
    var listItems = [];
  
        listItems.push(this.buildItem('first', 1));
  
        var prev = pages.currentPage > 1 ? pages.currentPage - 1 : loop ? totalPages  : 1;
        listItems.push(this.buildItem('prev', prev));
  
    for (var i = 0; i < pages.numeric.length; i++) {
        listItems.push(this.buildItem('page', pages.numeric[i]));
    }
  
        var next = pages.currentPage < totalPages ? pages.currentPage + 1 : loop ? 1 : totalPages;
        listItems.push(this.buildItem('next', next));
  
        listItems.push(this.buildItem('last', totalPages));
  
    return listItems;
  },
  
  buildItem: function (type, page) {
    var $itemContainer = $('<li></li>'),
        $itemContent = $('<a></a>'),
        itemText = this.options[type] ? this.makeText(this.options[type], page) : page;
  
    $itemContainer.addClass(this.options[type + 'Class']);
    $itemContainer.data('page', page);
    $itemContainer.data('page-type', type);
    $itemContainer.append($itemContent.attr('href', this.makeHref(page)).addClass(this.options.anchorClass).html(itemText));
  
    return $itemContainer;
  }, 
  
  render: function (pages,$listContainer) {
    var _this = this;
    $listContainer.children().remove();
    var items = this.buildListItems(pages);
    $.each(items, function(key, item){
        _this.$listContainer.append(item);
    });
  
    $listContainer.children().each(function () {
        var $this = $(this),
        pageType = $this.data('page-type');
  
        switch (pageType) {
            case 'page':
                if ($this.data('page') === pages.currentPage) {
                    $this.addClass(_this.options.activeClass);
                }
                break;
            case 'first':
                    $this.toggleClass(_this.options.disabledClass, pages.currentPage === 1);
                break;
            case 'last':
                    $this.toggleClass(_this.options.disabledClass, pages.currentPage === _this.options.totalPages);
                break;
            case 'prev':
                    $this.toggleClass(_this.options.disabledClass, !_this.options.loop && pages.currentPage === 1);
                break;
            case 'next':
                    $this.toggleClass(_this.options.disabledClass,
                        !_this.options.loop && pages.currentPage === _this.options.totalPages);
                break;
            default:
                break;
        }
  
    });
  }
  
  }

  

function getDiv(mov){
  //return  "<div class=\"parent\"> <div class=\"img\"><a href=\"https://www.youtube.com/watch?v="+mov.yt+"&t="+mov.tplus+"\"><img src="+mov.poster_path+" /></a></div><div class=\"text\">"+
   //mov.original_title +"</div><a href=\"https://www.youtube.com/watch?v="+mov.yt+"&t="+mov.tplus+"+Youtube</a></div>";

   
  var div = "<div class=\"card\">"+
              "<img src=\""+(mov.poster_path.indexOf("wikimedia")>=0?"":"https://upload.wikimedia.org/wikipedia/en/")+mov.poster_path+"\">"+
               "<div class=\"content\">"+
                   "<h1>"+mov.original_title+"</h1>"+
                   "<p>"+mov.actors.splice(0,4)+"...</p>"+
                   "<div class=\"rating\">"+
                      "<h2> RELEASED "+mov.year_of_release+" RATING "+mov.imdb_rating +" </h2>"+
                       //"<h2> RATING "+mov.imdb_rating +" </h2>"+
                   "</div>"+
                   "<div class=\"buttons\">"+
                       "<button  class=\"play\" data-bs-toggle=\"modal\" data-bs-target=\"#ytModal\" onclick = \"openYT('"+mov.yt+"','"+mov.tplus+"','"+mov.original_title+"');\"><i class=\"fa fa-play\" ></i>PLAY</button>"+
                       "<button class=\"plus\"><i class=\"fa fa-plus\"></i></button>"+
                   "</div>"+
               "</div>"+
               "<b>"+mov.original_title+"</b>"+
           "</div>";
   return div;

 }
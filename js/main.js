
const mainURL = "https://swapi.co/api/";

window.addEventListener('load', function () {
    new UserInterface();
}, false);

var UserInterface = function () {

    var url,
        xhr,
        loading,
        postsBody,
        menu,
        mdlBody,
        posts,
        search,
        pageCount,
        infoClick;

    function __init__() {
        var initialHeight = document.documentElement.scrollHeight;
        pageCount = 1;
        infoClick = false;

        loading = document.getElementById('loader');
        postsBody = document.getElementById('posts-body');
        mdlBody = document.getElementById('mdlBody');
        posts = document.getElementById('char-list');
        search = document.getElementById('search');
        search.addEventListener('input', searchField, false);
        menu = document.getElementById('menu-btns');
        menu.addEventListener('click', Hendler, false);
        window.addEventListener('scroll', function () {
            PageScroll(initialHeight);
        }, false);

        xhr = new XMLHttpRequest();
        url = "https://swapi.co/api/people/";
        Request();
    }


    /*Handler for menu buttons*/
    function Hendler(e) {
        url = mainURL;
        var target = e.target;
        var clickOn = target.getAttribute('data-route');
        console.log(clickOn);
        if(clickOn){
            url += clickOn;
            cleanDOM();
            Request();
        }
    }

    function Request() {
        xhr.open('GET', url, true);
        console.log('Func req' + url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState < 4) {
                loading.classList.toggle('d-none');
                console.log(xhr.readyState);
            } else {
                if (xhr.status === 200) {
                   var data = JSON.parse(xhr.responseText);
                    loading.classList.toggle('d-none');
                    postsBody.classList.remove('d-none');
                    getContent(data);
                }
            }
        };
        xhr.send();
    }

    /*Go through data from API*/
    function getContent(data) {
        var branchData = (infoClick === false)?
        function(data){
            for (var i = 0; i < data.results.length; i++) {
           // console.log(data.results[i]);
            renderHTML(data.results[i]);}
        } : function(data){
            renderHTML(data);
        };
        branchData(data);
     
    }

    /*Create HTML elements*/
    function renderHTML(obj_val) {
        var classList = {
            a: 'list-group-item list-group-item-action flex-column align-items-start lore-object-info',
            div: 'd-flex w-100 justify-content-between',
            h5: 'mb-1'
        };
        var a_elem = document.createElement('a');
        var div_elem = document.createElement('div');
        var h_elem = document.createElement('h5');

        console.log(infoClick);
        console.log(obj_val);

        a_elem.className = classList['a'];
        div_elem.className = classList['div'];
        h_elem.className = classList['h5'];
        
        var branchContent = (infoClick === false)?
        function(){ 
            posts.appendChild(a_elem)
            a_elem.addEventListener('click', function (e) {
                callInfo(e);
            }, false);
        } : function(){ 
            cleanDOM();
            mdlBody.appendChild(a_elem);
        };
        branchContent();
        a_elem.appendChild(div_elem);
        div_elem.appendChild(h_elem);



        function Combine(){ /*Combines data from API with HTML*/
            h_elem.innerText = obj_val.name;
            for(var key in obj_val){
                var li_elem = document.createElement('li');
                li_elem.className = classList['h5'];
                a_elem.appendChild(li_elem);
                var info = key.replace(/_/g, ' ');
                li_elem.innerText = info + ': ' + obj_val[key];
            }
            for(var n = 0; n < a_elem.childNodes.length; n++){
                a_elem.children[n].setAttribute('data-loreObj', obj_val.url);
            }
        }
        Combine();
        infoClick = false;
    }

     function callInfo(e){
        //console.log(e.target.innerText);
        console.log(e.target.getAttribute('data-loreobj'));
        url = e.target.getAttribute('data-loreobj');
        infoClick = true;
        Request();
         $('#ModalLong').modal('toggle');//Bootstrap jquery modal window activation
    }

    /*Clear DOM from previous post*/
    function cleanDOM() {
        var clearDOM = (infoClick === false) ?
        function(){
            while (posts.firstChild){
                posts.removeChild(posts.firstChild);
            }
        }: function(){
            while (mdlBody.firstChild){
                mdlBody.removeChild(mdlBody.firstChild);
            }
        };
        clearDOM();
    }


    /*Scroll pagination*/
    function PageScroll(initialHeight) {
        var apiPage = '?page=';
        var height = document.documentElement.scrollHeight - initialHeight;
        var scrolled = document.documentElement.scrollTop;
        /*If scrolled === height => API next page request => render HTML */
        if(height === 0){

        }else {
            if(scrolled === height){
                pageCount++;
                url += apiPage + pageCount;
                Request();
            }
            url = url.replace(/[?]page[=]\d/g, '');
        }
    }
    
    
    function searchField() {
        var searchMatch =  new RegExp(search.value + '\\w+', 'g');
    }


    (function () {
        __init__();
    })();
};
let $site = document.getElementById("site");
let $posts = document.getElementById("posts");
const $loader = document.querySelector(".loader");
const $template = document.getElementById("post-template").content;
const $fragment = document.createDocumentFragment();

const urlSite = document.querySelector(".urlSite");
var url2="";

// PREGUNTAMOS SI EL INPUTO NO ESTA LLENO
 // 2-  se mandan llamar a la carga del DOM
document.addEventListener("DOMContentLoaded", e=>{  

  document.addEventListener("click", e=>{
    //console.log(e.target);
  
  

  url2 = urlSite.value; 
  if(e.target.matches(".traerInfo")){
    
    if(urlSite.value === ""){
      console.log('no hay url');
    }else{
    
    //console.log('si hay url');
    console.log(url2);

  //https://developer.wordpress.org/rest-api/reference/ DE AQUI NOS BASAMOS PARA LOS ENDPOINTS
  const DOMAIN = url2;                    // igual aqui solo cambiamos la URL podriamos agregar un input que capture esta URL                                         
  console.log(`DOMAIN: ${DOMAIN}`);
  //const DOMAIN = "https://malvestida.com/";                    // igual aqui solo cambiamos la URL podriamos agregar un input que capture esta URL                                         
  const SITE = `${DOMAIN}/wp-json`;                                              
  const API_WP = `${SITE}/wp/v2`;    

      //y de aqui solo le cambiamos a la API lo que queremos traer                                          
  //const POSTS = `${API_WP}/posts?_embed`;    //Aqui  indicamos cuantos posts queremos traer con 'por_page'                                          
  //const POSTS = `${API_WP}/posts?_embed&per_page=5`;    //Aqui  indicamos cuantos posts queremos traer con 'por_page'                                          
  //const POSTS = `${API_WP}/posts?_embed&per_page=5&page=10`;    //Aqui  indicamos que tambien me lleve a la pagina 10                                          
                //Aqui lo aplico ya con las variables
  let page = 1;           // ojo el valor solo es 1, no el string page
  let per_page = 5;
  const POSTS = `${API_WP}/posts?_embed`;    //Aqui  indicamos que tambien me lleve a la pagina 10                                          
  const PAGES = `${API_WP}/pages`;                                              
  const CATEGORIES = `${API_WP}/categories`;   

  getSiteData(SITE);
  getPosts(POSTS, page, per_page);
  getScroll(POSTS, page, per_page);         // creo esta funcion solo para pasar parametros

  }
  }

  /*
  while(urlSite.content !==""){
    location.reload();
  }
*/
  /*
  while($contenedorCitas.firstChild){                                                // mientras haya un hijo
      $contenedorCitas.removeChild($contenedorCitas.firstChild);                        // removera ese 1er hijo
    }
  */

  })
})


// 1- en $site enviamos la info de ´wp-json´ 
  function getSiteData(SITE){
    fetch(SITE)
      .then( res => res.ok? res.json() : Promise.reject(res))
      .then( json => {
        console.log(json);

        // Como en este caso solo nos interesa los datos del sitio no necesitamos un array que recorra y asigne los datos traidos        
        $site.innerHTML = `<h3>Sitio Actual</h3>
        <h2>
        <a href="${json.url}" target=_blank>${json.name}</a>
        </h2>
        <p>${json.description}</p>
        <p>${json.timezone_string}</p>
        `
      })
      .catch(err =>{
        console.log(err);
        let message = err.statusText || "The website setupp doesn't work with wordpress or have restricted access"        
        $site.innerHTML = `<p>Errror ${err.status}: ${message} </p>`;
          
      })
  }
  
  //traemos la info de de los posts a la variable $posts

  function getPosts(POSTS, page, per_page){
  
    $loader.style.display = "block";
    
    fetch(`${POSTS}&page=${page}&per_page=${per_page}`,{cache:"reload"})           // {cache:"reload"}
    .then( res => res.ok? res.json() : Promise.reject(res))
    .then( json => {
      console.log(json);
      //OJOO si no tuvieramos enbed, tendriamos que hacer anidar las peticiones necesarias dentro de un 'for' normal como en los pokemones,     
      //  tendria que crear endpoints para las etiquetas, autores, imagenes y categorias
      json.forEach(el => {
        let categories = "";
        let tags = "";
                      // Aqui mismo llenamos las variables categories y tags
        el._embedded["wp:term"][0].forEach(el => categories += `<li>${el.name}</li>`);
        el._embedded["wp:term"][1].forEach(el => tags += `<li>${el.name}</li>`);         // abajo ya nada mas las metemos a sus divs para imprimir
        
        //Validamos que si existe una imgaegn, me la muestre y si no existe imagen en 'wp:featuredmedia' mostramos otra cosa
        // igual asi se puede validar todo lo demas categorias, etiquetas etc...
        $template.querySelector("img").src = el._embedded["wp:featuredmedia"] ? el._embedded["wp:featuredmedia"][0].source_url :"";                // en el Array ["wp:featuredmedia"] en la posicion [0]
        
        $template.querySelector(".post-title").innerHTML = el.title.rendered;
        $template.querySelector(".post-author").innerHTML = `
          <img src="${el._embedded.author[0].avatar_urls["48"]}" alt="${el._embedded.author["0"].name}"> 
          <figcaption>${el._embedded.author["0"].name}</figcaption>`;
        $template.querySelector(".post-date").innerHTML = new Date(el.date).toLocaleString();
        $template.querySelector(".post-link").href = el.link;
        // reemplazo [&hellip;] del texto que me envia wordpress por ...
        $template.querySelector(".post-excerpt").innerHTML = el.excerpt.rendered.replace("[&hellip;]","...");  
        // dentro de _embedd > wp:term la 1ra estan las categorias, la 2da las etiquetas, solo nos traemos el name de las 2
        $template.querySelector(".post-categories").innerHTML = `<p>Categorias:</p>
                                                                  <ul>${categories}</ul>`;   
        $template.querySelector(".post-tags").innerHTML = `<p>Etiquetas:</p>
                                                            <ul>${tags}</ul>`;   
        // como es demasiada info, por eso la metimos dentro de una etiqueta 'summary'
        $template.querySelector(".post-content > article").innerHTML = el.content.rendered;     // todos los articles dentro de post-content
        let $clone = document.importNode($template, true);
        $fragment.appendChild($clone);

        $posts.appendChild($fragment)//  aqui en lugar de hacer 10 inserciones al DOM hacemos solo esta 1, que es esta dentro del forEach al mismo tiempo que se va cargando 
        $loader.style.display = "none";
      });
      
    })
    .catch(err =>{
      console.log(err);
      let message = err.statusText || "dont worry is a test"        
      $posts.innerHTML = `<p>Errror ${err.status}: ${message} </p>`;
      $loader.style.display = "none";                                   // solo lo ocultamos aqui, ya que esta tarda mas
    })

  }

  
  
  function getScroll(POSTS, page, per_page){
    // Necesitoe el evento scroll
  window.addEventListener("scroll", e=>{
    const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
    //console.log(document.documentElement);            //al ahcer scroll obtengo el documento html
    
    /*scrollTop: es cuantos pixeles me alejo del Top
    clientHeight: es la altura del viewport 'actual' sin hacer scroll
    scrollHeight: es la altura total que me muestra la bara de desplazamiento con o sin scrollear*/
    
    console.log(`${scrollTop} ${clientHeight} ${scrollHeight}`);
    if( (scrollTop + clientHeight) >= scrollHeight ){
     page++;               // debe ponerse antes de getPosts() o al final pero dentro de la funcion getPosts, ya que si se pone despues,primero me mostrara los mismos posts 
                            // del inicio y despues ahora si aumentara page=2 y me traera los siguientes
      console.log('son igual');
      //getPosts();
      
      getPosts(POSTS, page, per_page);        // aqui el evento "scroll" manda a llamar a la funcion getPosts, la funcion padre getScroll 'solo la use para pasarle parametros a la de getPosts'
      
    }
  });
  }
  
  
  
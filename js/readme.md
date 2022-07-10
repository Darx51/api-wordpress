  // los 'namespaces' son los plugins que tiene van a  variar dependiendo el nombre que tenga el sitio al que accederemos para traer info con API

  //contact-form: es formularios de wordpress
  //yoast: es un plugin para SEO de wordpress
  //oembed es un protocolo  que muestra como wp muestra cualquier texto en el DOM
  //wp/v2 : indica con cual version de API de wordpress puedo interactuar
  // routes: son los endpoints a los que la API de wordpress me permite aceder y en algunos poder hacer PUT, GET, POST DELETE
            // los routes pueden variar dependiendo la configuracion y los pluggins que tengan
            //( entre mas pluggins, mas endpoints en routes)
  // timezone_string: es la zona horaria donde esta configurado el sitio

// Independientemente de si los posts han sido posteados o no, nos los traera todos

// https://malvestida.com 
  // https://css-tricks.com/   https://www.mientrastantoenmexico.mx/


// ver cual API tarda mas en cargar para desactivar el loader en la ultima
// Buscar en foros , stack overflow, github etc... siempre que la documentacion de la API no sea clara o algo le haga falta
// o en el peor de los casos llamar a los de soporte o creadores de la documentacion
// como en este caso el parametro '_embed' que no se menciona bien su implmentacion en la misma documentacion
//  igual saber estas consultas en el Array ["wp:featuredmedia"] y en la posicion [0] y tambien estos objetos se mandan llamar con notacion de Array cuando son numeros
// OJOOOOO PONER 'cache:reload' en la cabecera de las peticiones fetch para que se actualice la memoria cache
- MODIFICAREMOS LA API Y LE AGREGAREMOS LOS PARAMETROS para el scroll infinito
  desoues de posts agregamos las variables de la siguiente forma

    /posts?_embed&per_page

      'page' y 'per_page'

// OJOO una publicacion puede tener mas de 1 Author, en nuestron caso solo traeremos la posicion [0]
// aprobechando que el exerpt esta en string, remmplazo los [...] solo por ...
// OJO el SCROLL INFINITO funciona en cualquier API que me traiga resultados que pueda paginar

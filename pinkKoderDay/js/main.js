const showFileName = (fileInput)=>{
	let filename = $(fileInput).val();
	$(fileInput).siblings("label").text(filename)
}

var database = firebase.database();


/*función que permite escuchar cuando exista algún cambio en nuestro catalogo de productos*/
firebase.database().ref('productCatalog/').on('value', function(snapshot) {/*Ponemos en escucha la referencia "productCatalog" de nuestra base de datos*/
    $("#product-wrapper").empty();/*vaciamos el contenedor de nuestros productos*/
    let productCollection = snapshot.val()/*creamos una variable que contenga todo lo que esta en nuestro catálogo de productos*/
    $.each(productCollection, function(key, value) {/*función para iterar dentro de nuestra coleccion de productos obteniendo su llave(key) y su valor(value)*/
        console.log(value.productName)/*imprimimos las propiedades de nuestros productos*/
        console.log(value.productDescription)
        console.log(value.productPrice)
        console.log(value.productImageUrl)
        $("#product-wrapper").append(`/
        	<div class="col-md-6 col-lg-3">
					<div class="card">
						<img class="card-img-top" src="${value.productImageUrl}" alt="Card image cap">
						<div class="card-body">
							<h5 class="card-title">${value.productName}</h5>
							<p class="card-text">${value.productDescription}</p>
							<p class="card-text">"$ "${value.productPrice}</p>
							<a href="#" class="btn btn-primary btn-block">Agregar al carrito</a>
						</div>
					</div>
				</div>
			`)  /*función que crea e inserta cada una de las tarjetas correspondientes a nuestros productos*/
    });
})



const getFormData = ()=> { /*función que extrae los datos de nuestro formulario y guarda un nuevo producto en base de datos*/
    var storageRef = firebase.storage().ref(); /*creamos referencia general a la base de nuestros archivos*/
    var productsRef = storageRef.child('sunglasses.jpg'); /*creamos una referencia para un archivo de muestra*/
    var productImagesRef = storageRef.child('images/sunglasses.jpg'); /*creamos una referencia con la ruta completa donde se almacenará nuestra imagen de muestra*/

    var productImg = $("#product-image").prop("files")[0]; /*obtenemos la imagen de nuestro formulario*/

    let uploadTask = productImagesRef.put(productImg) /*insertamos la imagen obtenida en la referencia que creamos en la parte superior*/
    uploadTask.on('state_changed', (snapshot) => { /*generamos un listener para saber cuando el acrhivo se esta subiendo y cuando termina de subirlo*/
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; /*calculo del porcentaje de subida ("bytesTransferred" y "totalBytes" son variables por defecto de firebase)*/
        console.log('upload is ' + progress + '% done');
    }, (error) => {
        console.log(error) /*aquí pondríamos algún mensaje en caso de que haya un error con la carga del archivo*/
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {/*una vez que el archivo se ha subido, extraemos la url donde se almacenó*/

            let productName = $("#product-name").val()
            let productDescription = $("#product-description").val()
            let productPrice = $("#product-price").val()
            let productObject = { /*creamos el objeto que vamos a subir a nuestra base de datos*/
                productName,
                productDescription,
                productPrice,
                productImageUrl:downloadURL
            }
            console.log(productObject)
            firebase.database().ref('productCatalog/').push(productObject) /*agregamos el objeto a nuestro catálogo en la base de datos*/
        })
    })
}
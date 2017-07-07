
(function () {
// Inicializa Firebase
  var config = {
    apiKey: 'AIzaSyBxq4WmLLL1nJlYOcXcqsma7lfUWCdfnls',
    authDomain: 'mimascota-96843.firebaseapp.com',
    databaseURL: 'https://mimascota-96843.firebaseio.com',
    projectId: 'mimascota-96843',
    storageBucket: 'mimascota-96843.appspot.com',
    messagingSenderId: '192656820079'
  }

  var firebase = require('firebase')
  firebase.initializeApp(config)
  var db = firebase.database()
  var auth = firebase.auth()
  var storage = firebase.storage()
  var storageRef = storage.ref()

  // Sesión form: Obtener los elementos
  var btnLogin = document.getElementById('btnLogin')
  var btnSignup = document.getElementById('btnSignup')
  var btnLogout = document.getElementById('btnLogout')
  var txtEmail = document.getElementById('email')
  var txtContraseña = document.getElementById('contraseña')

  // Formulario form: Obtener los elementos
  var txtUNombre = document.getElementById('UNombre')
  var txtUApellido = document.getElementById('UApellido')
  var txtUCedula = document.getElementById('UCedula')
  var txtUTelefono = document.getElementById('UTelefono')
  var txtPNombre = document.getElementById('PNombre')
  var txtPEdad = document.getElementById('PEdad')
  var txtPHistoria = document.getElementById('PHistoria')
  var txtPAdopcion = document.getElementById('PAdopcion')
  var enviarform = document.getElementById('btn-submit')

  // Mensajes de Mi Toastr ♥
  toastr.options = {
    'closeButton': false,
    'positionClass': 'toast-bottom-right'
  }

  // -------Evento de Login-------
  btnLogin.addEventListener('click', function () {
  // Valores de los campos
    var email = txtEmail.value
    var contraseña = txtContraseña.value
  // Intenta Autenticar

  if (!email) {
  toastr.error('Se requiere un correo');
  txtEmail.focus();
  txtEmail.parentNode.classList.add('is-dirty');
  } else if (!contraseña){
  toastr.error('Se requiere una contraseña');
  txtContraseña.focus();
  txtContraseña.parentNode.classList.add('is-dirty');
  } else {
  // Login
  var promesa = auth.signInWithEmailAndPassword(email, contraseña);
  promesa.then(function(firebaseUser) {
  // Exito

  var uid = firebaseUser.uid;

  var ref = firebase.database().ref("usuario/"+uid);
  ref.once("value").then(function(snapshot) {
  var YaEnvio = snapshot.child("Envio").val();
  console.log(YaEnvio);


  if (YaEnvio)
  {
  window.location = 'ver.html?uid='+uid;

  } else
  {
   window.location = 'formulario.html';
  }
  })



  });
  promesa.catch(function(error) {
  //Error
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === 'auth/wrong-password') {
  toastr.error('Contraseña Incorrecta');
  } else {
  toastr.error('Error:  '+errorMessage);
  }
  console.log(error);

  });
  }
  });

  // -------Evento de Logout-------
  btnLogout.addEventListener("click" , function(){
  auth.signOut();
  toastr.success('Sesión Cerrada');
  document.location.href = 'index.html';


  });

  // -------Evento de Signup-------
  btnSignup.addEventListener("click" , function(){

  // Valores de los campos
  var email = txtEmail.value;
  var contraseña = txtContraseña.value;

  // Verifica Campos
  if (!email) {
  toastr.error('Se requiere un correo');
  txtEmail.focus();
  txtEmail.parentNode.classList.add('is-dirty');
  } else if (!contraseña){
  toastr.error('Se requiere una contraseña');
  txtContraseña.focus();
  txtContraseña.parentNode.classList.add('is-dirty');
  } else {

  // Crea el usuario y asigna su correo y id
  var promesa = auth.createUserWithEmailAndPassword(email, contraseña).then(function(){
  var user = auth.currentUser;
  firebase.database().ref('usuario/'+user.uid).set({

  correo : email,
  Admin : false,
  Clasificado : false,
  Envio : false


  }).catch(function(error) {
  alert(error.code);
  });
  });
  promesa.then(function(firebaseUser) {
  // Exito

  window.location = 'formulario.html';


  });
  promesa.catch(function(error) {
  //Error
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(error);
  toastr.error('Error al crear usuario');
  if(errorCode === 'auth/weak-password'){
  alert('Contraseña debe tener mínimo 6 caracteres');
  } else {
  alert(errorMessage);
  }

  });
  }


  });

  //------Evento Enviar Formulario------

  if (enviarform) {
  enviarform.addEventListener("click" , function(){

  var user = auth.currentUser;
  var UNombre = txtUNombre.value;
  var UApellido = txtUApellido.value;
  var UCedula = txtUCedula.value;
  var UTelefono = txtUTelefono.value;
  var PNombre = txtPNombre.value;
  var PEdad = txtPEdad.value;
  var PHistoria = txtPHistoria.value;
  var PAdopcion = txtPAdopcion.value;

  firebase.database().ref('usuario/'+user.uid).update({

  NombreUsuario : UNombre,
  ApellidoUsuario : UApellido,
  CedulaUsuario : UCedula,
  TelfUsuario : UTelefono,
  Admin : false,
  Clasificado : false,
  Envio : true

  }).catch(function(error) {
  alert(error.code);
  });

  firebase.database().ref('mascota/'+user.uid).set({

  NombreMascota : PNombre,
  EdadMascota : PEdad,
  Historia : PHistoria,
  Adopcion : PAdopcion,
  correo : user.email

  }).catch(function(error) {
  alert(error.code);
  });

  window.location = 'index.html';
  });
  };



  // -------Verificar estado-------
  auth.onAuthStateChanged(function(user) {
  if (user) {

  var uid = user.uid;

  var ref = firebase.database().ref("usuario/"+uid);
  ref.once("value").then(function(snapshot) {
  var EsAdmin = snapshot.child("Admin").val();

  if(EsAdmin)
  {
  $("#btnActualizar").hide();
  $("#btnCalifica").show();
  $("#btnNoCalifica").show();
  $('#t1').show();
  } else
  {
  $("#btnActualizar").show();
  $("#btnCalifica").hide();
  $("#btnNoCalifica").hide();
  $('#t1').hide();


  }
  });


  $('#btnLogout').show();
  console.log(user);
  console.log("Sesión Iniciada:  "+user.email);
  //toastr.success('Sesión Iniciada');

  } else {


  $('#t1').hide();
  $("#btnCalifica").hide();
  $("#btnNoCalifica").hide();
  console.log('sesion no iniciada');

  }
  });

  // -------Guarda la informacion del usuario -------
  var user = firebase.auth().currentUser;
  var name, correo, uid;

  if (user != null) {
  email = user.correo;
  }

  // -------Display del correo -------
  function Correo () {
  var user = firebase.auth().currentUser;
  if (user != null) {
  email = user.correo;
  document.getElementById('correo').innerHTML = correo;;
  }
  }

  //------Storage------

  var uploader = document.getElementById('uploader');
  var fileButton = document.getElementById('fileButton');
  var imagen = 0;

  fileButton.addEventListener('change', function(e) {

  var user = auth.currentUser;
  var file = e.target.files[0];
  var storageRef = firebase.storage().ref().child('Imagenes/' + user.uid+'/'+file.name);
  var task = storageRef.put(file);
  imagen = imagen + 1;



  task.on('state_changed',

  function progress(snapshot){
  var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  uploader.value = percentage;
  },

  function error(err){

  },

  function complete (){

  var url = task.snapshot.downloadURL;

  if (imagen==1) {

  var imagendb = firebase.database().ref('imagenes/'+user.uid).update({

  imagen1 : file.name,
  url1 : url

  }).catch(function(error) {
  alert(error.code);
  });

  } else if (imagen==2) {

  var imagendb = firebase.database().ref('imagenes/'+user.uid).update({

  imagen2 : file.name,
  url2 : url

  }).catch(function(error) {
  alert(error.code);
  });

  } else if (imagen==3) {

  var imagendb = firebase.database().ref('imagenes/'+user.uid).update({

  imagen3 : file.name,
  url3 : url

  }).catch(function(error) {
  alert(error.code);
  });

  imagen = 0;

  }
  }
  )



  });

}());

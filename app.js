const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const usersJson = require('./users.json');

//const kolo2Json = require('./kolo2.json');


const externalUrl = process.env.RENDER_EXTERNAL_URL
const port = externalUrl && process.env.port ? parseInt(process.env.port) : 3000;

var komentarij= [{"id":1,"author":"matekorisnik","email":"matekorisnik@gmail.com","comment":"kad je nova utakmica?"},{"id":2,"author":"vanjakorisnik","email":"vanjakorisnik@gmail.com","comment":"sutra u 6"},{"id":3,"author":"matekorisnik","email":"matekorisnik@gmail.com","comment":"bezveze"}]
var kolo1j=[{"id":"1","name1":"Osijek","name2":"NK Gorica","rez1":2,"rez2":1},{"id":2,"name1":"HNK Šibenik","name2":"Rijeka","rez1":0,"rez2":1},{"id":3,"name1":"Dinamo","name2":"Lokomotiva","rez1":3,"rez2":2},{"id":4,"name1":"NK Varaždin","name2":"Slaven Belupo","rez1":0,"rez2":1},{"id":5,"name1":"NK Istra","name2":"Hajduk","rez1":0,"rez2":2}]
var kolo2j=[{"id":1,"name1":"Dinamo","name2":"NK Gorica","rez1":2,"rez2":1},{"id":2,"name1":"HNK Šibenik","name2":"NK Zadar","rez1":0,"rez2":1},{"id":"3","name1":"NK Dubrovnik","name2":"Lokomotiva","rez1":3,"rez2":2},{"id":4,"name1":"Rijeka","name2":"Slaven Belupo","rez1":0,"rez2":1},{"id":5,"name1":"NK Varaždin","name2":"Hajduk","rez1":0,"rez2":2}]
require('dotenv').config();

const { auth, requiresAuth } = require('express-openid-connect');
app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: externalUrl || process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
  })
);

app.use( bodyParser.json() );      
    app.use(bodyParser.urlencoded({    
        extended: true
    })
)

app.set('view cache', false);
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))
app.use('/css',express.static(__dirname+'public/css'))
app.use('/js',express.static(__dirname+'public/js'))

app.set('views','./views')
app.set('view engine', 'ejs')

app.get('',(req,res)=>{
  res.render('home',{table:kolo1j,table1:kolo2j})
})

app.get('/log',requiresAuth(),(req,res) =>{
    //res.render('login', {text: 'logiran isssss'})
   // res.send(req.oidc.isAuthenticated() ? 'Loggedin':'Logged out')
    var userEmailJson = JSON.stringify(req.oidc.user)
    const userEmailP = JSON.parse(userEmailJson)
    const userEmail = userEmailP.email

    res.render('login',{table:kolo1j,table1:kolo2j,komentariOsoba:komentarij,currentUser:userEmail})
    
    
})



app.get('/addUtakmica',(req,res)=>{
  var userEmailJson = JSON.stringify(req.oidc.user)
    const userEmailP = JSON.parse(userEmailJson)
    const userEmail = userEmailP.email
  res.render('addUtakmica',{table:kolo1j,table1:kolo2j,komentariOsoba:komentarij,currentUser:userEmail})
})

app.post('/addUtakmica',(req,res)=>{
  const tim1=String(req.body.tim1)
  const tim2 = String(req.body.tim2)
  const bodovi1 = Number(req.body.bodovi1)
  const bodovi2 = Number(req.body.bodovi2)
  const noviId = kolo2j.length+1
  //const fs = require("fs");
  var obj = {
    id:noviId,
    name1:tim1,
    name2:tim2,
    rez1:bodovi1,
    rez2:bodovi2
  }
  //let kola1Json = fs.readFileSync("kolo2.json","utf-8");
  //let kolaa = JSON.parse(kola1Json);
  kolo2j[kolo2j.length]=obj
  //kola1Json = JSON.stringify(kolaa);
  //fs.writeFileSync("kolo2.json",kola1Json,"utf-8");

  res.redirect('back');


})

app.get('/addUtakmica1',(req,res)=>{
  var userEmailJson = JSON.stringify(req.oidc.user)
    const userEmailP = JSON.parse(userEmailJson)
    const userEmail = userEmailP.email
  res.render('addUtakmica',{table:kolo1j,table1:kolo2j,komentariOsoba:komentarij,currentUser:userEmail})
})

app.post('/addUtakmica1',(req,res)=>{
  const tim1=String(req.body.tim1)
  const tim2 = String(req.body.tim2)
  const bodovi1 = Number(req.body.bodovi1)
  const bodovi2 = Number(req.body.bodovi2)
  const noviId = kolo1j.length+1
  //const fs = require("fs");
  var obj = {
    id:noviId,
    name1:tim1,
    name2:tim2,
    rez1:bodovi1,
    rez2:bodovi2
  }
  //let kola1Json = fs.readFileSync("kolo1.json","utf-8");
  //let kolaa = JSON.parse(kola1Json);
  kolo1j[kolo1j.length]=obj
  //kola1Json = JSON.stringify(kolaa);
  //fs.writeFileSync("kolo1.json",kola1Json,"utf-8");

  res.redirect('back');


})



app.get('/comment',requiresAuth(),(req,res)=>{
    var userEmailJson = JSON.stringify(req.oidc.user)
    const userEmailP = JSON.parse(userEmailJson)
    const userEmail = userEmailP.email
    const username=userEmailP.nickname
    const numOfComments=komentarij.length
    res.render('comment', {currentUser:userEmail,username:username,numOfComments:numOfComments})
})

app.post('/comment', (req,res)=>{
  var userEmailJson = JSON.stringify(req.oidc.user)
    const userEmailP = JSON.parse(userEmailJson)
    const userEmail = userEmailP.email
    const username=userEmailP.nickname
    const numOfComments=komentarij.length+1;
    const comment=String(req.body.comment);

    var obj = {
      id:numOfComments,
      author:username,
      email:userEmail,
      comment:comment
    }
/*
  const fs = require("fs");
  let commentssJson = fs.readFileSync("komentari.json","utf-8");*/
  
  komentarij[komentarij.length]=obj
  /*comentss=JSON.parse(commentssJson)
  comentss.push(obj)
  commentssJson=JSON.stringify(comentss)
  
  fs.writeFileSync("komentari.json",commentssJson,"utf-8");*/
  
  
  
  //komentariObj.push(obj);
  //komentarij = JSON.stringify(komentariObj);
  //fs.writeFileSync("komentari.json",commentssJson,"utf-8");

  res.redirect('back');

})



app.get('/log/:id',(req,res)=>{
  var userEmailJson = JSON.stringify(req.oidc.user)
    const userEmailP = JSON.parse(userEmailJson)
    const userEmail = userEmailP.email
   // res.redirect('/login')
  res.render('deleteCom',{table:kolo1j,table1:kolo2j,komentariOsoba:komentarij,currentUser:userEmail})
})

app.post('/log/:id/deleteCom', (req,res)=>{
  /*const commentId= req.body.id;
  console.log('brisanjee')
  const fs = require("fs");
  let commentssJson = fs.readFileSync("komentari.json","utf-8");
  let commentss = JSON.parse(commentssJson);
  delete commentss[commentId-1];

  commentssJson = JSON.stringify(commentss);
  fs.writeFileSync("komentari.json",commentssJson,"utf-8");

  res.redirect('back');*/
  var userEmailJson = JSON.stringify(req.oidc.user)
    const userEmailP = JSON.parse(userEmailJson)
    const userEmail = userEmailP.email
  const comid= req.params.id;
  /*
  const fs = require("fs");
  let commentssJson = fs.readFileSync("komentari.json","utf-8");
  let commentss = JSON.parse(commentssJson);
  */
  delete komentarij[comid-1]
  komentarij =komentarij.filter(function (n) { return n.id !== undefined });
/*
  commentssJson = JSON.stringify(commentss);
  fs.writeFileSync("komentari.json",commentssJson,"utf-8");*/
  //res.redirect('/login')
  res.render('deleteCom',{table:kolo1j,table1:kolo2j,komentariOsoba:komentarij,currentUser:userEmail})

})

app.get('/log/:id/editTable1',(req,res)=>{
  var userEmailJson = JSON.stringify(req.oidc.user)
    const userEmailP = JSON.parse(userEmailJson)
    const userEmail = userEmailP.email
  id = req.params.id
  ut = kolo1j[id-1]
  res.render('editTable1',{utakmica:ut,currentUser:userEmail})
})

app.post('/log/:id/editTable1',(req,res)=>{
  idd=req.params.id
  let obj={
    id:req.params.id,
    name1:String(req.body.tim1),
    name2:String(req.body.tim2),
    rez1:Number(req.body.bodovi1),
    rez2:Number(req.body.bodovi2)

  }

  //const fs = require("fs");
  //let kolooJson = fs.readFileSync("kolo1.json","utf-8");

  //k=JSON.parse(kolooJson)
  kolo1j[idd-1]=obj
  //kolooJson=JSON.stringify(k)
  //fs.writeFileSync("kolo1.json",kolooJson,"utf-8");
  res.redirect('back');

})

app.get('/log/:id/editTable2',(req,res)=>{
  var userEmailJson = JSON.stringify(req.oidc.user)
    const userEmailP = JSON.parse(userEmailJson)
    const userEmail = userEmailP.email
  id = req.params.id
  ut = kolo2j[id-1]
  res.render('editTable2',{utakmica:ut,currentUser:userEmail})
})

app.post('/log/:id/editTable2',(req,res)=>{
  idd=req.params.id
  let obj={
    id:req.params.id,
    name1:String(req.body.tim1),
    name2:String(req.body.tim2),
    rez1:Number(req.body.bodovi1),
    rez2:Number(req.body.bodovi2)

  }

  //const fs = require("fs");
  //let kolooJson = fs.readFileSync("kolo2.json","utf-8");

  //k=JSON.parse(kolooJson)
  kolo2j[idd-1]=obj
  //kolooJson=JSON.stringify(k)
  //fs.writeFileSync("kolo2.json",kolooJson,"utf-8");
  res.redirect('back');

})
  

  


if(externalUrl){
  const hostname= '127.0.0.1';
  app.listen(port,hostname, ()=>{
    console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`)
  })
}else{
  app.listen(port,()=>console.info(`Listening on port ${port}`))
}


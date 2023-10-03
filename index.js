import express from "express";
import session from "express-session";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 1800;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res)=>{
    req.session.location = req.session.location || '';
    res.render("home.ejs")
});
app.post('/', (req, res)=>{
    req.session.location = req.body["latitude"]+'_'+req.body["longitude"];
    console.log("[POST] `/`      Current User Location: "+req.session.location);
    res.send({data: 'done'});
})
app.get('/donate', (req, res)=>{
    console.log("[GET] `/donate` Current User Location: "+req.session.location);
    if (req.session.location===''){
        res.render("donate.ejs");
    } else {
        res.render("donate.ejs", {currentLocation: req.session.location});
    }
});

app.post('/donate/submit', (req, res)=>{
    const recievedData = req.body;
    if (recievedData["name"]==='') {
        res.send({error:'Please enter username'});  
    } else if (recievedData["dateOfDonation"]==='') {
        res.send({error:'Please enter date of donation'});  
    } else if (new Date(recievedData['dateOfDonation'])<new Date()) {
        res.send({error:'Please enter valid date of donation'})
    } else if (recievedData["mobileNumber"]==='') {
        res.send({error:'Please enter mobile number'});  
    } else if (recievedData['mobileNumber'].length!==10) {
        res.send({error:'Please enter valid mobile number'});
    } else if (recievedData["position"]==='' || recievedData["position"]["latitude"]==='') {
        res.send({error:'Please enter pickup address'});  
    } else {
        res.send({error:null});
        console.log(req.body);
    }
});
app.get('/about_us', (req, res)=>{
    res.render("about_us.ejs")
});
app.get('/feedback', (req, res)=>{
    res.render("feedback.ejs")
});
app.get('/sign_up', (req, res)=>{
    res.render("sign_up.ejs")
});
app.post('/sign_up',(req, res)=>{
    console.log(req.body);
    res.redirect('/');
});
app.listen(port, ()=>{
    console.log(`Server is starting on port ${port}.`);
});
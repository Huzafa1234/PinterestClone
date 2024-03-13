var express = require('express');
var router = express.Router();
const user=require('./users');
const { use } = require('passport');
const passport = require('passport');
const localStrategy=require('passport-local');
const upload=require('./multer');

passport.use(new localStrategy(user.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('register');
});



router.post('/fileupload', loggedIn,upload.single('image'), async function(req, res, next) {
  
  const user=await user.findOne({
    username:req.session.passport.user
  });
  user.profileImage=req.file.filename;
  await user.save();
  
  res.redirect("/profile");
});


router.post('/register', function(req, res, next) {
  const data= new user({
    username:req.body.username,
    name:req.body.name,
    email:req.body.email,
    contact:req.body.contact,
  

  });
  user.register(data,req.body.password)
  .then(function()
  {
    passport.authenticate('local')(req,res,function()
    {
res.redirect('/profile')
    });
  });
});

router.get('/profile',loggedIn, async function(req, res, next) {
 const data=await user.findOne({
  username:req.session.passport.user
 });
 
  res.render('profile',{data});
});

router.post('/login', passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req, res, next) {
 
});

router.get('/logout', function(req, res, next) {
  if(error)
  {
    return next(error);
  }
  res.redirect('/')
});




function loggedIn(req,res,next)
{
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}

module.exports = router;

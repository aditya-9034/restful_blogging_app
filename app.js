var express=require("express"),
    app=express(),
    mongoose=require("mongoose"),
    bodyParser=require("body-parser"),
    methodOverride=require("method-override"),
    expressSanitizer=require("express-sanitizer");

//APP CONFIG   
var url=process.env.DBURL||"mongodb://localhost/restful_blog_app";
mongoose.Promise=global.Promise;
mongoose.connect(url,{useMongoClient:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE/MODEL CONFIG
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: { type:Date, default:Date.now }
});

var Blog=mongoose.model("Blog",blogSchema);

//RESTFUL ROUTES

app.get("/",function(req,res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
       if(err){
           console.log(err);
       } 
       
       else{
           res.render("index",{blogs:blogs});
       }
    });
    
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});


//CREATE ROUTE
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
    
});

//SHOW ROUTE 
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundPost){
        if(err){
           res.redirect("/blogs");
        }
        else{
           res.render("show",{blog:foundPost}) 
        }
    });
    
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit",{blog:foundBlog});
        }
    });
   
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.redirect("/blogs/"+req.params.id);
       }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.redirect("/blogs");
       }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("SERVER IS RUNNING"); 
});
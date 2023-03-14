const express = require('express');
const router = express.Router();
const userSchema = require('../models/user');

const upload = require("express-fileupload");

const fs = require('fs');


router.use(upload());

//     res.render('index',{title:'home page'});
// });

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.static(__dirname + "/public"));

//add user
router.post('/add',(req,res,next)=>{
  
    const file = req.files.image;
    var filepath = `../uploads/${file.name}`;
    file.mv(`uploads/${file.name}`,(err)=>{
        if (err) {
           
            console.log('err..',err);
        }
       
    })
    const user = new userSchema({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: filepath
    });
    user.save((err)=>{
        if(err){
            console.log('err2..',err);
            res.json({message: err.message,type:'danger'});
        }else{
            req.session.message = {
                type:'success',
                message:'user added successfully'
            };
            res.redirect('/');
        }
    });
    
});
//get users
router.get('/',(req,res,next)=>{
    userSchema.find().exec((err,users)=>{
        if(err){
            res.json({message:err.message});
           
            console.log('err--- ',err)
        }else{
        
            res.render('index',{title:'Home Page',users: users});
        }
    })
});

router.get('/add',(req,res)=>{
    res.render('add_users',{title:'Add user'});
});
//edit user 
router.get('/edit/:id',(req,res)=>{
    let id = req.params.id;
    userSchema.findById(id,(err,user)=>{
        if(err){
            res.redirect('/');
        }else{
            if(user == null){
                res.redirect('/')
            }else{

                res.render('edit_users',{title:'Edit user',user:user});
            }
}
    })
});

//update user
router.post('/update/:id',(req,res)=>{
    let id = req.params.id;
    let newImage= '';

    if(req.files){
        newImage = req.files.image.name;
   var file = req.files.image;
   var filepath = `../uploads/${newImage}`;
   file.mv(`uploads/${newImage}`,(err)=>{
    if (err) {
        
        console.log('err..',err);
    }
    
})
    
    console.log('newimg',newImage);
 
    }else{
        newImage = req.body.old_image;
    }
    let obj = {
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:newImage
    };
    console.log('obj..',obj)
    userSchema.findByIdAndUpdate(id,
        obj
    ,(err,result)=>{
        if(err){
            console.log('err...',err)
            res.json({message: err.message,type:'danger'});
        }else{
            // console.log('result:',result)
            req.session.message = {
            type: 'success',
            message: 'user updated successfully'
            };
           
         res.redirect('/');
          
}
    })
});

//delete user
router.get('/delete/:id',(req,res)=>{
    let id = req.params.id;
    try{

        userSchema.findByIdAndRemove(id, async(err,result)=>{
            if(err){
                res.json({message:err.message});
            }else{
              
                req.session.message = {
                    type:'info',
                    message:'user deleted succesfully'
                };
                res.redirect("/");
            }
        })

  
    }catch(err){
        console.log('catch err',err)
    }
})

module.exports = router;
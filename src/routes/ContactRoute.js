const express = require('express');
const app = express()
const router = express.Router();
const multer = require('multer');
const csv = require('csvtojson');
const ContactModel = require('../models/ContactModel');


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const uploads = multer({storage: storage})


let contactResponse
router.post('/',uploads.single('file'), (req,res)=>{
    csv().fromFile(req.file.path).then((response)=>{
        for(let i=0;i<response.length;i++){
            response[i].user = req.userID
            console.log(req.userID)
        }
        ContactModel.insertMany(response,(err,data)=>{
            if(err){
                res.status(400).json({
                    status:"Failed",
                    Error:err.name,
                    message:err.message
                })
            }else{
                res.status(200).json({
                    status:"Success",
                    message:data
                })
            }
        })
    })
})

router.post('/one', async (req,res)=>{
   try {
    let data = await ContactModel.create({
        name: req.body.name, 
        designation: req.body.designation, 
        company: req.body.company, 
        industry: req.body.industry,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        country: req.body.country, 
        user: req.userID

    })
    res.json({
        data
    })

    
   } catch (error) {
    res.json({
        error
    })
   }
})
router.get('/',async (req,res)=>{
    try {
      const {filter='name' } = req.query
      const allcontact = await ContactModel.find({user:req.userID}).sort(filter)  
      // console.log(allcontact)
      res.json({
          status: 'Success',  
          allcontact
      })
    } catch (error) {
      res.json({
          status: 'Failed',
          messege: error.messege
      })
    }
  })

//get the search contact
router.get('/search/:email',async (req,res)=>{
    try {
      const email = req.params.email
          const allcontact = await ContactModel.find({$and:[{email},{user:req.userID}]})
      res.json({
          status: 'Success',  
          allcontact
      })
    } catch (error) {       
      res.json({
          status: 'Failed',
          messege: error.messege
      })
    }
  })

  //



router.delete('/', async (req,res)=>{
    // console.log(req.body)
    const {selectedContactsIds} = req.body
    if(selectedContactsIds.length){
        try{
            let response = await ContactModel.deleteMany({_id:selectedContactsIds})
            res.status(200).json({
                status:"Success",
                message: "Deleted Contacts",
                response
            })
        }catch(e){
            res.status(400).json({
                status:"Failed",
                message: e.message
            })
        }
    }else{
        res.status(400).json({
            status:"Failed",
            message: "No contacts selected"
        })
    }   
    

})
module.exports = router;

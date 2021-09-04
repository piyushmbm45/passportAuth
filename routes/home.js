const express = require('express')
const router = express()
const ejs = require('ejs')

router.use(express.json());
router.use(express.urlencoded({
    extended: true
}))

router.set('view engine', 'ejs')
router.use(express.static("../public"));



router.get('/',(req,res)=>{
    res.render('home')
})

module.exports = router;
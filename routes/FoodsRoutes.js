const express = require('express');
const router = express.Router();
const FoodsController = require('../controllers/FoodsController');
const multer  = require('multer');
const path = require('path');

// console.log(path.extname());

// ----------- Config multer
const storage  = multer.diskStorage({
    destination: 'public/img/foods/',
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now() + path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test( path.extname(file.originalname).toLowerCase() )
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb('error: Images only');
    }
}

// ------------ Routes
router.post('/create', upload.single('image'), (req, res) => {
    res.send("hoa");
    upload.single('image')(req, res, (err) => {
        console.log("pasa");
        if(err) {
            res.status(201).json({err})
        }
        else {
            res.json({file: req.file});
        }
    });


    /* return res.json({
        fullName: req.body.fullName,
        shortName: req.body.shortName,
        price: req.body.price
    }); */
});

module.exports = router;
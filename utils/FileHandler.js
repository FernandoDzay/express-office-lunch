const multer = require('multer');
const path = require('path');

module.exports = class FileHandler {

    constructor(destination, extAllowed, identifier) {
        this.destination = destination;
        this.extAllowed = extAllowed;
        this.identifier = identifier;
    }

    checkFileType = (file, cb) => {
        const filetypes = this.extAllowed;
        const extname = filetypes.test( path.extname(file.originalname).toLowerCase() );
        const mimetype = filetypes.test(file.mimetype);
    
        if(mimetype && extname) return cb(null, true);
        else cb("image_extension");
    }

    single = () => {
        const checkFileType = this.checkFileType;
        const storage  = multer.diskStorage({
            destination: this.destination,
            filename: function(req, file, cb) { cb(null, `food-${Date.now() + path.extname(file.originalname)}`); }
        });
        const upload = multer({
            storage,
            fileFilter: function(req, file, cb) { checkFileType(file, cb); }
        });
        return upload.single(this.identifier);
    }

}
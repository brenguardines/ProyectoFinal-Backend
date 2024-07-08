const multer = require("multer");

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        let destinationFolder;
        switch (file.fieldname) {
            case "profile":
                destinationFolder = "./src/uploads/profiles";
                break;
            case "products":
                destinationFolder = "./src/uploads/products";
                break;
            case "document":
                destinationFolder = "./src/uploads/documents";
                break;
        }
        cb(null, destinationFolder);
    },
    filename: (request, file, cb) => {
        cb(null, file.originalname); 
    }
})

const upload = multer({storage:storage});

module.exports = upload;
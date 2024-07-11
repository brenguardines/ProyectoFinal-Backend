const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const exphbs = require("express-handlebars").create({}); 
const MongoStore = require("connect-mongo");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const addLogger = require("./middleware/logger.middleware.js");
const app = express();
const config = require("./config/config.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
require("./database.js");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cors());

app.use(cookieParser());
app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: config.mongo_url,
        ttl: 100
    })
}));

app.use(addLogger);

// Configuración de Handlebars
app.engine("handlebars", exphbs.engine); 
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views")); 

// Inicializar passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter); 
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

app.use(express.static(path.join(__dirname, '..', 'frontend-build')));

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'frontend-build', 'index.html'));
});

const httpServer = app.listen(config.puerto, () => {
    console.log(`Listening to port ${config.puerto}`);
});

// Websockets
const SocketManager = require("./sockets/socketManager.js");
new SocketManager(httpServer);

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentation for the App",
            description: "App Web about an Ecommerce of electronic products"
        }
    },
    apis: ["./src/docs/**/*.yaml"]
};

const specs = swaggerJSDoc(swaggerOptions);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

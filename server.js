require("dotenv").config();
const express = require("express"),
    mongoose = require("mongoose"),
    bp = require("body-parser"),
    path = require("path"),
    app = express(),
    compression = require("compression"),
    //parser routes
    parser = require("./server/routes/parser"),
    //functions
    {
        addDefUser,
        setLog,
        CORS
    } = require("./server/services/functions");

// respond with "hello world" when a GET request is made to the homepage
app.use(compression());
app.use(express.json());
app.use(bp.urlencoded({
    extended: false
}));
app.use(CORS);
app.use("/", express.static(path.join(__dirname, "client/dist/")));
app.use("/api/", parser);

mongoose.connect(process.env.MONGODB_PATH, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (err) => {
    setLog(err, "error");
});
db.once("open", () => {
    app.listen(process.env.PORT, () => {
        setLog(`Server Run on http://localhost:${process.env.PORT}`, "log");
        setLog("Connected to DB", "log");
        //run default functions
        addDefUser();
    });
});
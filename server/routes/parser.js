const express = require("express"),
    routes = express.Router(),
    tm = require("./tm"),
    {DBStorage} = require('../services/storage')

const {
    checkURL,
    addPlayer,
    saveColor,
    saveStatus,
    saveLineupStatus,
    LoginIn,
    addUser,
    removeUser,
    userList
} = require("../services/functions");

routes.use("/tm/", tm);

routes.post("/login", async (req, res) => {
    try {
        res.status(200).json(await LoginIn(req.body));
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});
routes.post('/storage', async (req,res)=>{ 
    try{
        // console.log(`req.body`,req.body)
        const dbstorage = new DBStorage(req.body)
        res.status(200).json(await dbstorage.save())
    }catch(e){
        console.log(`error:`,e)
        res.status(500).json({mmessage: e})
    }
})
routes.get('/storage/:user_id', async (req,res)=>{
    try{
        const {user_id} = req.params
        const dbstorage = new DBStorage({user_id})
        res.status(200).json(await dbstorage.get())
    }catch(e){
        console.log(`error:`,e)
        res.status(500).json({mmessage: e})
    }
})

routes.post("/user", async (req, res) => {
    try {
        res.status(200).json(await addUser(req.body));
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});


routes.get("/user", async (req, res) => {
    try {
        res.status(200).json(await userList());
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});
routes.delete("/user/:id", async (req, res) => {
    try {
        res.status(200).json(await removeUser(req.params.id));
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});


routes.post("/parse", async (req, res) => {
    try {
        const {
            url
        } = req.body;
        res.status(200).json(await checkURL(url));
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});

routes.post("/addplayer", async (req, res) => {
    try {
        const {
            url
        } = req.body;
        res.status(200).json(await addPlayer(url));
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});

routes.post("/color/:mathesid/:shirtnumber/:color", async (req, res) => {
    try {
        const {
            mathesid,
            shirtnumber,
            color
        } = req.params;
        res.status(200).json(await saveColor(mathesid, shirtnumber, color));
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});
routes.post(
    "/gamerstatus/:mathesid/:shirtnumber/:statusGamer",
    async (req, res) => {
        try {
            const {
                mathesid,
                shirtnumber,
                statusGamer
            } = req.params;
            res
                .status(200)
                .json(await saveStatus(mathesid, shirtnumber, statusGamer));
        } catch (e) {
            res.status(500).json({
                error: e
            });
        }
    }
);
routes.post(
    "/lineupstatus/:teamsId/:shirtnumber/:lineupStatus",
    async (req, res) => {
        try {
            const {
                teamsId,
                shirtnumber,
                lineupStatus
            } = req.params;
            res
                .status(200)
                .json(await saveLineupStatus(teamsId, shirtnumber, lineupStatus));
        } catch (e) {
            res.status(500).json({
                error: e
            });
        }
    }
);

module.exports = routes;
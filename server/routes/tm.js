const express = require("express"),
    tm = express.Router(),
    path = require("path"),
    fs = require("fs"),
    base64 = require("base-64"),
    //parse transfermarket
    transferMarket = require("../tm/parser"),
    tm_name_Schema = require("../tm/model/teamname"),
    tm_list_Schema = require("../tm/model/teamslist"),
    {
        isEmptyObject,
        setLog
    } = require("../services/functions");

tm.get("/searchTeam/:teamname", async (req, res) => {
    try {
        res
            .status(200)
            .json(
                await transferMarket.searchTeam(
                    base64.decode(base64.decode(req.params.teamname))
                )
            );
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});

tm.get("/checkname/:teamname", async (req, res) => {
    try {
        res.status(200).json(await transferMarket.checkname(req.params.teamname));
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});
tm.get("/list", async (req, res) => {
    try {
        res.status(200).json(await transferMarket.getListPrice());
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});
tm.post("/addtmname", async (req, res) => {
    try {
        res.status(200).json(await transferMarket.add_tm_name(req.body));
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});

tm.get("/clear", async (req, res) => {
    try {
        await transferMarket.clearDB();
        res.status(200).json({
            message: "Transfermarket is cleared"
        });
    } catch (e) {
        setLog(e.message, "error");
        res.status(500).json({
            message: e.message
        });
    }
});

tm.post("/", async (req, res) => {
    try {
        console.log("req.body", req.body);
        const put = await new tm_name_Schema(req.body);
        put.save();
        setLog(put);
        res.status(200).json(put);
    } catch (e) {
        setLog(e.message, "error");
        res.status(500).json({
            message: e.message
        });
    }
});
tm.get("/", async (req, res) => {
    try {
        const find = await tm_name_Schema.find().exec();
        res.status(200).json(find);
    } catch (e) {
        setLog(e.message, "error");
        res.status(500).json({
            message: e.message
        });
    }
});
tm.delete("/:id", async (req, res) => {
    try {
        // const find = await tm_name_Schema() //TODO
        const deleted = await tm_name_Schema
            .findByIdAndRemove(req.params.id)
            .exec();
        setLog(deleted);
        res.status(200).json(deleted);
    } catch (e) {
        setLog(e.message, "error");
        res.status(500).json({
            message: e.message
        });
    }
});

tm.get("/delete", async (req, res) => {
    try {
        const teamname = new tm_name_Schema();
        const result_teamname = await teamname.collection.drop();
        const teamlist = new tm_list_Schema();
        const result_teamlist = await teamlist.collection.drop();
        res.status(200).json({
            backup: "file",
            result: {
                teamname: result_teamname,
                teamlist: result_teamlist
            },
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});
tm.get("/backup", async (req, res) => {
    try {
        const message = await transferMarket.backUpFileCreate();
        res.status(200).json({
            message
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});
tm.get("/update/:id", async (req, res) => {
    try {
        res.status(200).json(await transferMarket.updateTeamById(req.params.id));
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});
tm.get("/added", async (req, res) => {
    try {
        res.status(200).json(await transferMarket.addFromBackup());
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

module.exports = tm;
const cheerio = require("cheerio"),
    axios = require("axios"),
    teamslistSchema = require("./model/teamslist"),
    teamnameSchema = require("./model/teamname"),
    fs = require("fs"),
    path = require("path");

const isEmptyObject = (object) => {
    if (object === null || object === undefined) {
        return true;
    } else {
        if (Object.entries(object).length === 0) {
            return true;
        } else {
            return false;
        }
    }
};
const setLog = async (message, type = "log") => {
    console[type](message);
};

const backUpFileCreate = async () => {
    try {
        const backup_list = await teamslistSchema.find().exec();
        const backup_name = await teamnameSchema.find().exec();
        const writeFiles = async (name, list) => {
            await fs.writeFileSync(
                path.join(__dirname, "../tm/tm_name.json"),
                JSON.stringify(name)
            );
            await fs.writeFileSync(
                path.join(__dirname, "../tm/tm_list.json"),
                JSON.stringify(list)
            );
            return true;
        };
        return !isEmptyObject(backup_list) && !isEmptyObject(backup_name) ?
            (await writeFiles(backup_name, backup_list)) ?
            "All done" :
            "Can`t write file" :
            "Something wrong";
    } catch (e) {
        throw e;
    }
};
const main_url = "https://www.transfermarkt.com";

//отчистка БД
const clearDB = async () => {
    try {
        const teamslist = new teamslistSchema();
        await ligalist.collection.drop();
        await teamslist.collection.drop();
        setLog("DB Cleared", "log");
    } catch (e) {
        setLog("DB is empty", "error");
    }
};

//парсинг состава
const getSquad = async (teamObj) => {
    try {
        const URL = `${main_url}${teamObj.href}`;
        setLog("    team squad URL: " + URL);
        const {
            data
        } = await axios.get(encodeURI(URL));
        const $ = cheerio.load(data);
        const Path_list = "#yw1 > table > tbody  tr";
        const Path_number = "td:nth-child(1) > div.rn_nummer";
        const Path_name =
            "td:nth-child(2) > table > tbody > tr:nth-child(1) > td.hauptlink > div:nth-child(1) > span a";
        const Path_bday = "td:nth-child(4)";
        const Path_price = "td:nth-child(6)";
        const getListInfo = () => {
            const arr = [];
            // const reg_bday = /(\w+)\s([\d]{1,2}),\s([\d]{2,4})/
            const list = $(Path_list);
            $(list).each((i, row) => {
                let number = $(row).find(Path_number).text();
                const name = $(row).find(Path_name).text();
                const href = $(row).find(Path_name).attr("href");
                const bday = $(row).find(Path_bday).text();
                const price = $(row).find(Path_price).text().trim();
                if (
                    !isEmptyObject(number) &&
                    !isEmptyObject(name) &&
                    !isEmptyObject(price)
                ) {
                    if (number === "-") {
                        number = 0;
                    }
                    arr.push({
                        number: Number(number),
                        name,
                        href,
                        bday,
                        price,
                    });
                }
            });
            return arr;
        };
        const result = await getListInfo();
        return result;
    } catch (e) {
        throw e.message;
    }
};
const getSquadByHTML = async (HTML) => {
    try {
        const $ = cheerio.load(HTML);
        const Path_list = "#yw1 > table > tbody  tr";
        const Path_number = "td:nth-child(1) > div.rn_nummer";
        const Path_name =
            "td:nth-child(2) > table > tbody > tr:nth-child(1) > td.hauptlink > div:nth-child(1) > span a";
        const Path_bday = "td:nth-child(4)";
        const Path_price = "td:nth-child(6)";
        const getListInfo = () => {
            const arr = [];
            // const reg_bday = /(\w+)\s([\d]{1,2}),\s([\d]{2,4})/
            const list = $(Path_list);
            $(list).each((i, row) => {
                let number = $(row).find(Path_number).text();
                const name = $(row).find(Path_name).text();
                const href = $(row).find(Path_name).attr("href");
                const bday = $(row).find(Path_bday).text();
                const price = $(row).find(Path_price).text().trim();
                if (
                    !isEmptyObject(number) &&
                    !isEmptyObject(name) &&
                    !isEmptyObject(price)
                ) {
                    if (number === "-") {
                        number = 0;
                    }
                    arr.push({
                        number: Number(number),
                        name,
                        href,
                        bday,
                        price,
                    });
                }
            });
            return arr;
        };
        const result = await getListInfo();
        return result;
    } catch (e) {
        throw e.message;
    }
};

//парсинг команды
const getTeamName = async (name) => {
    const list = await teamnameSchema
        .find({
            soccerway: new RegExp(name, "i")
        })
        .exec();
    if (!isEmptyObject(list)) {
        const result = [];
        list.map((item) => result.push(item.tm_name));
        return result;
    } else {
        return null;
    }
};
// получаем данные команды по имени
const getTeamByName = async (teamName) =>
    await teamslistSchema.findOne({
        name: new RegExp(teamName, "i")
    }).exec();

const checklist = async (teamname) =>
    await teamnameSchema.findOne({
        soccerway: new RegExp(teamName, "i")
    });

const checkname = async (teamname) => {
    const findTeam = await getTeamByName(teamname);
    return !isEmptyObject(findTeam) ?
        findTeam :
        !isEmptyObject(checklist) ?
        searchTeam(teamName) : {
            message: "No team list data"
        };
};
const getListPrice = async () => await teamslistSchema.find().exec();

const add_tm_name = async (obj) => {
    try {
        const add = new teamnameSchema(obj);
        const TM = await add.save();
        return await addTM(TM);
    } catch (e) {
        throw e;
    }
};
//add TM by TM link
const addTM = async (TM) => {
    try {
        const {
            soccerway: name,
            tm_link: URL
        } = TM;
        setLog(`TM Team URL: ${URL}`, "error");
        const {
            data
        } = await axios.get(encodeURI(URL));
        const $ = cheerio.load(data);
        const logo_src = $(
            "#verein_head > div > div.dataHeader.dataExtended > div.dataBild > img"
        ).attr("src");
        const TMVReg = /(€\d+\.\d+.)/gi;
        const total_market_value = $(
                "#verein_head > div > div.dataHeader.dataExtended > div.dataMarktwert > a"
            )
            .text()
            .match(TMVReg)[0];
        const href = URL;
        const squad_list = await getSquadByHTML(data);
        // console.log(total_market_value);
        if (
            !isEmptyObject(href) &&
            !isEmptyObject(name) &&
            !isEmptyObject(total_market_value) &&
            !isEmptyObject(squad_list)
        ) {
            const obj = {
                logo_src,
                total_market_value,
                href,
                name,
                squad_list,
            };
            // console.log("obj", obj);
            const newobj = new teamslistSchema(obj);
            backUpFileCreate();
            return newobj.save();
        }
    } catch (e) {
        throw new Error(`Can't get info by URL`);
    }
};

//search TM info by team
const searchTeam = async (team) => {
    const getingTeamsAndSquads = async (teamname) => {
        const find = await teamslistSchema
            .findOne({
                name: new RegExp(teamname, "ig")
            })
            .exec();
        if (isEmptyObject(find)) {
            const URL = `${main_url}/schnellsuche/ergebnis/schnellsuche?query=${teamname.replace(
        /\s|\s+/gim,
        "+"
      )}&x=0&y=0`;
            try {
                setLog(`TM search Team URL: ${URL}`, "error");
                const {
                    data
                } = await axios.get(encodeURI(URL));
                const $ = cheerio.load(data);
                const search_list = $("#yw0 > table > tbody  tr");
                const list = (search_list) =>
                    new Promise((resolve, reject) => {
                        if (search_list.length > 0) {
                            $(search_list).each(async (index, item) => {
                                const name = $(item)
                                    .find(
                                        "td:nth-child(2) > table > tbody > tr:nth-child(1) > td > a"
                                    )
                                    .text();
                                if (name === teamname) {
                                    const logo_src = $(item)
                                        .find("td.zentriert.suche-vereinswappen > img")
                                        .attr("src");
                                    const total_market_value = $(item).find("td.rechts").text();
                                    const squad = $(item).find("td:nth-child(4) > a").text();
                                    const href = $(item)
                                        .find(
                                            "td:nth-child(2) > table > tbody > tr:nth-child(1) > td > a"
                                        )
                                        .attr("href");
                                    const name = teamname;
                                    const squad_list = await getSquad({
                                        href
                                    });
                                    if (
                                        !isEmptyObject(href) &&
                                        !isEmptyObject(name) &&
                                        !isEmptyObject(total_market_value) &&
                                        !isEmptyObject(squad_list)
                                    ) {
                                        const obj = {
                                            logo_src,
                                            total_market_value,
                                            squad,
                                            href,
                                            name,
                                            squad_list,
                                        };
                                        // console.log('obj',obj)
                                        const newobj = new teamslistSchema(obj);
                                        resolve(newobj.save());
                                    }
                                }
                            });
                        } else {
                            resolve();
                        }
                    });
                return await list(search_list);
            } catch (e) {
                throw new Error(`Can't get info by URL`);
            }
        } else {
            return find;
        }
    };

    try {
        const NameList = await getTeamName(team);
        if (!isEmptyObject(NameList)) {
            let res = {};
            for (const teamname of NameList) {
                res = await getingTeamsAndSquads(teamname);
            }
            if (typeof res === "object" && typeof res !== "boolean") {
                return res;
            }
        } else {
            return await getingTeamsAndSquads(team);
        }
    } catch (e) {
        throw {
            message: e
        };
    }
};

const addFromBackup = async () => {
    try {
        const result = {};
        const readFile = async (fileName) =>
            await fs.readFileSync(path.join(__dirname, fileName), "UTF-8");
        const namesList = JSON.parse(await readFile("../tm/tm_name.json"));
        const listsList = JSON.parse(await readFile("../tm/tm_list.json"));
        const AddNames = async (Names) =>
            await new Promise(async (resole) => {
                const arr = [];
                for (const line of Names) {
                    const teamname = new teamnameSchema({
                        ...line
                    });
                    arr.push(await teamname.save());
                }
                resole(arr);
            });

        const AddList = (lists) => {
            for (const line of lists) {
                const teamname = new teamslistSchema({
                    ...line
                });
                teamname.save();
            }
            return true;
        };
        result.namesList = await AddNames(namesList);
        result.listsList = await AddList(listsList);
        console.log(result);
        return result.namesList;
    } catch (e) {
        throw e;
    }

    // async (err, content) => {
    //     if (err) res.status(500).json({ message: "error: " + err });
    //     const lists = JSON.parse(content,true);
    //     const AddedData = (lists) =>
    //       new Promise((resolve) => {
    //         let arr = [];
    //         for (const line of lists) {
    //           const teamname = new tm_name_Schema({
    //             soccerway: line.soccerway,
    //             tm_name: line.tm_name,
    //           });
    //           teamname.save();
    //           arr.push({ soccerway: line.soccerway, tm_name: line.tm_name });
    //         }
    //         resolve(arr);
    //       });
    //       const result = await AddedData(lists);
    //       res.status(200).json(result);
};

const updateTeamById = async (id) => {
    try {
        const updateLinks = await teamnameSchema.findById(id).exec();
        await teamslistSchema.deleteOne({
            name: updateLinks.soccerway
        }).exec();
        return await addTM(updateLinks);
    } catch (e) {
        throw {
            message: e.message
        };
    }
};

module.exports = {
    clearDB,
    getTeamByName,
    searchTeam,
    checkname,
    add_tm_name,
    backUpFileCreate,
    addFromBackup,
    updateTeamById,
    getListPrice
};
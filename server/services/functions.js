const cheerio = require("cheerio"),
    axios = require("axios"),
    base64 = require("base-64");

//model for work with a DB
const teamsSchema = require("../model/teams"),
    usersSchema = require("../model/users");
const SITE_URL = "https://int.soccerway.com";

const tm = require("../tm/parser");
const teamname = require("../tm/model/teamname");

//start functionality
//check object to empty or not
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
//CORS fir browsers
const CORS = (req, res, next) => {
    // middelware to add header CROS to all querys
    res.append("Access-Control-Allow-Origin", ["*"]); //All site/address allow
    res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE"); // That method we allow
    res.append("Access-Control-Allow-Headers", "Content-Type");
    next();
};
//setlog
const setLog = async (message, type = "log") => {
    console[type](message);
};
const hash = (email, password) => base64.encode(
    email.trim().toLowerCase() + password
);
//add default user to DB
const addDefUser = async () => {
    try {
        const find = await usersSchema.find({}).exec();
        if (isEmptyObject(find)) {
            const users = [{
                    email: "dron84@gmail.com",
                    password: hash("dron84@gmail.com", "And3rd242258"),
                    premission: 'admin'
                },
                {
                    email: "gomersimpson909090@gmail.com",
                    password: hash("gomersimpson909090@gmail.com", "gomersimpson2019"),
                    premission: 'admin'
                },
            ];
            users.forEach(async (row) => {
                await addUser(row)
                setLog(`Users added: ${row.email}`, "log");
            });
        } else {
            setLog("Users already added", "log");
        }
    } catch (e) {
        setLog(`User not added: ${e.message}`, "error");
    }
};

const addUser = async (newUserObj) => {
    try {
        const {
            email,
            password,
            premission
        } = newUserObj
        const passhash = hash(email, password)
        const create = new usersSchema({
            email,
            password: passhash,
            premission
        });
        return create.save();
    } catch (e) {
        throw e.message
    }
}
const removeUser = async (id) => await usersSchema.deleteOne({
    _id: id
}).exec()

const userList = async () => await usersSchema.find().exec()

//login route functionality
const LoginIn = async (UserInfo) => {
    const daysCookie = 14;
    const info = await usersSchema
        .findOne({
            email: UserInfo.email.trim().toLowerCase(),
        })
        .exec();
    if (!isEmptyObject(info)) {
        if (hash(UserInfo.email, base64.decode(UserInfo.password)) === info.password) {
            const nowtime = Number((+new Date() / 1000).toFixed(0));
            const exptime = nowtime + daysCookie * (3600 * 24);
            info.password = 'FuckOFF'
            return {
                token: base64.encode(
                    base64.encode(
                        JSON.stringify({
                            email: info.email,
                            premission: info.premission,
                            exptime
                        })
                    )
                ),
            };
        } else {
            return {
                message: "Данные не корректны",
            };
        }
    } else {
        return {
            message: "Такой пользователь не найден",
        };
    }
};

//color change

const saveColor = async (mathesid, shirtnumber, COLOR) => {
    const row = await teamsSchema.findById(mathesid).exec();
    row.squad.forEach((item) => {
        if (item.shirtnumber == shirtnumber) {
            item[COLOR] = !item[COLOR];
        }
    });
    return row.save();
};
const saveStatus = async (mathesid, shirtnumber, status) => {
    const row = await teamsSchema.findById(mathesid).exec();
    row.squad.forEach((item) => {
        if (item.shirtnumber == shirtnumber) {
            item.gamerStatus = status;
        }
    });
    return {
        allData: await row.save(),
        gamerStatus: status,
    };
};

const saveLineupStatus = async (teamsId, shirtnumber, lineupStatus) => {
    const row = await teamsSchema.findById(teamsId).exec();
    row.squad.forEach((item) => {
        if (item.shirtnumber == shirtnumber) {
            item.LU = lineupStatus;
        }
    });
    return {
        allData: await row.save(),
        LU: lineupStatus,
    };
};

//Проверка URL на соответсвие матчу или команде --- check url from match or team
const checkURL = async (URL) => {
    const regMatches = /int\.soccerway\.com\/matches\//gi;
    const regTeams = /int\.soccerway\.com\/teams\//gi;
    if (regTeams.test(URL)) {
        return await teamParse(URL);
    } else if (regMatches.test(URL)) {
        return await matchTeamsLink(URL);
    } else {
        throw new Error("Bad URL");
    }
};

//парсинг сокервея ниже --- parse soccerway below
//получение информации о командах  --- get teams info in match
const matchTeamsLink = async (URL) => {
    try {
        // console.log(encodeURI(URL));
        const {
            data
        } = await axios.get(encodeURI(URL));
        const $ = cheerio.load(data);
        const competition = $(
            "#page_match_1_block_match_info_5 > div > div > div.details > a:nth-child(3)"
        ).text();
        const linkA = $(
            "#page_match_1_block_match_info_5 > div > div > div.container.left a.team-title"
        ).attr("href");
        const linkB = $(
            "#page_match_1_block_match_info_5 > div > div > div.container.right a.team-title"
        ).attr("href");
        // console.log("linkA", linkA);
        // console.log("linkB", linkB);
        const teamA = teamParse(SITE_URL + linkA);
        const teamB = teamParse(SITE_URL + linkB);
        const all = await Promise.all([teamA, teamB]);
        return {
            teamA: all[0],
            teamB: all[1],
            competition,
        };
    } catch (e) {
        throw new Error("Can`t get match");
    }
};

//Парсинг страницы команды без сохранения в БД --- getting team info without save in DB
const teamParse = async (URL) => {
    setLog(`URL: ${URL}`, "log");
    try {
        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();
        // await page.goto();
        // await page.click("#page_team_1_block_team_squad_8_1_2");
        const {
            data
        } = await axios.get(encodeURI(URL));
        // const data = await page.content();
        const main = await mainData(data);
        // console.log("main", main);
        const matches = await lastMatch(data, main.name);
        // console.log("matches", matches);
        const squad = await getSquad(encodeURI(`${URL}squad/`));
        // console.log("squad", squad);
        const obj = {
            _id: main.name.replace(/\s/, "_").toLowerCase(),
            matches,
            squad,
            ...main,
            href: URL,
        };
        // console.log("obj", obj);
        return obj;
    } catch (e) {
        throw new Error("Can`t parse");
    }
};
//Отбор главных данных --- filter main data
const mainData = (html) => {
    const $ = cheerio.load(html);
    const name = $("#team_id_selector option[selected='selected']").text();
    const offsite = $("#page_team_1_block_team_info_3 > div > p > a").attr(
        "href"
    );
    const img_href = $(
        "#page_team_1_block_team_info_3 > div > div.logo > img"
    ).attr("src");
    const country = $(
        "#page_team_1_block_team_info_3 > div > div.clearfix > dl > dd:nth-child(6)"
    ).text();
    // console.log({ name, offsite, img_href, country });
    return {
        name,
        offsite,
        img_href,
        country,
    };
};
//отбор Прошедших матчей --- filter last matches
const lastMatch = async (html, TEAM_NAME) => {
    const $ = cheerio.load(html);
    const teamsData = () =>
        new Promise((resolve) => {
            let arr = [];
            let rows = $("table.matches tbody tr");
            $(rows).each((i, row) => {
                let date = $(row).find("td.full-date").text();
                let teamA = $(row).find("td.team-a").text().trim();
                let teamB = $(row).find("td.team-b").text().trim();
                let competition = {
                    title: $(row).find("td.competition a").attr("title"),
                    name: $(row).find("td.competition a").text(),
                };
                let score = $(row).find("td.score-time.score a").text().trim();
                let linuplink = $(row).find("td.score-time.score a").attr("href");
                const reg = /([\d]{1,2})\s-\s([\d]{1,2})/;
                if (reg.test(score)) {
                    arr.push({
                        date,
                        teamA,
                        teamB,
                        score,
                        linuplink,
                        competition,
                    });
                }
            });
            resolve(arr);
        });
    try {
        const teams = await teamsData();
        const EndData = [];
        for (const team of teams) {
            // console.log('team',team)
            const Squad = await getMatchesTeamSquad(
                SITE_URL + team.linuplink,
                TEAM_NAME
            );
            EndData.push({
                teamData: team,
                squad: Squad,
            });
        }
        return EndData;
    } catch (e) {
        setLog("tut erre " + e, "error");
    }
};
//получение состава --- get team squad
const getSquad = async (URL) => {
    try {
        console.log("URL", URL);
        const {
            data
        } = await axios.get(URL);
        let $ = cheerio.load(data);
        let stable = [];
        const table = $("table.table.squad tbody tr");
        $(table).each((i, row) => {
            stable.push({
                shirtnumber: $(row).find(".shirtnumber").text(),
                name: $(row).find(".name.large-link").text(),
                flag: $(row).find(".flag span").attr("class"),
                age: $(row).find(".number.age").text(),
                position: $(row).find("td.position span").text(),
                "game-minutes": $(row).find("td.game-minutes").text(),
                appearances: $(row).find("td.appearances").text(),
                lineups: $(row).find("td.lineups").text(),
                "subs-on-bench": $(row).find("td.subs-on-bench").text(),
                goals: $(row).find("td.goals").text(),
                assists: $(row).find("td.assists").text(),
                "yellow-cards": $(row).find("td.yellow-cards").text(),
                "2nd-yellow-cards": $(row).find("td.2nd-yellow-cards").text(),
                "red-cards": $(row).find("td.red-cards").text(),
                blue: false,
                lightblue: false,
                black: false,
            });
        });
        return stable;
    } catch (e) {
        throw new Error("Can`t find squad");
    }
};

//получение информации с матча
const getMatchesTeamSquad = async (link, TEAM_NAME) => {
    const {
        data
    } = await axios.get(encodeURI(link));
    const match = cheerio.load(data);
    const tA = match(
        "#page_match_1_block_match_info_5 > div > div > div.container.left > a.team-title"
        // "#page_match_1_block_match_info_5 > div:nth-child(1) > div.container.left > h3 > a"
    ).text();
    const tB = match(
        "#page_match_1_block_match_info_5 > div > div > div.container.right > a.team-title"
        // "#page_match_1_block_match_info_5 > div:nth-child(1) > div.container.right > h3 > a"
    ).text();

    const getMatchSquad = (team) => {
        const matcheSqaud = [];
        const match_rows = match(
            `.container.${team} table.playerstats.lineups.table tbody tr`
        );
        match_rows.each((i, match_row) => {
            let shirtnumber =
                match(match_row).find("td.shirtnumber").text().trim() || 0;
            let flag = match(match_row).find("td.player.large-link a").attr("class");
            let name = match(match_row).find("td.player.large-link a").text().trim();
            if (name != "") {
                matcheSqaud.push({
                    shirtnumber: shirtnumber,
                    flag: flag,
                    name: name,
                    squad: "squad",
                });
            }
        });
        const substitution_rows = match(
            `.container.${team} table.playerstats.lineups.substitutions.table tbody tr`
        );
        substitution_rows.each((i, match_row) => {
            let shirtnumber =
                match(match_row).find("td.shirtnumber").text().trim() || 0;
            let flag = match(match_row)
                .find("td.player.large-link p:nth-child(1) a")
                .attr("class");
            let name = match(match_row)
                .find("td.player.large-link p:nth-child(1) a")
                .text()
                .trim();
            if (name != "") {
                matcheSqaud.push({
                    shirtnumber: shirtnumber,
                    flag: flag,
                    name: name,
                    squad: "substitution",
                });
            }
        });
        return matcheSqaud;
    };

    if (TEAM_NAME === tA) {
        return getMatchSquad("left");
    } else if (TEAM_NAME === tB) {
        return getMatchSquad("right");
    }
};
//end soccerway

const addPlayer = async (url) => {
    try {
        const {
            data
        } = await axios.get(encodeURI(url));
        const $ = cheerio.load(data);
        const player = {
            name: `${$("#subheading > h1").text()}`,
            flag: $(
                "#page_player_1_block_player_career_6_table > tbody > tr:nth-child(1) > td.competition > span"
            ).attr("class"),
            age: $(
                "#page_player_1_block_player_passport_3 > div > div > div.yui-u.first > div > dl > dd:nth-child(10)"
            ).text(),
            position: $(
                    "#page_player_1_block_player_passport_3 > div > div > div.yui-u.first > div > dl > dd:nth-child(16)"
                )
                .text()
                .slice(0, 1),
        };
        const matches = [];
        const mathcesData = $("table.playerstats > tbody tr");
        $(mathcesData).each((index, row) => {
            matches.push({
                season: $(row).find("td.season > a").text(),
                team: $(row).find("td.team > a").text(),
                "game-minutes": Number(
                    $(row).find("td.number.statistic.game-minutes.available").text()
                ),
                appearances: Number(
                    $(row).find("td.number.statistic.appearances.available").text()
                ),
                lineups: Number(
                    $(row).find("td.number.statistic.lineups.available").text()
                ),
                "subs-on-bench": Number(
                    $(row).find("td.number.statistic.subs-on-bench.available").text()
                ),
                goals: Number(
                    $(row).find("td.number.statistic.goals.available").text()
                ),

                "yellow-cards": Number(
                    $(row).find("td.number.statistic.yellow-cards.available").text()
                ),
                "2nd-yellow-cards": Number(
                    $(row).find("td.number.statistic.2nd-yellow-cards.available").text()
                ),
                "red-cards": Number(
                    $(row).find("td.number.statistic.red-cards.available").text()
                ),
                blue: false,
                lightblue: false,
                black: false,
                gamerStatus: null,
                LU: null,
                UPS: "none",
            });
        });
        return {
            player,
            matches,
        };
    } catch (e) {
        throw e;
    }
};

module.exports = {
    isEmptyObject,
    setLog,
    LoginIn,
    CORS,
    checkURL,
    addDefUser,
    saveColor,
    saveStatus,
    saveLineupStatus,
    addPlayer,
    addUser,
    userList,
    removeUser
};
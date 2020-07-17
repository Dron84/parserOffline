import Vue from "vue";
import Vuex from "vuex";
import $axios from "../router/axios";
import base64 from "base-64";
import $cookie from 'vue-cookie';

const isEmptyObject = (object) => {
    return object === null || object === undefined ? true : Object.entries(object).length === 0 ? true : false;
};

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        match: {
            competition: "",
            teamA: {},
            teamB: {},
        },
        price: [],
        preloader: false,
        savedMatches: [],
        matchCount: "3",
    },
    mutations: {
        async SET_TEAM(state, obj) {
            // console.log("obj", obj);
            state.match[obj.team] = obj.data;
            if (obj.data !== {}) {
                state.match[obj.team].squad = obj.data.squad.sort(
                    (a, b) => b["game-minutes"] - a["game-minutes"]
                );
            }
        },
        async SET_MATCH(state, obj) {
            state.match = obj;
            if (!isEmptyObject(obj.teamA) && !isEmptyObject(obj.teamB)) {
                const squadA = obj.teamA.squad.sort(
                    (a, b) => b["game-minutes"] - a["game-minutes"]
                );
                const squadB = obj.teamB.squad.sort(
                    (a, b) => b["game-minutes"] - a["game-minutes"]
                );
                state.match.teamA.squad = [...squadA];
                state.match.teamB.squad = [...squadB];
            }
        },
        SET_PRICE(state, obj) {
            state.price.push(obj);
            localStorage.setItem("matchPrices", JSON.stringify(state.price));
        },
        SET_PRELOADER(state, val) {
            state.preloader = val;
        },
        SET_SAVED_MATCHES(state, val) {
            state.savedMatches = val;
            localStorage.setItem("savedMatches", JSON.stringify([...val]));
        },
        matchCount(state, val) {
            state.matchCount = val;
        },
        SET_ALL_PRICE(state, val) {
            state.price = val
            localStorage.setItem("matchPrices", JSON.stringify(state.price));
        }
    },
    actions: {
        GET_SAVED_MATCHES_FROM_LOCAL_STORAGE(state) {
            const savedMatch = localStorage.getItem("savedMatches");
            if (!isEmptyObject(savedMatch)) {
                state.commit("SET_SAVED_MATCHES", JSON.parse(savedMatch));
            } else {
                localStorage.setItem("savedMatches", "[]");
            }
        },
        async GET_MATCH_PRICES_FROM_LOCAL_STORAGE(state) {
            const price = JSON.parse(localStorage.getItem("matchPrices"));

            !isEmptyObject(price) ? price.map((item) => state.commit("SET_PRICE", item)) : state.dispatch('GET_SERVER_PRICE')
        },
        async GET_SERVER_PRICE(state) {
            const {
                data
            } = await $axios.get('/tm/list')
            state.commit('SET_ALL_PRICE', data)
        },
        async CHECK_PRICE(state, teamName) {
            const {
                data
            } = await $axios.get(`tm/checkname/${encodeURI(teamName)}`);
            return data;
        },
        async ADD_TM_NAME(state, obj) {
            const {
                data
            } = await $axios.post(`tm/addtmname`, obj);
            return data;
        },
        async PARSE_URL(state, obj) {
            state.commit("SET_PRELOADER", true);
            if (obj.team === "match") {
                const {
                    data
                } = await $axios.post("parse", {
                    url: obj.url
                });
                data.teamA.comment = "";
                data.teamA.addsquad = [];
                data.teamB.comment = "";
                data.teamB.addsquad = [];
                state.commit("SET_PRELOADER", false);
                state.commit("SET_MATCH", data);
                return data;
            } else {
                const team = obj.team;
                const {
                    data
                } = await $axios.post("parse", {
                    url: obj.url
                });
                data.comment = "";
                data.addsquad = [];
                state.commit("SET_PRELOADER", false);
                state.commit("SET_TEAM", {
                    team,
                    data
                });
                return data;
            }
        },
        async GET_SAVED_COLOR(state) {
            const match = state.getters.matches;
            const getBoolean = (stringToBoolean) => {
                if (stringToBoolean === "true") {
                    return true;
                } else {
                    return false;
                }
            };
            const getStorage = (type, teamId, player, color = false) => {
                return color ?
                    localStorage.getItem(
                        `${type}_${teamId}::${player.shirtnumber}::${color}::${player.name}`
                    ) :
                    localStorage.getItem(
                        `${type}_${teamId}::${player.shirtnumber}::${player.name}`
                    );
            };
            const MapSquad = (squad, id) => {
                squad.map((item) => {
                    item.price = localStorage.getItem(`PP_${item.name.toLowerCase().replace(/\s/,'_')}::${item.shirtnumber}`)
                    item.black = getBoolean(getStorage("COLOR", id, item, "black"));
                    item.blue = getBoolean(getStorage("COLOR", id, item, "blue"));
                    item.lightblue = getBoolean(getStorage("COLOR", id, item, "lightblue"));
                    item.LU = getStorage("LU", id, item);
                    item.yellowCardStatus = getBoolean(getStorage('YC', id, item))
                    item.NM = getStorage("NM", id, item);
                    item.gamerStatus = Number(getStorage("gamerStatus", id, item));
                    item.playerStatus = localStorage.getItem(`playerStatus${id}::${item.shirtnumber}::${item.name}`);
                });
            };

            MapSquad(match.teamA.squad, match.teamA._id);
            MapSquad(match.teamA.addsquad, match.teamA._id);
            MapSquad(match.teamB.squad, match.teamB._id);
            MapSquad(match.teamB.addsquad, match.teamB._id);

            state.commit("SET_MATCH", match);
        },
        async CHANGE_PRICE(state, obj) {
            localStorage.setItem(`PP_${obj.player.name.toLowerCase().replace(/\s/,'_')}::${obj.player.shirtnumber}`, obj.newPrice)
        },
        async CLEAR_SAVED_COLOR(state, id) {
            const match = state.getters.matches;
            let team;
            if (match.teamA._id === id) {
                team = match.teamA.squad;
            } else if (match.teamB._id === id) {
                team = match.teamB.squad;
            }
            team.forEach((item) => {
                console.log(item.name);
                localStorage.removeItem(
                    `COLOR_${id}::${item.shirtnumber}::black::${item.name}`
                );
                localStorage.removeItem(
                    `COLOR_${id}::${item.shirtnumber}::blue::${item.name}`
                );
                localStorage.removeItem(
                    `COLOR_${id}::${item.shirtnumber}::lightblue::${item.name}`
                );
            });
        },
        async CLEAR_SAVED_LU(state, id) {
            const match = state.getters.matches;
            let team;
            if (match.teamA._id === id) {
                team = match.teamA.squad;
            } else if (match.teamB._id === id) {
                team = match.teamB.squad;
            }
            team.forEach((item) => {
                localStorage.removeItem(`LU_${id}::${item.shirtnumber}::${item.name}`);
            });
        },
        async CLEAR_SAVED_STATUS(state, id) {
            const match = state.getters.matches;
            let team;
            if (match.teamA._id === id) {
                team = match.teamA.squad;
            } else if (match.teamB._id === id) {
                team = match.teamB.squad;
            }
            team.forEach((item) => {
                localStorage.removeItem(
                    `gamerStatus_${id}::${item.shirtnumber}::${item.name}`
                );
                item.playerStatus = "";
                localStorage.removeItem(
                    `playerStatus_${id}::${item.shirtnumber}::${item.name}`
                );
            });
        },
        async SAVE_PLAYER_STATUS(state, obj) {
            const {
                teamsId,
                id,
                name,
                val
            } = obj;
            console.log('obj', obj)
            localStorage.setItem(`playerStatus${teamsId}::${id}::${name}`, val);
        },
        async SAVE_COLOR(state, obj) {
            const {
                teamsId,
                id,
                color,
                name
            } = obj;
            const CLS = localStorage.getItem(
                `COLOR_${teamsId}::${id}::${color}::${name}`
            );
            const setSorage = (teamsId, id, color, name, val) => {
                localStorage.setItem(`COLOR_${teamsId}::${id}::${color}::${name}`, val);
            };
            let result;
            if (CLS !== null && CLS !== undefined) {
                if (CLS === "true") {
                    setSorage(teamsId, id, color, name, false);
                    result = false;
                } else {
                    setSorage(teamsId, id, color, name, true);
                    result = true;
                }
            } else {
                setSorage(teamsId, id, color, name, true);
                result = true;
            }
            const match = state.getters.matches;

            const team = (team) => {
                team.squad.map((item) => {
                    if (item.shirtnumber === id) {
                        item[color] = result;
                    }
                });
                return team;
            };

            if (teamsId === match.teamA._id) {
                const teamA = {
                    ...match.teamA
                };
                const data = team(teamA);
                state.commit("SET_TEAM", {
                    team: "teamA",
                    data
                });
            } else if (teamsId === match.teamB._id) {
                const teamB = {
                    ...match.teamB
                };
                const data = team(teamB);
                state.commit("SET_TEAM", {
                    team: "teamB",
                    data
                });
            }
        },
        async SAVE_YELLOW_CARD(state, obj) {
            const setSorage = ({
                team,
                data
            }) => {
                localStorage.setItem(`YC_${team._id}::${team.squad[data.index].shirtnumber}::${team.squad[data.index].name}`, obj.data.data);
            };
            setSorage(obj)
        },
        async SAVE_STATUS(state, obj) {
            const {
                teamsId,
                id,
                item_id,
                name
            } = obj;
            localStorage.setItem(`gamerStatus_${teamsId}::${id}::${name}`, item_id);
            const match = state.getters.matches;
            const team = (team) => {
                team.squad.map((item) => {
                    if (item.shirtnumber === id) {
                        item.gamerStatus = item_id;
                    }
                });
                return team;
            };
            if (teamsId === match.teamA._id) {
                const teamA = {
                    ...match.teamA
                };
                const data = team(teamA);
                state.commit("SET_TEAM", {
                    team: "teamA",
                    data
                });
            } else if (teamsId === match.teamB._id) {
                const teamB = {
                    ...match.teamB
                };
                const data = team(teamB);
                state.commit("SET_TEAM", {
                    team: "teamB",
                    data
                });
            }
        },
        async SAVE_LINEUP(state, obj) {
            const {
                shirtnumber,
                teamsId,
                lineupStatus,
                name
            } = obj;
            let status;
            if (lineupStatus === null || lineupStatus === 'null') {
                status = "squad";
            } else if (lineupStatus === "squad") {
                status = "substitutions";
            } else if (lineupStatus === "substitutions") {
                status = null;
            }

            localStorage.setItem(`LU_${teamsId}::${shirtnumber}::${name}`, status);

            const match = state.getters.matches;

            const team = (team) => {
                team.squad.map((item) => {
                    if (item.shirtnumber === shirtnumber) {
                        item.LU = status;
                    }
                });
                return team;
            };

            if (teamsId === match.teamA._id) {
                const teamA = {
                    ...match.teamA
                };
                const data = team(teamA);
                state.commit("SET_TEAM", {
                    team: "teamA",
                    data
                });
            } else if (teamsId === match.teamB._id) {
                const teamB = {
                    ...match.teamB
                };
                const data = team(teamB);
                state.commit("SET_TEAM", {
                    team: "teamB",
                    data
                });
            }
        },
        async SAVE_NEW_MATCH(state, obj) {
            const {
                shirtnumber,
                teamsId,
                matchStatus,
                name
            } = obj;
            let status;
            if (matchStatus === null || matchStatus === 'null') {
                status = "squad";
            } else if (matchStatus === "squad") {
                status = "substitutions";
            } else if (matchStatus === "substitutions") {
                status = null;
            }

            localStorage.setItem(`NM_${teamsId}::${shirtnumber}::${name}`, status);

            const match = state.getters.matches;

            const team = (team) => {
                team.squad.map((item) => {
                    if (item.shirtnumber === shirtnumber) {
                        item.NM = status;
                    }
                });
                return team;
            };

            if (teamsId === match.teamA._id) {
                const teamA = {
                    ...match.teamA
                };
                const data = team(teamA);
                state.commit("SET_TEAM", {
                    team: "teamA",
                    data
                });
            } else if (teamsId === match.teamB._id) {
                const teamB = {
                    ...match.teamB
                };
                const data = team(teamB);
                state.commit("SET_TEAM", {
                    team: "teamB",
                    data
                });
            }
        },
        async GET_PRICE(state, name) {
            return await $axios.get(
                `/tm/searchTeam/${base64.encode(base64.encode(name))}`
            );
        },
        async ADD_SAVED_MATCHES(state, val) {
            if (!isEmptyObject(val.teamA) && !isEmptyObject(val.teamB)) {
                let saved = await state.getters.savedMatches;
                const add = (addVal) => {
                    saved.push({
                        ...addVal
                    });
                    state.commit("SET_SAVED_MATCHES", saved);
                };
                if (saved.length > 0) {
                    const savedFilter = saved.filter((row) =>
                        row.teamA._id === val.teamA._id && row.teamB._id === val.teamB._id ?
                        true :
                        false
                    );
                    if (savedFilter.length === 0) {
                        add(val);
                    }
                } else {
                    add(val);
                }
            }
        },
        async SPLICE_SAVED_MATCHES(state, val) {
            let saved = await state.getters.savedMatches;
            saved.splice(val, 1);
            state.commit("SET_SAVED_MATCHES", saved);
        },
        SET_COMMENT(state, obj) {
            const SM = state.getters.savedMatches;
            SM.forEach((row) => {
                if (
                    row.teamA._id === obj.match.teamA._id &&
                    row.teamB._id === obj.match.teamB._id
                ) {
                    if (row.teamA._id === obj.id) {
                        row.teamA.comment = obj.val;
                    } else if (row.teamB._id === obj.id) {
                        row.teamB.comment = obj.val;
                    }
                }
            });
            state.commit("SET_SAVED_MATCHES", SM);
        },
        REMOVE_PLAYER(state, obj) {
            const {
                teamId,
                player
            } = obj;
            const match = {
                ...state.getters.matches
            };
            const saveMatch = state.getters.savedMatches;
            const splicePlayer = (squad, player) => {
                return squad.filter((item) => item !== player);
            };
            if (match.teamA._id === teamId) {
                const teamA = match.teamA;
                teamA.squad = splicePlayer(match.teamA.squad, player);
                state.commit("SET_TEAM", {
                    team: "teamA",
                    data: teamA,
                });
            } else if (match.teamB._id === teamId) {
                const teamB = match.teamB;
                teamB.squad = splicePlayer(match.teamB.squad, player);
                state.commit("SET_TEAM", {
                    team: "teamB",
                    data: teamB,
                });
            }
            saveMatch.forEach((SM) => {
                if (SM.teamA._id === teamId) {
                    const teamA = SM.teamA;
                    teamA.squad = splicePlayer(teamA.squad, player);
                } else if (SM.teamB._id === teamId) {
                    const teamB = SM.teamB;
                    teamB.squad = splicePlayer(teamB.squad, player);
                }
            });
            state.commit("SET_SAVED_MATCHES", saveMatch);
        },
        REMOVE_ADDED_PLAYER(state, obj) {
            const {
                teamId,
                player
            } = obj;
            const match = {
                ...state.getters.matches
            };
            const saveMatch = state.getters.savedMatches;
            const splicePlayer = (squad, player) => {
                return squad.filter((item) => item !== player);
            };
            if (match.teamA._id === teamId) {
                const teamA = match.teamA;
                teamA.addsquad = splicePlayer(match.teamA.addsquad, player);
                state.commit("SET_TEAM", {
                    team: "teamA",
                    data: teamA,
                });
            } else if (match.teamB._id === teamId) {
                const teamB = match.teamB;
                teamB.addsquad = splicePlayer(match.teamB.addsquad, player);
                state.commit("SET_TEAM", {
                    team: "teamB",
                    data: teamB,
                });
            }
            saveMatch.forEach((SM) => {
                if (SM.teamA._id === teamId) {
                    const teamA = SM.teamA;
                    teamA.addsquad = splicePlayer(teamA.addsquad, player);
                } else if (SM.teamB._id === teamId) {
                    const teamB = SM.teamB;
                    teamB.addsquad = splicePlayer(teamB.addsquad, player);
                }
            });
            state.commit("SET_SAVED_MATCHES", saveMatch);
        },
        async GET_PLAYER_DATA(state, url) {
            return await $axios.post("addplayer", url);
        },
        ADD_PLAYER(state, obj) {
            const match = {
                ...state.getters.matches
            };
            const setTeam = (team, player, matchTeam) => {
                team.addsquad.push({
                    ...player
                });
                state.commit("SET_TEAM", {
                    team: matchTeam,
                    data: team,
                });
            };
            if (match.teamA._id === obj.teamId) {
                setTeam(match.teamA, obj.player, "teamA");
            } else if (match.teamB._id === obj.teamId) {
                setTeam(match.teamB, obj.player, "teamB");
            }
            const saveMatch = state.getters.savedMatches;
            state.commit("SET_SAVED_MATCHES", saveMatch);
        },
    },
    getters: {
        matches(state) {
            return state.match;
        },
        preloader(state) {
            return state.preloader;
        },
        price(state) {
            return state.price;
        },
        savedMatches(state) {
            return state.savedMatches;
        },
        matchCount(state) {
            return state.matchCount;
        },
        premissions(state) {
            return JSON.parse(base64.decode(base64.decode($cookie.get('token')))).premission
        }
    },
});
store.$axios = $axios;

export default store;
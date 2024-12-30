"use strict";

function getGithubAvatar(profile) {
    return `${profile.avatar_url.replace("private-", "").split("?")[0]}?v=4`
}

module.exports = {
    getGithubAvatar
}
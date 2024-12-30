/**
 * @fileoverview Common utils for tools
 * @author Tanuj Kanti
 */

"use strict";

/**
 * Get the avatar link of Github profile images with no additional tokens
 * @param {Object} profile fetched data of Github users
 * @returns {string} Github avatar link
 */
function getGithubAvatar(profile) {
    return `${profile.avatar_url.replace("private-", "").split("?")[0]}?v=4`
}

module.exports = {
    getGithubAvatar
}
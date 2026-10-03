async function getHackerRankProgress(profileUrl) {
    try {
        console.log("\n=================================");
        console.log("Opening:", profileUrl);
        console.log("=================================");

        // Validate HackerRank profile URL
        if (!profileUrl.includes("hackerrank.com/profile/")) {
            return {
                profileUrl,
                success: false,
                error: "Invalid HackerRank profile URL"
            };
        }

        // Extract username
        const usernameMatch =
            profileUrl.match(/\/profile\/([^/?#]+)/);

        const username =
            usernameMatch
                ? usernameMatch[1]
                : "";

        if (!username) {
            return {
                profileUrl,
                success: false,
                error: "Could not extract HackerRank username"
            };
        }

        // HackerRank badge API
        const badgeApiUrl =
            `https://www.hackerrank.com/rest/hackers/${username}/badges`;

        console.log("Calling badge API:");
        console.log(badgeApiUrl);

        const response = await fetch(
            badgeApiUrl,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0",
                    "Accept":
                        "application/json"
                }
            }
        );

        console.log(
            "Badge API status:",
            response.status
        );

        if (!response.ok) {
            return {
                profileUrl,
                username,
                success: false,
                error:
                    `Badge API returned status ${response.status}`
            };
        }

        const badgeData =
            await response.json();

        let cStars = 0;
        let problemsSolved = 0;
        let totalChallenges = 0;

        if (
            badgeData &&
            Array.isArray(
                badgeData.models
            )
        ) {
            const cBadge =
                badgeData.models.find(
                    badge =>
                        badge.badge_type === "c"
                );

            if (cBadge) {
                cStars =
                    cBadge.stars ?? 0;

                problemsSolved =
                    cBadge.solved ?? 0;

                totalChallenges =
                    cBadge.total_challenges ?? 0;
            }
        }

        console.log(
            "\n------------------------------"
        );

        console.log(
            "Username:",
            username
        );

        console.log(
            "C Stars:",
            cStars
        );

        console.log(
            "C Problems Solved:",
            problemsSolved
        );

        console.log(
            "Total C Challenges:",
            totalChallenges
        );

        console.log(
            "------------------------------"
        );

        return {
            profileUrl,
            username,
            cStars,
            problemsSolved,
            totalChallenges,
            success: true
        };

    } catch (error) {

        console.error(
            "Profile error:",
            error.message
        );

        return {
            profileUrl,
            success: false,
            error:
                error.message
        };
    }
}

module.exports = {
    getHackerRankProgress
};
// const { chromium } = require("playwright");

// let browser;
// let context;
// let page;

// async function startBrowser() {
//     if (browser) {
//         return;
//     }

//     browser = await chromium.launch({
//         headless: true
//     });

//     context = await browser.newContext();

//     page = await context.newPage();

//     console.log("Browser started.");
// }

// async function getHackerRankProgress(profileUrl) {
//     try {
//         console.log("\n=================================");
//         console.log("Opening:", profileUrl);
//         console.log("=================================");

//         if (!profileUrl.includes("hackerrank.com/profile/")) {
//             return {
//                 profileUrl,
//                 success: false,
//                 error: "Invalid HackerRank profile URL"
//             };
//         }

//         const usernameMatch =
//             profileUrl.match(/\/profile\/([^/?#]+)/);

//         const username =
//             usernameMatch
//                 ? usernameMatch[1]
//                 : "";

//         if (!username) {
//             return {
//                 profileUrl,
//                 success: false,
//                 error: "Could not extract HackerRank username"
//             };
//         }

//         /*
//          * Directly request HackerRank badge API
//          */
//         const badgeApiUrl =
//             `https://www.hackerrank.com/rest/hackers/${username}/badges`;

//         console.log("Calling badge API:");
//         console.log(badgeApiUrl);

//         const response = await fetch(
//             badgeApiUrl,
//             {
//                 headers: {
//                     "User-Agent":
//                         "Mozilla/5.0",
//                     "Accept":
//                         "application/json"
//                 }
//             }
//         );

//         console.log(
//             "Badge API status:",
//             response.status
//         );

//         if (!response.ok) {
//             return {
//                 profileUrl,
//                 username,
//                 success: false,
//                 error:
//                     `Badge API returned status ${response.status}`
//             };
//         }

//         const badgeData =
//             await response.json();

//         let cStars = 0;
//         let problemsSolved = 0;
//         let totalChallenges = 0;

//         if (
//             badgeData &&
//             Array.isArray(
//                 badgeData.models
//             )
//         ) {
//             const cBadge =
//                 badgeData.models.find(
//                     badge =>
//                         badge.badge_type === "c"
//                 );

//             if (cBadge) {
//                 cStars =
//                     cBadge.stars ?? 0;

//                 problemsSolved =
//                     cBadge.solved ?? 0;

//                 totalChallenges =
//                     cBadge.total_challenges ?? 0;
//             }
//         }

//         console.log(
//             "\n------------------------------"
//         );

//         console.log(
//             "Username:",
//             username
//         );

//         console.log(
//             "C Stars:",
//             cStars
//         );

//         console.log(
//             "C Problems Solved:",
//             problemsSolved
//         );

//         console.log(
//             "Total C Challenges:",
//             totalChallenges
//         );

//         console.log(
//             "------------------------------"
//         );

//         return {
//             profileUrl,
//             username,
//             cStars,
//             problemsSolved,
//             totalChallenges,
//             success: true
//         };

//     } catch (error) {

//         console.error(
//             "Profile error:",
//             error.message
//         );

//         return {
//             profileUrl,
//             success: false,
//             error:
//                 error.message
//         };
//     }
// }

// module.exports = {
//     getHackerRankProgress
// };


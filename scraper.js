const { chromium } = require("playwright");

let browser;
let context;
let page;


// =======================================
// Start Browser
// =======================================

async function startBrowser() {

    if (browser) {
        return;
    }

    browser = await chromium.launch({

        // Keep false while developing
        // Change to true when deploying
        //headless: false,
        //slowMo: 100
        headless: true,
    });

    context = await browser.newContext();

    page = await context.newPage();

    console.log("Browser started.");

}


// =======================================
// Get HackerRank Progress
// =======================================

async function getHackerRankProgress(profileUrl) {

    await startBrowser();

    try {

        console.log("\n=================================");
        console.log("Opening:", profileUrl);
        console.log("=================================");


        // =======================================
        // Validate Profile URL
        // =======================================

        if (
            !profileUrl.includes(
                "hackerrank.com/profile/"
            )
        ) {

            return {

                profileUrl,

                success: false,

                error:
                    "Invalid HackerRank profile URL"

            };

        }


        // =======================================
        // Extract Username
        // =======================================

        const usernameMatch =
            profileUrl.match(
                /\/profile\/([^/?#]+)/
            );


        const username =
            usernameMatch
                ? usernameMatch[1]
                : "";


        // =======================================
        // WAIT FOR HACKERRANK BADGE API
        // =======================================

        /*
            IMPORTANT:

            We start waiting for the API
            BEFORE opening the page.

            This prevents us from missing
            the API response.
        */

        const responsePromise =
            page.waitForResponse(

                response => {

                    const url =
                        response.url();

                    return (

                        url.includes(
                            "/rest/hackers/"
                        )

                        &&

                        url.includes(
                            "/badges"
                        )

                        &&

                        response.status() === 200

                    );

                },

                {
                    timeout: 15000
                }

            ).catch(() => null);


        // =======================================
        // Open HackerRank Profile
        // =======================================

        await page.goto(
            profileUrl,
            {

                waitUntil:
                    "domcontentloaded",

                timeout:
                    30000

            }
        );


        // =======================================
        // Get Badge API Response
        // =======================================

        const badgeResponse =
            await responsePromise;


        // =======================================
        // Read API JSON
        // =======================================

        let badgeData = null;


        if (badgeResponse) {

            try {

                badgeData =
                    await badgeResponse.json();

                console.log(
                    "Badge API received."
                );

            } catch (error) {

                console.log(
                    "Could not read badge API response."
                );

            }

        } else {

            console.log(
                "Badge API response not received."
            );

        }


        // =======================================
        // Give HackerRank additional time
        // =======================================

        await page.waitForTimeout(3000);


        // =======================================
        // Extract C Data
        // =======================================

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
                    cBadge.stars || 0;

                problemsSolved =
                    cBadge.solved || 0;

                totalChallenges =
                    cBadge.total_challenges || 0;

            }

        }


        // =======================================
        // Page Information
        // =======================================

        const title =
            await page.title();

        const currentUrl =
            page.url();


        // =======================================
        // Display Result
        // =======================================

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


        // =======================================
        // Return Result
        // =======================================

        return {

            profileUrl,

            username,

            title,

            currentUrl,

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
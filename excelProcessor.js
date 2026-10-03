const XLSX = require("xlsx");

const {
    getHackerRankProgress
} = require("./scraper");

async function processExcel(filePath) {

    const workbook =
        XLSX.readFile(filePath);

    const sheetName =
        workbook.SheetNames[0];

    const worksheet =
        workbook.Sheets[sheetName];

    const students =
        XLSX.utils.sheet_to_json(
            worksheet,
            {
                defval: ""
            }
        );

    console.log(
        `Found ${students.length} students`
    );

    if (students.length === 0) {
        throw new Error(
            "Excel file is empty"
        );
    }

    const firstRow =
        students[0];

    if (
        !Object.prototype.hasOwnProperty.call(
            firstRow,
            "Student name"
        )
    ) {
        throw new Error(
            'Excel column "Student name" not found'
        );
    }

    if (
        !Object.prototype.hasOwnProperty.call(
            firstRow,
            "Hacker Rank Link"
        )
    ) {
        throw new Error(
            'Excel column "Hacker Rank Link" not found'
        );
    }

    const results = [];

    for (
        let i = 0;
        i < students.length;
        i++
    ) {

        const student =
            students[i];

        const studentName =
            String(
                student["Student name"]
            ).trim();

        const profileUrl =
            String(
                student["Hacker Rank Link"]
            ).trim();

        console.log(
            `\nProcessing ${i + 1}/${students.length}`
        );

        console.log(
            "Student:",
            studentName
        );

        // Validate URL
        if (
            !profileUrl ||
            !profileUrl.includes(
                "hackerrank.com/profile/"
            )
        ) {

            results.push({
                studentName,
                profileUrl,
                username: "",
                cStars: "",
                problemsSolved: "",
                totalChallenges: "",
                status: "Invalid URL",
                error:
                    "HackerRank profile URL required"
            });

            continue;
        }

        const data =
            await getHackerRankProgress(
                profileUrl
            );

        results.push({
            studentName,
            profileUrl,

            username:
                data.username || "",

            cStars:
                data.cStars ?? "",

            problemsSolved:
                data.problemsSolved ?? "",

            totalChallenges:
                data.totalChallenges ?? "",

            status:
                data.success
                    ? "Success"
                    : "Failed",

            error:
                data.error || ""
        });

        console.log(
            `Completed ${i + 1}/${students.length}`
        );
    }

    return results;
}

module.exports = {
    processExcel
};
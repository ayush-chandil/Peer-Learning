// Pie chart - for completed, in-progress and not started 
const constants = require("../../const");
const fs = require("fs")

exports.plot6 = async (req, res) => {

    var comp = 0;
    var inComp = 0;
    var rest = 0;

    const client = await constants.connect();
    const db = client.db("peerlearning");
    const assignID = req.query.peerAssignment_id;
    let cursor = db.collection("peeractivities").find({ peerAssignment_id: assignID });

    var authors = {};

    await cursor.forEach((doc) => {
        // console.log(!(doc.author_id in authors));
        if (!(doc.author_id in authors)) {
            authors[doc.author_id] = true;
        }
    });

    // console.log(Object.keys(authors).length);

    for (let [key, value] of Object.entries(authors)) {


        let cursor2 = db.collection("peeractivities").find({
            peerAssignment_id: assignID,
            reviewer_id: key,
        });
        var counter = 0;
        var full = 0;
        var empty = 0;
        await cursor2.forEach((doc) => {
            if (doc.review_score.length == 0) {
                empty++;
            } else {
                full++;
            }
            counter++;
        });

        if (empty == counter) {
            inComp++;
        } else if (full == counter) {
            comp++;
        } else {
            rest++;
        }


    }

    var Data = [comp, inComp, rest];

    client.close();

    // plotly
    const Labels = ["Completed", "In Progress", "Not Started"];
    const BgColor = [
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 206, 86, 0.3)',
        'rgba(255, 99, 132, 0.4)',
    ];
    const BdColor = [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)',
    ];

    var data = [{
        values: Data,
        labels: Labels,
        textinfo: "label+percent",
        insidetextorientation: "radial",
        marker: {
            colors: BgColor,
            opacity: 1,
            line: {
                color: BdColor,
                width: 1
            }
        },
        type: 'pie'
    }];

    var layout = {
        height: 700,
        width: 600
    };

    var config = {
        showLink: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        responsive: true,
        displayModeBar: true
    };


    // const jsonData = JSON.stringify(data, null, 2);

    // fs.writeFile('../data.json', jsonData, err => {
    //     if (err) {
    //         console.log('Error writing file', err)
    //     } else {
    //         console.log('Successfully wrote file')
    //     }
    // });

    // const jsonConfig = JSON.stringify(config, null, 2);

    // fs.writeFile('../config.json', jsonConfig, err => {
    //     if (err) {
    //         console.log('Error writing file', err)
    //     } else {
    //         console.log('Successfully wrote file')
    //     }
    // });

    // const jsonLayout = JSON.stringify(layout, null, 2);

    // fs.writeFile('../layout.json', jsonLayout, err => {
    //     if (err) {
    //         console.log('Error writing file', err)
    //     } else {
    //         console.log('Successfully wrote file')
    //     }
    // });


    let final_return = { "data": data, "config": config, "layout": layout };
    res.status(200).send(final_return);





}
// plot("60bb05715c06600004e6cc66").then((result) => {
//     console.log(result.data);
//     console.log(result.config);
//     console.log(result.layout);
// });;
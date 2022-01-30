//**************************************<Bar Chart SelfVsPeer>*******************************************/
const constants = require("../../const");
const fs = require("fs");

const sum = constants.sum;


// async function plot(authorID, assignID) {
exports.plot10 = async (req, res) => {
    const BarBgColor = ['rgba(255, 99, 132, 0.2)'];

    const BarBdColor = ['rgba(255, 99, 132, 1)'];

    const peerBgColor = 'rgba(153, 102, 255, 0.2)';
    const peerBdColor = 'rgba(153, 102, 255, 1)';


    const client = await constants.connect();
    const db = client.db("peerlearning");
    const assignID = req.query.peerAssignment_id;
    const authorID = req.query.author_id;
    let result = db.collection("peeractivities").find({ peerAssignment_id: assignID, author_id: authorID });
    // console.log(result.data);

    var scores = [];
    var names = ['self'];

    await result.forEach((doc) => {
        if (doc.author_id == doc.reviewer_id) {
            scores.splice(0, 0, sum(doc.review_score));
        } else {
            scores.push(sum(doc.review_score));
        }
    })

    for (let i = 1; i < scores.length; i++) {
        BarBgColor.push(peerBgColor);
        BarBdColor.push(peerBdColor);
        names.push('R' + i);
    }


    var trace0 = {
        y: scores,
        x: names,
        name: "Class Avg.",
        text: scores,
        textposition: 'auto',
        // hovertemplate: reviewer[0] + ' - %{y:.2f}<extra></extra>',
        hoverinfo: 'none',
        marker: {
            color: BarBgColor,
            opacity: 1,
            line: {
                color: BarBdColor,
                width: 1
            }
        },

        type: 'bar'
    };


    var data = [trace0];


    var config = {
        showLink: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        displayModeBar: true,
        responsive: true
    };


    var layout = {
        title: 'Me Vs. Peers',
        // barmode: 'group',
        // width: 700,
        // height: 400,
        xaxis: {
            // title: 'Question',
            autotypenumbers: 'strict',
        },
        yaxis: {
            title: 'Score',
            autotypenumbers: 'strict',
        },
        // bargap: 1
    }

    const jsonData = JSON.stringify(data, null, 2);

    fs.writeFile('../data.json', jsonData, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    });

    const jsonConfig = JSON.stringify(config, null, 2);

    fs.writeFile('../config.json', jsonConfig, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    });

    const jsonLayout = JSON.stringify(layout, null, 2);

    fs.writeFile('../layout.json', jsonLayout, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    });

    client.close();

    let final_return = { "data": data, "config": config, "layout": layout };
    res.status(200).send(final_return);
}






// plot("107478614765781013827", "607a7bcbc46da70004b6daad")
//     .then((result) => {
//         console.log(result.data);
//         console.log(result.config);
//         console.log(result.layout);
//     });

//***************************************<END Bar Chart SelfVsPeer>********************************************/
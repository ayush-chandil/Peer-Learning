const constants = require("../../const");
const fetch = require('node-fetch');
const querystring = require('querystring');
const fs = require("fs");
var DataFrame = require('dataframe-js').DataFrame;

function transposeArray(array) {
    var arrayLength = array[0].length + 1;
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
        newArray.push([]);
    };

    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < arrayLength; j++) {
            newArray[j].push(array[i][j]);
        };
    };

    return newArray;
}


exports.plot5 = async (req, res) => {

    const parameters = {
        peer_assignment_id: req.query.peer_assignment_id,
    }
    const get_request_args = querystring.stringify(parameters);


    const url = "http://" + constants.hostname + ":" + String(constants.port) + '/api/peeractivity/?' + get_request_args;

    let response = await fetch(url);
    let json = await response.json();


    var authors = {};
    var studentID = [];
    var PeerMarks = [];
    let ptr = 0


    json.forEach((doc) => {
        if (!(doc.author_id in authors)) {
            authors[doc.author_id] = true;

        }
    });


    for (const [key, value] of Object.entries(authors)) {
        PeerMarks.push([]);
        studentID.push(key);

        json.forEach(doc => {
            if (doc.author_id == key) {

                if (doc.author_id == doc.reviewer_id) {

                    PeerMarks[ptr].splice(0, 0, constants.sum(doc.review_score));
                } else {
                    PeerMarks[ptr].push(constants.sum(doc.review_score));
                }


            }
        });

        ptr++;

    }
    // colPeerMarks = transposeArray(PeerMarks);

    // console.log(PeerMarks[0].length);
    // console.log(colPeerMarks);

    const df = new DataFrame(PeerMarks);
    var colPeerMarks = [];
    for (let i = 0; i < PeerMarks[0].length; i++) {
        colPeerMarks.push(df.toArray(i + ""));
    }
    console.log(colPeerMarks.length);



    // Plotly Data
    var data = [];
    let self = {

        x: studentID,
        y: colPeerMarks[0],
        mode: 'markers',
        type: 'scatter',
        name: 'Self',
        textposition: 'auto',

        marker: {
            color: constants.borderColor[0],
            opacity: 1,
            line: {
                color: constants.borderColor[0],
                width: 1
            }
        },
    };
    data.push(self);

    for (let i = 1; i < colPeerMarks.length; i++) {



        let temp = {

            x: studentID,
            y: colPeerMarks[i],
            mode: 'markers',
            type: 'scatter',
            name: 'R' + i,
            textposition: 'auto',

            marker: {
                color: constants.borderColor[i % 5],
                opacity: 1,
                line: {
                    color: constants.borderColor[i % 5],
                    width: 1
                }
            },
        };

        data.push(temp);

    }

    var config = {
        showLink: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        responsive: true,
        displayModeBar: true,
    };


    var layout = {
        title: 'Marks Distribution',
        // barmode: 'group',
        // width: 700,
        // height: 400,
        xaxis: {
            title: 'Student ID',
            autotypenumbers: 'strict',
        },
        yaxis: {
            title: 'Marks',
            autotypenumbers: 'strict',
        },
        // bargap: 1
    }

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

// plot("607a7bcbc46da70004b6daad").then((result) => {
//     console.log(result.data);
//     console.log(result.config);
//     console.log(result.layout);
// });;
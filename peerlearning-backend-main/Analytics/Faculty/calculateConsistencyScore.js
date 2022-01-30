const constants = require("../../const");
var ObjectId = require('mongodb').ObjectId;

const average = constants.average;
const sum = constants.sum;


function roundToTwo(num) {
    return +(Math.round(num + "e+1") + "e-1");
}


// std : Faculty can fine tune tolerance in marks. 
function xlfNormalSdistPDF(mu, std, x) {

    var z = (x - mu) / std;

    if (Number.isNaN(z)) {
        return 0;
    }

    var num = Math.exp(-1 / 2 * z * z);
    var denom = Math.sqrt(2 * Math.PI);
    return (num / denom);
}



// This function would be triggered after all peer submits their reviews
// Parameters : assignID => ID of assignment 
//              force => (boolean )flag to indicate if faculty has triggered function by force.

//  async function UpdateQuestionConsistency(assignID, force) {
    exports.plot3 = async(req, res) => {

    // step 1 : Get all reviews where peerAssignment_id= assignID
    // step 2 : create a set of all authors and iterate over them get all documents where authorID matches
    // step 3 : find mean for all collected reviews per question
    // step 4 : calculate probability and normalize it 
    // step 5 : push Qconst to database 


    const client = await constants.connect();
    const db = client.db("peerlearning");

    var tolerance = 1;
        const assignID = req.query.peerAssignment_id;
        const force = req.query.force;
        if (!force) {

        let isEmpty = await db.collection("peeractivities").findOne({ peerAssignment_id: assignID, review_score: { $eq: [] } });

        if (isEmpty) {
            client.close();
            return new Promise((resolve, reject) => {
                reject("Null reviews found and function wasn't executed by force");
            });
        }
    }


    let totalQueQuery = await db.collection("assignments").findOne((assignID));
    var totalQue = totalQueQuery.total_questions;
    console.log(totalQue);
    let cursor = db.collection("peeractivities").find({ peerAssignment_id: assignID });

    var authors = {};
    await cursor.forEach((doc) => {
        // console.log(!(doc.author_id in authors));
        if (!(doc.author_id in authors)) {
            authors[doc.author_id] = true;
        }
    });


    var AconstLog = {};
    var AvgGradeLog = {};

    for (let [key, value] of Object.entries(authors)) {


        // Find all reviews where author id matches
        let cursor2 = db.collection("peeractivities").find({
            peerAssignment_id: assignID,
            author_id: key,
            review_score: { $ne: [] }
        });

        var means = new Array(totalQue).fill(0);
        let counter = 0;

        // calculate mean ordered by question for all reviews given to a particular author
        await cursor2.forEach((doc) => {
            counter++;
            for (let i = 0; i < doc.review_score.length; i++) {
                means[i] += doc.review_score[i];
            }
        });

        // console.log(counter);

        for (let i = 0; i < means.length; i++) {
            means[i] = means[i] / counter;
        }


        let ctr = 0;



        await cursor2.forEach((doc) => {
            ctr++;

            if (doc.author_id in AvgGradeLog) {
                AvgGradeLog[doc.author_id].push(sum(doc.review_score));
            } else {
                AvgGradeLog[doc.author_id] = [sum(doc.review_score)];
            }

            var Qconst = new Array(totalQue).fill(0);

            for (let i = 0; i < totalQue; i++) {
                Qconst[i] = 50 / 4 * xlfNormalSdistPDF(means[i], tolerance, doc.review_score[i]);
            }


            if (doc.reviewer_id in AconstLog) {
                AconstLog[doc.reviewer_id].push(average(Qconst));
            } else {
                AconstLog[doc.reviewer_id] = [average(Qconst)];
            }

            db.collection("peeractivities").update({ _id: doc._id }, { $set: { 'Qconst': Qconst } });
        });

    }



    for (let [key, value] of Object.entries(AconstLog)) {
        console.log(AvgGradeLog[key]);

        // Push Aconst to DB here
        let doc = {
            User_id: key,
            Assignment_id: assignID,
            Aconst: average(value),
            final_grade: average(AvgGradeLog[key])
        }

        let res = await db.collection("assignment_scores").findOne(doc)

        if (res) {
            await db.collection("assignment_scores").updateOne({ _id: res._id }, { $set: doc });
        } else {
            await db.collection("assignment_scores").insertOne(doc);
        }

        // console.log(key);

    }

    client.close();;

}



// UpdateQuestionConsistency("607a7bcbc46da70004b6daad", true)
//     .then(() => {
//         console.log("Consistency score updated successfully!!");
//     })
//     .catch((err) => { console.log(err) });
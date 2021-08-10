require('dotenv').config();
const cheerio = require('cheerio');
const request = require('request');
const nodemailer = require('nodemailer');
const url = `https://www.rtu.ac.in`;

request(url, (err, res, body) => {
    if (err) {
        console.log(err);
    } else {
        getAllNotices(body);
    }
});


function getAllNotices(html) {
    let email_id = `nbtaylor1031@gmail.com`;
    let $ = cheerio.load(html);
    let noticesArray = $('.news-container a');
    let finalMessage = "";
    for (let i = 0; i < noticesArray.length; i++) {
        let noticeTitle = $(noticesArray[i]).text();
        let fullNoticeLink = url + $(noticesArray[i]).attr('href');
        finalMessage += `Title: ${noticeTitle}\nLink: ${fullNoticeLink}\n\n`;

    }
    sendEmail(email_id, finalMessage)

}

async function sendEmail(email_id, msg) {
    try {
        const transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nbtaylor1031@gmail.com',
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: `nbtaylor1031@gmail.com`,
            to: email_id,
            subject: 'RTU Latest Notices',
            text: msg
        }

        await transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info.response);
            }
        });
    } catch (err) {
        console.log(err);
    }
}
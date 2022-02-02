const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { response } = require('express');

mailchimp.setConfig({
    apiKey: "<YOUR API KEY>",
    server: "us14",
});

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
})

app.post('/', (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const listId = "<YOUR LIST ID>";
    const subscribeData = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }
    const subscribe = async () => {
        const response = await mailchimp.lists.batchListMembers(listId, subscribeData);
        if(response.error_count == 0){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
    };
    subscribe();
})


app.post('/failure', (req, res)=>{
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => {
    console.log("listening at port 3000");
})
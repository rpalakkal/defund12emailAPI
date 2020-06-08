const express = require('express')
const app = express()
const got = require('got');
require('dotenv').config();

const baseURL = "https://www.googleapis.com/civicinfo/v2/representatives"
var searchQuery = {
    includeOffices: true,
    key: process.env.key
}

app.get('/api', async (req, res) => {
    searchQuery["address"]=req.query.address
    const response = await got(baseURL, {searchParams: searchQuery} );
    const parsedResponse = JSON.parse(response.body)
    let rawEmails = [];
    parsedResponse['officials'].forEach(element => {
        if("emails" in element){
            rawEmails = rawEmails.concat(element["emails"])
        }
    });
    const uniqueEmails = new Set(rawEmails);
    emails = [...uniqueEmails]
    console.log(emails)
    res.status(200).json(emails)
    
    
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))


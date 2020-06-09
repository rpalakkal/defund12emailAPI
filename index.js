const express = require('express')
const app = express()
const got = require('got');
var cors = require('cors');
require('dotenv').config();

const baseURL = "https://www.googleapis.com/civicinfo/v2/representatives"
var searchQuery = {
    includeOffices: true,
    key: process.env.key
}

app.use(cors());
app.get('/api', async (req, res) => {
    searchQuery["address"]=req.query.address
    try{
        const response = await got(baseURL, {searchParams: searchQuery} )
        const parsedResponse = JSON.parse(response.body)
        console.log(parsedResponse)
        const officialIndexLength = parsedResponse['officials'].length
        const officialIndex = new Array(officialIndexLength)
        parsedResponse['offices'].forEach((element)=>
            element['officialIndices'].map(number => officialIndex[number]=element['name'])
        )

        let data = [];
        parsedResponse['officials'].forEach((element, key) => {
            if("emails" in element){

                let official = {email: element["emails"][0], title: officialIndex[key], name:element["name"]}
                
                
                // if(parsedResponse["offices"][key-1]["name"]){
                //     official.title=parsedResponse["offices"][key-1]["name"]
                // }
                // if(element["name"]){
                //     official.name = element["name"]
                // }
                data.push(official)
            }
        });
        res.status(200).json({data})
    } catch(error) {
        console.log(error)
        res.status(401).send('Error: Something went wrong. Please retry search.')
    }
    
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))


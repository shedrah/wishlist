//TWITCH API
const request = require("request");
var accessToken = '';
var box_art ='';
function gameRequest(accessToken, title){
    setTimeout(() => {
    const gameOptions = {
        url: 'https://api.twitch.tv/helix/games?name=' + title, //insert name
        method: 'GET',
        headers:{
            'Client-ID': 'w90oqmu9u0of2vsh0xnv6qxivn8bko',
            'Authorization': 'Bearer ' + accessToken
        }
    }
    if(!accessToken){
        console.log("No Token");
    }else{
        request.get(gameOptions,(err,res,body) => {
            if(err){
                return console.log(err);
            }
            //console.log(`Status: ${res.statusCode}`);
            //console.log(JSON.parse(body));
            var data = JSON.parse(body)
            try{ 
                var box_art_URL = data.data[0].box_art_url
                box_art = box_art_URL.replace(/({width})/gm, '171').replace(/({height})/gm, '228');
            }catch{
                box_art = "https://static-cdn.jtvnw.net/ttv-static/404_boxart.jpg"
            }
            //console.log(`${box_art}`)
        });
        console.log(tempImage)
    };
    
    },2000)

}

const options = {
    url: 'https://id.twitch.tv/oauth2/token',
    json:true,
    body: {
    client_id: 'w90oqmu9u0of2vsh0xnv6qxivn8bko',
    client_secret: '548agyhmyp8eca5cc7xvyi6jcsn2t8',
    grant_type: 'client_credentials'
    }
};
var name = "dota 2"
request.post(options, (err,res,body)=>{
    if(err){
        return console.log(err);
    }
    gameRequest(body.access_token, name);
});
console.log(box_art)
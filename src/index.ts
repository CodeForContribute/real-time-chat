import http from 'http';
import {server as WebSocketServer,connection} from 'websocket';
import { InComingMessage } from './messages/incommingMessages';

// first create a simple http server
const server = http.createServer(function(request:any, response:any){
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080, function(){
    console.log((new Date()) + ' Server is listening on port 8080');
})

// create a webSocket Server 
const wss = new WebSocketServer({
    httpServer:server,
    autoAcceptConnections:false 
});

function originIsAllowed(origin:string){
    return true;
}

wss.on('request',function(request){
    console.log("inside connect");
    if(!originIsAllowed(request.origin)){
        // make sure we only accept request from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected');
        return;
    }
    //  if request from this origin is allowed
    var connection = request.accept('echo-protocol',request.origin);
    console.log((new Date()) + ' Connection accpted');
    connection.on('message',function(message){
        // Todo add rate limit logic here
        if(message.type == 'utf8'){
            try{
                messageHandler(connection,JSON.parse(message.utf8Data));
            }catch(e){

            }
        }
    });
});

function messageHandler(ws:connection,message:InComingMessage){

}
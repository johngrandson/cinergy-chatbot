const watson = require('watson-developer-cloud/assistant/v1');
const prompt = require('prompt-sync')();
require('dotenv').config();

const chatbot = new watson({
    url: process.env.URL,
    iam_apikey: process.env.API_KEY,
    version: process.env.VERSION
});

const workspace_id = process.env.WORKSPACE_ID;

chatbot.message({ workspace_id }, trataResposta);

let fimDeConversa = false;

function trataResposta(err, resposta) {
    if (err) {
        console.log(err);
        return;
    }

    if (resposta.intents.length > 0) {
        console.log('Eu detectei a intenção: ' + resposta.intents[0].intent);
        if (resposta.intents[0].intent == 'despedida' || resposta.intents[0].intent == 'General_Ending') {
            fimDeConversa = true;
        }


        if (resposta.intents[0].intent == 'horario') {
            console.log(`Agora são ${new Date().toLocaleTimeString()}.`);
        }
    }

    if (resposta.output.text.length > 0) {
        console.log(resposta.output.text[0]);
    }

    if (!fimDeConversa) {
        const mensagemUsuario = prompt('>');
        chatbot.message({
            workspace_id,
            input: { text: mensagemUsuario }
        }, trataResposta);
    }
}
const rp = require('request-promise');

Promise = require('bluebird');

const trelloApi = 'https://api.trello.com/1';

const getCardChecklist = Promise.coroutine(function* (cardId, token, closed){
  const apiReq = {
    uri: `${trelloApi}/cards/${cardId}/checklists`,
    qs: { checkItems: "all", fields: "idCard", key: process.env.APP_KEY, token: token },
    json: true
  };
  let response;
  try {
    response = yield rp.get(apiReq);
  } catch (apiErr) {
    console.error(`Error! cardId=${cardId} error=${apiErr.message}`);
    return apiErr.message;
  }
  return response;
});
  
const routes = (app) => {
  app.post('/checklist', Promise.coroutine(function* (req, res) {
    const token = req.body.token;
    const cardId = req.body.cardId;
    
    const data = yield getCardChecklist(cardId, token, true);
    
    return res.json(data);
  }));
};

module.exports = routes;
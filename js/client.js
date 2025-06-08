const CHECKED_ICON =
  "https://80577ad7-375e-4771-b570-5340dc0b1d4c-00-26xqhqnv1vpi2.pike.replit.dev/icons/cancel.svg";

const CANCEL_ICON =
  "https://80577ad7-375e-4771-b570-5340dc0b1d4c-00-26xqhqnv1vpi2.pike.replit.dev/icons/cancel.svg";

const TRELLO_API = 'https://api.trello.com/1';

const LONG_WHITESPACE = " ".repeat(20);

TrelloPowerUp.initialize({
  "card-badges": async function (t) {
    try {
      const api = t.getRestApi();
      const isAuthorized = await api.isAuthorized();
      if (!isAuthorized) {
        return [];
      }
      const token = await api.getToken();
      const isVisible = await t.get("card", "private", "visible_checklist");

      if (isVisible) {
        const cardId = await t.card("id").get("id");
        const isVisibleAll = await t.get("card", "private", "visible_all");

        const queryParams = new URLSearchParams();
        queryParams.append("checkItems", "all");
        queryParams.append("fields", "idCard");
        queryParams.append("key", '885d304e9f94f998313493345cca08f2');
        queryParams.append("token", token);

        const data = await fetch(`${TRELLO_API}/cards/${cardId}/checklists?${queryParams}`, {
          method: "GET",
        });
        const json = await data.json();

        const badges = [];
        json.forEach(list => {
          if (list.checkItems.length) {
            list.checkItems.sort((a, b) =>
              a.pos > b.pos ? 1 : -1
            );

            list.checkItems.forEach(item => {
              if (item.state == "complete" && isVisibleAll) {
                badges.push({
                  text: `☑ ${item.name} ${LONG_WHITESPACE}`,
                  icon: null,
                  color: null
                });
              }

              if (item.state == "incomplete") {
                badges.push({
                  text: `☐ ${item.name} ${LONG_WHITESPACE}`,
                  icon: null,
                  color: null
                });
              }
            });
          }
        });

        return badges;
      }

      return [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  "card-back-section": function (t, opts) {
    return {
      title: "Checklists Settings",
      icon: CHECKED_ICON,
      content: {
        type: "iframe",
        url: t.signUrl("./settings.html"),
        height: 50,
      },
    };
  },
},
  {
    appKey: "885d304e9f94f998313493345cca08f2",
    appName: "Visible Checklists",
    appAuthor: "Saveliy Pivovarov",
  });

console.log("It works!");

/* global TrelloPowerUp */

window.Promise = TrelloPowerUp.Promise;

const GREEN_ICON =
  "https://cdn.glitch.com/048cbd7b-9fd3-452b-99cf-31d496e75f52%2Fchecked.svg?v=1631668282836";
const RED_ICON =
  "https://cdn.glitch.com/048cbd7b-9fd3-452b-99cf-31d496e75f52%2Fcancel.svg?v=1631668282835";
const MONEY_ICON = "https://cdn.glitch.com/048cbd7b-9fd3-452b-99cf-31d496e75f52%2Fcoin.svg?v=1632157941438";

const TRELLO_API = "https://api.trello.com/1";

// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
  "board-buttons": function(t, opts) {
    if (opts.context.permissions.board !== "write") {
      return [];
    }
    return t.get("member", "private", "token").then(function(token) {
      let ICON = GREEN_ICON;
      if (!token) {
        ICON = RED_ICON;
      }
      return [
        {
          icon: MONEY_ICON,
          text: "RUB -> USD",
          callback: function(t) {
            t.popup({
              title: "Online Conversion",
              url: "./conversion.html",
              height: 100
            });
          }
        },
        {
          icon: ICON,
          text: "Auth",
          callback: function(t) {
            if (!token) {
              t.popup({
                title: "Authorize Your Account",
                url: "./auth.html",
                height: 75
              });
            }
          }
        }
      ];
    });
  },
  "card-badges": function(t, opts) {
    return t.get("member", "private", "token").then(function(token) {
      return t.get("card", "private", "vs").then(function(vs) {
        if (vs) {
          return t
            .card("id")
            .get("id")
            .then(function(cardId) {
              return t.get("card", "private", "va").then(function(va) {
                return fetch("/checklist", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  body: `token=${token}&cardId=${cardId}`
                })
                  .then(data => data.json())
                  .then(json => {
                    let badges = [];
                    const long = " ".repeat(20);

                    json.forEach(list => {
                      if (list.checkItems.length > 0) {
                        list.checkItems.sort((a, b) =>
                          a.pos > b.pos ? 1 : -1
                        );

                        list.checkItems.forEach(item => {
                          if (item.state == "complete" && va) {
                            badges.push({
                              text: `☑ ${item.name} ${long}`,
                              icon: null,
                              color: null
                            });
                          }

                          if (item.state == "incomplete") {
                            badges.push({
                              text: `☐ ${item.name} ${long}`,
                              icon: null,
                              color: null
                            });
                          }
                        });
                      }
                    });

                    return badges;
                  });
              });
            });
        }
      });
    });
  },
  "card-back-section": function(t, opts) {
    return {
      title: "Checklists Settings",
      icon: GREEN_ICON,
      content: {
        type: "iframe",
        url: t.signUrl("./state.html"),
        height: 30
      }
    };
  }
});

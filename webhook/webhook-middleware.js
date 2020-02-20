const qs = require("../plaid/plaidModel.js");

module.exports = async (req, res, next) => {
  const body = req.body;

  console.log("WHATS HITTING THE WEBHOOK", body);

  try {
    //This is the item_id generated by Plaid. NOT the id column in the item table.NOT the primary key of that table
    const item_id = body.item_id;
    //pgItemId holds the id that IS the primary key of the item table.
    const pgItemId = await qs.WEB_get_pg_itemid(item_id);

    //This is getting the userID for later. We need to get the userID from the item_id plaid gave us to get the EXACT user
    const userID = await qs.WEB_get_userID(item_id);

    //this is the current day
    var end = new Date()
      .toISOString()
      .replace(/-/g, "-")
      .split("T")[0];
    //all three of these are to get 30 days behind the current day
    var today = new Date();
    var start = new Date().setDate(today.getDate() - 30);
    var start = new Date(start)
      .toISOString()
      .replace(/-/g, "-")
      .split("T")[0];

    if (!item_id || !pgItemId || !userID) {
      const items = await qs.WEB_get_all_item_data();
      console.log(`item_id:${item_id}, pgItemId:${pgItemId}, userID:${userID}`);
      console.log("here are the items in the db", items);
      res.end();
    } else {
      body.item_id = item_id;
      body.pgItemId = pgItemId;
      body.userID = userID;
      body.start = start;
      body.end = end;
      next();
    }
  } catch (err) {
    console.log("WEB-MIDLEWARE", err);
  }
};

const express = require("express");
const path = require("path");
const {connectToMongoDB} = require("./connect");
const URL = require('./models/url');
const shortid = require("shortid");


const urlRoute = require("./routes/url");
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

const app = express();
const PORT = 8001;


connectToMongoDB('mongodb://localhost:27017/short-url').then(() => 
    console.log("mongo db connected"));

app.set("view engine","ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 


app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render("home",{
      urls: allUrls,
    });
});


app.use("/url", urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.get('/url/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true }
  );
  if (!entry) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  res.redirect(entry.redirectURL);
});


app.listen(PORT, () =>console.log(`server started at port 8001`));
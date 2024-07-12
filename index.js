const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Url = require('./models/url');
require('dotenv').config();

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;

  try {
    let url = await Url.findOne({ longUrl });

    if (!url) {
      url = new Url({ longUrl });
      await url.save();
    }

    res.json({ shortUrl: `cuturl-chi.vercel.app/${url.shortUrl}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/:shortUrl', async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });

    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).send('URL not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

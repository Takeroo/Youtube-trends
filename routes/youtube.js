import express from 'express';
import * as config from '../config.json';
import { YoutubeService } from '../services/youtube';

const router = express.Router();
const service = new YoutubeService();
var selectedCountryCode = "US";
/* GET home page. */
router.get('/', async (req, res) => {
  selectedCountryCode  =  req.query.code || "US";
  res.locals.selectedCountryCode = selectedCountryCode;
  res.locals.countries = config.countryList;
  const trends = await service.getTrendingVideos(selectedCountryCode);
  res.render('youtube/index', {
    title: config.title,
    videos: trends
  });
});

router.get('/:videoId', async (req, res) => {
  if(req.query.code){
    res.redirect('/youtube?code=' + req.query.code);
  }
  res.locals.countries = config.countryList;
  res.locals.selectedCountryCode = selectedCountryCode;
  res.render('youtube/player', {
    title: config.title
  });
});

module.exports = router;

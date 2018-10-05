import Axios from 'axios';
import * as config from '../config.json';
import moment from "moment";

const axios = Axios.create({
  baseURL: config.youtubeApi.endpoint
});

export class YoutubeService {
  getTrendingVideos(countryCode) {
    var params = {
      part: 'snippet',
      chart: 'mostPopular',
      regionCode: countryCode, // should be replaced with country code from countryList
      maxResults: '24',
      key: config.youtubeApi.key
    };
    var videos =[];
    return axios.get('/', {params}).then(function(res){
      var result = res.data.items;
      var details = [];
      result.forEach(function(item) {
          details.push(YoutubeService.getVideoDetails(item));
      });
      return Promise.all(details).then(function(detailResults){
        for(var i = 0; i<result.length; i++){
          videos.push({
            id: result[i].id,
            title: result[i].snippet.title,
            thumbnail: result[i].snippet.thumbnails.high.url,
            publishedAt: moment(result[i].snippet.publishedAt).fromNow(),
            viewCount: detailResults[i].viewCount,
            likeCount: detailResults[i].likeCount
          });
        }
        return videos;
      })
    });

  }

  static getVideoDetails(video) {
    var params = {
      part: 'statistics',
      id: video.id,
      key: config.youtubeApi.key
    };

    return axios.get('/', {params}).then(function(res) {
      var result = res.data;
      video.viewCount = result['items'][0].statistics.viewCount;
      video.likeCount = result['items'][0].statistics.likeCount;

      return video;
    });
  }
}

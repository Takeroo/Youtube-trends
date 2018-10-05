const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
chai.should();

chai.use(chaiHttp);

describe('Server', function() {

  it('should redirect on youtube trends', (done) => {
    chai.request(server)
      .get('/').redirects(0)
      .end(function(err, res){
        res.should.have.status(302);
        res.should.redirectTo('/youtube');
        done();
      });
  });

  it('should open /youtube', (done) => {
    chai.request(server)
      .get('/youtube')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });

  it('should open video by id /yotube/videoId', (done) => {
    chai.request(server)
      .get('/youtube/:videoId')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });

  it('should redirect to "/youtube" /yotube/videoId?code=', (done) => {
    let parameter = "US";
    chai.request(server)
      .get('/youtube/:videoId?code=' + parameter)
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });

  it('should return error 500', (done) => {
    chai.request(server)
      .get('/*')
      .end(function(err, res, req){
          res.should.have.status(404);
          middleware(err, req, res, function(){
            done();
          });
      });
  });
});

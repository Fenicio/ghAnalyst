var request = require('supertest');

describe('loading express', function () {
  var server, 
  app;
  beforeEach(function () {
    app = require('../../app');
    server = app.listen(8080);
  });
  afterEach(function (done) {
    server.close(done);
  });
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });
  it('responds to /user/fenicio', function testSlash(done) {
  request(server)
    .get('/user/fenicio')
    .expect(200, done);
  });
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});
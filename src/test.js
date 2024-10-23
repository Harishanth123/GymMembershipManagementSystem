import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './index.js';

const should = chai.should();
chai.use(chaiHttp);

let memberId = null;

describe('Members API', () => {
    // to test the GET all members route
    it('should GET all the members', (done) => {
        chai.request(app)
            .get('/api/members')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                done();
            });
    });

    // to test the POST a new member route
    it('should POST a new member', (done) => {
        let member = {
            name: "John Wick",
            age: 30,
            gender: "Male",
            phone: "0187654321",
            email: "john@user.com",
            membershipType: "Annual"
        };
        chai.request(app)
            .post('/api/members')
            .send(member)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name').eql('John Wick');
                memberId = res.body.id;
                done();
            });
    });

    // to test the GET a member by the given ID route
    it('should GET a member by the given ID', (done) => {
        chai.request(app)
            .get(`/api/members/${memberId}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id').eql(memberId);
                done();
            });
    });

    //to test the PUT (update) a member by the given ID route
    it('should UPDATE a member given the ID', (done) => {
        const updatedMember = {
            name: "Jane Smith",
            age: 32,
            gender: "Female",
            phone: "1234567890",
            email: "jane.smith@user.com",
            membershipType: "Monthly"
        };
        chai.request(app)
            .put(`/api/members/${memberId}`)
            .send(updatedMember)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name').eql('Jane Smith');
                done();
            });
    });

    // to test 404 for non-existent member
    it('should return 404 for a member that does not exist', (done) => {
        chai.request(app)
            .get('/api/members/9999') // Assuming 9999 is non-existent
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('message').eql('Member not found');
                done();
            });
    });

});

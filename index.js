const app = require('express')();
const bodyParser = require('body-parser');
const passport = require('passport');
const userService = require('./users/user-service')
const User = require('./users/user');
const jwt = require('jsonwebtoken');
require('./passport')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.json('Hello world!');
})

app.post('/singup', (req, res) => {
    userService.createUser({email: req.body.email, password: req.body.password}).then(u => {
        res.json(u);
    })
    .catch(err => {
        console.error('POST:/singup', err);
        res.json(err);
    })
})

app.post('/login', (req,res) => {
    User.findOne({email: req.body.email}).then(u => {
        if(!u) {
            res.sendStatus(404);
        }
        userService.comparePassword(req.body.password, u.password).then(isMatch => {
            if(!isMatch) {
                res.sendStatus(401);
            }
            const token = jwt.sign(u.toObject(), 'secret', {expiresIn:3600});
            res.json({
                token,
                claims: {
                    sub: u._id
                }
            });
        }).catch(err => {
            console.error('POST:/login',err);
            res.status(500).json(err);
        });
    })
})

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

app.get('/secure', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({secure_data:'Hello_Secure_World'});
});

app.listen(3000, () => console.log('App running on port 3000'));
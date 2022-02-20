const express = require('express');
const cors = require('cors');
const userController = require('./controllers/userController');
const bodyParser = require('body-parser')
const corsOptions ={
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200
}
const app = express()
const APP_PORT = 8001;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(corsOptions));

app.post('/register', async (req, res) => {
    
    const response = await userController.register(req);

    if (response.length > 0) {
        return res.status(442).send('User is already.');
    }

    return res.send(response);
});

app.post('/login', async (req, res) => { 
    const response = await userController.login(req);

    if (response.length === 0) {
        return res.status(401).send('Unauthorized');
    }

    return res.json(response);
});

app.get('/grade', (req, res) => {

    const { score } = req.query
    let grade;

    if (score >= 0 && score <= 59) {
        grade = 'F'
    } else if (score >= 60 && score <= 64) {
        grade = 'D'
    } else if (score >= 65 && score <= 69) {
        grade = 'D+'
    } else if (score >= 70 && score <= 74) {
        grade = 'C'
    } else if (score >= 75 && score <= 79) {
        grade = 'C+'
    } else if (score >= 80 && score <= 84) {
        grade = 'B'
    } else if (score >= 85 && score <= 89) {
        grade = 'B+'
    } else if (score >= 90) {
        grade = 'A'
    }

    return res.json({grade});
})

app.get('/profile/:id', async (req, res) => {
    const { params } = req;
    const response = await userController.getProfile(params);

    return res.send(response);
});

app.post('/profile/:id', async (req, res) => {
    const response = await userController.updateProfile(req);

    return res.send(response);
});

app.listen(APP_PORT, () => {
  console.log(`Start server at port ${APP_PORT}`)
})
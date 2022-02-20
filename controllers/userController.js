const users = require('../models/users');

exports.register = async ({body}) => {
    const data = body.formData;

    const id = await users.getNoOfLastUser();
    data['id'] = id;

    const response = await users.createUser(JSON.stringify(data));

    return response;
}

exports.login = async ({body}) => {
    const { username, password } = body.formData;

    return users.login(username, password);
}

exports.getProfile = async (params) => {
    const { id } = params;

    const user = await users.profile(id);

    return JSON.stringify(user);
}

exports.updateProfile = async (req) => {

    const {body, params} = req;
    const { id } = params;

    const user = await users.updateProfile(body, id);

    return JSON.stringify(user);
}
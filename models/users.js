const fs = require('fs');
const path = require('path');
const filePath = path.resolve('./storage/users.text');

exports.login = async (usernameInput, passwordInput) => {
    const users = await getFileContent();
    const userLogin = users.filter((user) => {
       const item = JSON.parse(user);
       return item.username === usernameInput && item.password === passwordInput
    })

    return userLogin;
}

exports.profile = async (id) => {
    return getUserById(id);
}

exports.updateProfile = async (body, id) => {
    const newValue = body.formData;
    const users = await getFileContent();
    let usersArray = users.filter((user) => JSON.parse(user).id !== parseInt(id));
    newValue['id'] = parseInt(id);
    usersArray.push(JSON.stringify(newValue));

   let dataWithNewLine = usersArray.join("\n");
   dataWithNewLine += "\n";

    fs.writeFile(filePath, dataWithNewLine, err => {
        if (err) {
            throw new Error('Cannot update user');
        }
    });

    return newValue;
}

const getUserById = async (id) => {
    const users = await getFileContent();

    const user = users.filter((user) => {
        const item = JSON.parse(user);
        return item.id === parseInt(id)
    })

    return user[0];
}

const getUserByUsername = async (username) => {
    const users = await getFileContent();
    const user = users.filter((user) => {
        const item = JSON.parse(user);
        return item.username === username
    });

    return user;
}

exports.createUser = async (body) => {
    let content = body;
    const dataObject = JSON.parse(content);
    const { username } = dataObject;
    const user = await getUserByUsername(username);

    if (user.length > 0) {
        return user;
    }
    
    content += "\n";

    fs.appendFile(filePath, content, { flag: 'a+' }, err => {
        if (err) {
            throw new Error('Cant create user');
        }
    });

    return dataObject;
}

exports.getNoOfLastUser = async () => {
    let lastNo = 1;
    const users = await getFileContent();

    if (users.length > 0) {
        lastNo = users.length + 1;
    }

    return lastNo;
}

const getFileContent = async () => {
    const users = await new Promise((resolve, reject) => {
        const data = fs.readFileSync(filePath, 'utf8', (err, data) => {
            if(err) {
                reject(err)
            }

            return data;
        })

        return resolve(data);
    });

   const userArray = users.split("\n");

    return userArray.filter((user) => user !== '' );
}
module.exports = function () {
  const faker = require("faker");
  faker.locale = "zh_CN";
  const _ = require("lodash");
  return {
    user: _.times(100, function (n) {
      return {
        id: n,
        nickname: faker.name.findName(),
        username: faker.random.number(),
        avatar: faker.internet.avatar(),
        password: '123456'
      }
    }),

  };
};

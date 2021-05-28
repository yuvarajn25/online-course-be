const { addCourse } = require("./functions/course");

module.exports = [
  {
    name: "createCourse",
    mutationHandler: addCourse,
  },
];

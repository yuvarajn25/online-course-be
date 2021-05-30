const {
  addCourse,
  addCourseVideo,
  subscribeCourse,
  addComment,
} = require("./functions/course");

module.exports = [
  {
    name: "createCourse",
    mutationHandler: addCourse,
  },
  {
    name: "createCourseVideo",
    mutationHandler: addCourseVideo,
  },
  {
    name: "subscribeCourse",
    mutationHandler: subscribeCourse,
  },
  {
    name: "addComments",
    mutationHandler: addComment,
  },
];

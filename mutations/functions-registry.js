const {
  addCourse,
  addCourseVideo,
  subscribeCourse,
  addComment,
  deleteCourse,
  deleteCourseVideo,
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
  {
    name: "deleteCourse",
    mutationHandler: deleteCourse,
  },
  {
    name: "deleteCourseVideo",
    mutationHandler: deleteCourseVideo,
  },
];

import { group } from "console";
import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  type: {
    type: String, // assignment or review
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  week: {
    type: String,
    required: true,
  },
});

const classNameSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  moodleRoom: {
    type: String,
  },
  githubRepo: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
  sessions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Session",
    },
  ],
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: String,
    required: true,
  },
});

const studentSchema = new Schema({
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  group: {
    type: String,
    required: true,
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: "ClassName",
    required: true,
  },
  activities: [
    {
      type: Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  approvedWork: [
    {
      type: Schema.Types.ObjectId,
      ref: "ApprovedWork",
    },
  ],
});

//   const teacherSchema = new Schema({
//     User: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     zoomUrl: {
//       type: String,
//     },
//     classes: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "ClassName",
//       },
//     ],
//   });

const approvedWorkSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  activity: {
    type: Schema.Types.ObjectId,
    ref: "Activity",
    required: true,
  },
  handInUrl: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
});

//   const weekSchema = new Schema({
//     name: {
//       type: String,
//       required: true,
//     },
//     date: {
//       type: String,
//       required: true,
//     },
//     class: {
//       type: Schema.Types.ObjectId,
//       ref: "ClassName",
//       required: true,
//     },
//     activities: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Activity",
//       },
//     ],
//   });

const Activity = mongoose.model("Activity", activitySchema, "activities");
const User = mongoose.model("User", userSchema, "users");
const Student = mongoose.model("Student", studentSchema, "students");
const ApprovedWork = mongoose.model(
  "ApprovedWork",
  approvedWorkSchema,
  "approvedWorks"
);
const ClassName = mongoose.model("ClassName", classNameSchema, "classes"); // third argument is the collection name. If not applied mongoose will rename the collection to plural form of the model name. For example, if the model name is Person then the collection name will be people. To avoid this we can pass the third argument as the collection name.

export { Activity, User, Student, ApprovedWork, ClassName };

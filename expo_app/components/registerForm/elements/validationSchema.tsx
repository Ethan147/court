import * as Yup from "yup";

export const passReqText =
  "password must be 8+ characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character";

export const minAge = 16;
const today = new Date();
const minimumAgeDate = new Date(
  today.getFullYear() - 16,
  today.getMonth(),
  today.getDate()
);

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(
      /^[a-zA-Z]+$/,
      "first name should only contain alphabetic characters"
    )
    .required("first name is required"),
  lastName: Yup.string()
    .matches(
      /^[a-zA-Z]+$/,
      "last name should only contain alphabetic characters"
    )
    .required("last name is required"),
  email: Yup.string()
    .email("email must be a valid email address")
    .required("email is required"),
  password: Yup.string()
    .min(8, passReqText)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
      passReqText
    )
    .required("password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "please select a gender")
    .required("gender is required"),
  age: Yup.number()
    .min(minAge, "must be at least 16 years old")
    .required("age is required"),
  birthdate: Yup.string()
    .matches(
      /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[01])\/(19|20)\d\d$/,
      "Date of birth must be in the format mm/dd/yyyy"
    )
    .required("Date of birth is required")
    .test("minimum-age", "You must be at least 16 years old", function (value) {
      const birthdate = new Date(value);
      return birthdate <= minimumAgeDate;
    }),
  address: Yup.string().required("address is required"),
  termsAccepted: Yup.bool().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
});

export default validationSchema;

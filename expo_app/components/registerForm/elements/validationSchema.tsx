import * as Yup from "yup";

const badPassText =
  "password must be 8+ characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character";

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
    .min(8, badPassText)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      badPassText
    )
    .required("password is required"),
  gender: Yup.string()
    .oneOf(
      ["male", "female", "other", "prefer_not_to_say"],
      "please select a gender"
    )
    .required("gender is required"),
  age: Yup.number()
    .min(14, "must be at least 14 years old")
    .required("age is required"),
  birthdate: Yup.date()
    .nullable()
    .required("Birthdate is required")
    .max(new Date(), "Birthdate must be in the past"),
  address: Yup.object()
    .shape({
      place_id: Yup.string().required(),
      formatted_address: Yup.string().required(),
    })
    .required("address is required")
    .test("is-address-object", "address must be a valid object", (value) => {
      return (
        !!value &&
        typeof value === "object" &&
        !!value.place_id &&
        !!value.formatted_address
      );
    }),
});

export default validationSchema;

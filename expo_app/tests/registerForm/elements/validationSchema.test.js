import * as Yup from "yup";

import validationSchema from "../../../components/registerForm/elements/validationSchema";

describe("validationSchema", () => {
  it("validates firstName correctly", async () => {
    // Valid firstName
    await expect(
      validationSchema.validateAt("firstName", { firstName: "John" })
    ).resolves.toBe("John");

    // Invalid firstName - with numbers
    await expect(
      validationSchema.validateAt("firstName", { firstName: "John1" })
    ).rejects.toThrow(Yup.ValidationError);

    // Invalid firstName - with special characters
    await expect(
      validationSchema.validateAt("firstName", { firstName: "John!" })
    ).rejects.toThrow(Yup.ValidationError);

    // Invalid firstName - empty string
    await expect(
      validationSchema.validateAt("firstName", { firstName: "" })
    ).rejects.toThrow(Yup.ValidationError);
  });

  it("validates lastName correctly", async () => {
    // Valid lastName
    await expect(
      validationSchema.validateAt("lastName", { lastName: "Doe" })
    ).resolves.toBe("Doe");

    // Invalid lastName - with numbers
    await expect(
      validationSchema.validateAt("lastName", { lastName: "Doe1" })
    ).rejects.toThrow(Yup.ValidationError);

    // Invalid lastName - with special characters
    await expect(
      validationSchema.validateAt("lastName", { lastName: "Doe!" })
    ).rejects.toThrow(Yup.ValidationError);

    // Invalid lastName - empty string
    await expect(
      validationSchema.validateAt("lastName", { lastName: "" })
    ).rejects.toThrow(Yup.ValidationError);
  });

  it("validates email correctly", async () => {
    // Valid email
    await expect(
      validationSchema.validateAt("email", { email: "john@example.com" })
    ).resolves.toBe("john@example.com");

    // Invalid email - without domain
    await expect(
      validationSchema.validateAt("email", { email: "johnexample" })
    ).rejects.toThrow(Yup.ValidationError);

    // Invalid email - missing '@'
    await expect(
      validationSchema.validateAt("email", { email: "johnexample.com" })
    ).rejects.toThrow(Yup.ValidationError);
  });

  it("validates password correctly", async () => {
    // Valid password
    const validPassword = "Password123!";
    await expect(
      validationSchema.validateAt("password", { password: validPassword })
    ).resolves.toBe(validPassword);

    // Invalid password - missing uppercase
    await expect(
      validationSchema.validateAt("password", { password: "password123!" })
    ).rejects.toThrow(Yup.ValidationError);

    // Invalid password - missing number
    await expect(
      validationSchema.validateAt("password", { password: "Password!!!" })
    ).rejects.toThrow(Yup.ValidationError);

    // Invalid password - missing special character
    await expect(
      validationSchema.validateAt("password", { password: "Password111" })
    ).rejects.toThrow(Yup.ValidationError);

    // Invalid password - too short
    await expect(
      validationSchema.validateAt("password", { password: "Pass1!" })
    ).rejects.toThrow(Yup.ValidationError);
  });

  it("ensures password and confirmPassword match", async () => {
    const validData = {
      password: "Password123!",
      confirmPassword: "Password123!",
    };

    const invalidData = {
      password: "Password123!",
      confirmPassword: "Password1234!",
    };

    await expect(
      validationSchema.validateAt("confirmPassword", validData)
    ).resolves.toBe(validData.confirmPassword);
    await expect(
      validationSchema.validateAt("confirmPassword", invalidData)
    ).rejects.toThrow(Yup.ValidationError);
  });

  it("validates gender correctly", async () => {
    // Valid gender
    await expect(
      validationSchema.validateAt("gender", { gender: "male" })
    ).resolves.toBe("male");

    await expect(
      validationSchema.validateAt("gender", { gender: "female" })
    ).resolves.toBe("female");

    await expect(
      validationSchema.validateAt("gender", { gender: "other" })
    ).resolves.toBe("other");

    // Invalid gender - not in the list
    await expect(
      validationSchema.validateAt("gender", { gender: "alien" })
    ).rejects.toThrow(Yup.ValidationError);
  });

  it("validates age correctly", async () => {
    // Valid age
    await expect(validationSchema.validateAt("age", { age: 20 })).resolves.toBe(
      20
    );

    // Invalid age - less than 16
    await expect(
      validationSchema.validateAt("age", { age: 15 })
    ).rejects.toThrow(Yup.ValidationError);
  });

  it("validates birthdate correctly", async () => {
    // Valid birthdate
    await expect(
      validationSchema.validateAt("birthdate", { birthdate: "01/01/2000" })
    ).resolves.toBe("01/01/2000");

    // Invalid birthdate - future date
    const futureYear = new Date().getFullYear() + 1;
    await expect(
      validationSchema.validateAt("birthdate", {
        birthdate: `01/01/${futureYear}`,
      })
    ).rejects.toThrow(Yup.ValidationError);

    // Invalid birthdate - not meeting age criteria
    const tooYoung = new Date().getFullYear() - 15;
    await expect(
      validationSchema.validateAt("birthdate", {
        birthdate: `01/01/${tooYoung}`,
      })
    ).rejects.toThrow(Yup.ValidationError);

    // Invalid birthdate - wrong format
    await expect(
      validationSchema.validateAt("birthdate", { birthdate: "2000/01/01" })
    ).rejects.toThrow(Yup.ValidationError);
  });

  it("validates address correctly", async () => {
    // Valid address (temporary solution just checks for presence)
    await expect(
      validationSchema.validateAt("address", { address: "123 Main St" })
    ).resolves.toBe("123 Main St");

    // Invalid address - empty string
    await expect(
      validationSchema.validateAt("address", { address: "" })
    ).rejects.toThrow(Yup.ValidationError);
  });

  it("validates termsAccepted correctly", async () => {
    // Valid termsAccepted - true
    await expect(
      validationSchema.validateAt("termsAccepted", { termsAccepted: true })
    ).resolves.toBe(true);

    // Invalid termsAccepted - false
    await expect(
      validationSchema.validateAt("termsAccepted", { termsAccepted: false })
    ).rejects.toThrow(Yup.ValidationError);
  });
});

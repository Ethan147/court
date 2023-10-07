jest.mock("expo-constants", () => ({
  manifest: {
    extra: {
      apiUrl: "http://localhost:8080/api",
    },
  },
}));

jest.mock("expo-modules-core", () => ({}));

jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => {
  const mockComponent = jest.fn(() => "Icon");
  return {
    Ionicons: mockComponent,
    MaterialIcons: mockComponent,
    // add other icons you use here...
  };
});

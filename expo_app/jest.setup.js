jest.mock("react-native/Libraries/BatchedBridge/NativeModules", () => ({
  __fbBatchedBridgeConfig: true,
}));
jest.mock(
  "react-native/Libraries/Utilities/NativePlatformConstantsIOS.js",
  () => ({
    getConstants: () => ({
      interfaceIdiom: "phone",
    }),
  })
);
jest.mock("react-native", () => {
  return {
    ...jest.requireActual("react-native"),
    PlatformConstants: {
      getConstants: jest.fn(() => ({
        isTesting: true,
        reactNativeVersion: {
          major: 0,
          minor: 61,
          patch: 5,
          prerelease: null,
        },
      })),
    },
  };
});
jest.mock("react-native/Libraries/Utilities/NativeDeviceInfo", () => ({
  getConstants: () => ({
    isTesting: true,
    uniqueId: "uniqueId",
    model: "iPhone X",
    brand: "Apple",
    systemName: "iOS",
    systemVersion: "14.1",
  }),
}));
jest.mock("react-native/Libraries/Utilities/Dimensions", () => ({
  get: (dim) => ({
    height: dim === "window" ? 640 : 0,
    width: dim === "window" ? 360 : 0,
    scale: 2,
    fontScale: 2,
  }),
}));

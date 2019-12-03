//jest.mock("Dimensions")

import { Text } from "react-native";
import React from "react";
import StylesProvider from "../StylesProvider";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("should has default theme", () => {
  //   const tree = renderer.create(<App />).toTree();
  //   expect(tree).toMatchSnapshot();
  renderer.create(
    <StylesProvider theme={"default"}>
      <Text>123</Text>
    </StylesProvider>
  );
});

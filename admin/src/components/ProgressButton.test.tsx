import React from "react";
import renderer from "react-test-renderer";
import { ProgressButton } from "./ProgressButton";

test("Render normal button", () => {
  const component = renderer.create(
    <ProgressButton variant="contained" color="primary">
      Hello World
    </ProgressButton>
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Render fullwidth button", () => {
  const component = renderer.create(
    <ProgressButton fullWidth>Hello World</ProgressButton>
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Render loading button", () => {
  const component = renderer.create(
    <ProgressButton loading>Hello World</ProgressButton>
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

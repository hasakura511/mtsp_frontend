import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import NavigationItems from "./NavigationItems";
import { NavLink } from "react-router-dom";

configure({ adapter: new Adapter() });

describe("TESTCOMPONENT: <NavigationItems />", () => {
  it("should render 2 <NavigationItem /> elements if not authenticated", () => {
    const wrapper = shallow(<NavigationItems />);
    expect(wrapper.find(NavLink)).toHaveLength(0);
  });
});

import Subject from "../ToolBar";

describe("<ToolBar />", () => {
  it("renders without crashing", () => {
    shallow(<Subject handleSplit={sinon.spy()} />);
  });

  describe("renders correctly", () => {
    it("with props", () => {
      const tree = renderer
        .create(<Subject handleSplit={sinon.spy()} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it("calls handleSplit prop once when handleSplit function is called", () => {
    const mockHandleSplit = sinon.spy();
    const subject = shallow(<Subject handleSplit={mockHandleSplit} />);
    subject.instance().handleSplitButton();
    const mockCalled = mockHandleSplit.called;
    expect(mockCalled).toBe(true);
  });
});

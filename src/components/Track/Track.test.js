import Subject from './Track'

const mockProps = {
  id: 'abc123',
  file: '/home/test.wav'
}

describe('<Track />', () => {

  it('renders without crashing', () => {
    shallow(<Subject { ...mockProps } />)
  })

  it('renders as a div with class: `track`', () => {
    const wrapper = shallow(<Subject { ...mockProps } />)
    assume(wrapper.is('div.track')).to.be.equal(true)
  })

  it('renders a div with class: `controls`', () => {
    const wrapper = shallow(<Subject { ...mockProps } />)
    assume(wrapper.find('div.controls')).to.have.length(1)
  })

  it('renders a span tag with class: `name`', () => {
    const wrapper = shallow(<Subject { ...mockProps } />)
    assume(wrapper.find('span.name')).to.have.length(1)
  })

  it('renders a button with class: `remove`', () => {
    const wrapper = shallow(<Subject { ...mockProps } />)
    assume(wrapper.find('button.remove')).to.have.length(1)
  })

  it('remove() is called when you click the remove button with parameter passed', () => {
    const handleRemoveMock = sinon.spy()
    const wrapper = shallow(
      <Subject
        { ...mockProps }
        remove={handleRemoveMock}
      />
    )
    wrapper.find('button.remove').simulate('click')
    assume(handleRemoveMock.called).to.be.equal(true)
    assume(handleRemoveMock.called).to.not.be.equal(false)
  })

  it('renders a div with class: `display`', () => {
    const wrapper = shallow(<Subject { ...mockProps } />)
    assume(wrapper.find('div.controls')).to.have.length(1)
  })

  it('renders <Waveform />', () => {
    const wrapper = shallow(<Subject { ...mockProps } />)
    assume(wrapper.find('Waveform')).to.have.length(1)
  })

  it('function readPath(path) sets the state appropriately after reading a wav file', () => {
    const wrapper = shallow(<Subject { ...mockProps } />)
    // Try to read a real wav file
    wrapper.instance().readPath('./example/sample.wav')
    .then(() => {
      assume(wrapper.state('sampleRate')).to.not.equal(undefined)
      assume(wrapper.state('length')).to.not.equal(undefined)
      assume(wrapper.state('maxAmplitude')).to.not.equal(undefined)
      assume(wrapper.state('grains').length).to.be.above(0)
    })
  })

})
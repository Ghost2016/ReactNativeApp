import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16.1';
Enzyme.configure({ adapter: new Adapter() });

/* jest.mock('react-native-sound', () => () => ({
  play: jest.fn(),
}));

jest.mock('react-native-simple-toast', () => () => ({
  SHORT: jest.fn(),
}));

jest.mock('Linking', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
  getInitialURL: jest.fn(),
}));
 */

jest.mock('react-native', () => ({
  NetInfo: {
      addEventListener: jest.fn(),
      fetch: () => {
          return {
              done: jest.fn()
          }
      }
  },
  NativeModules: {
      RNPasscodeStatus: {
          supported: jest.fn(),
          status: jest.fn(),
          get: jest.fn()
      }
  },
  Dimensions: {
      get: () => ({
          width: jest.fn(),
          height: jest.fn()
      })
  },
}));

jest.mock('react-native-wechat', () => {
  return {
    registerApp: jest.fn(),
  };
});

//VictoryChart
jest.mock('victory-native', () => {
  return {
    VictoryTheme: jest.fn(),
  };
});

//react-native-navigation
jest.mock('react-native-navigation', () => {
  return {
    Navigation: {
      registerComponent: jest.fn()
    },
  };
});

jest.mock('reactotron-react-native', () => {
  return {
    asyncStorage: jest.fn(),
    networking: jest.fn(),
    openInEditor: jest.fn(),
    configure: () => {
      return {
        useReactNative: () => {
          return {
            use: () => {
              return {
                use: () => {
                  return {
                    use: () => {
                      return {
                        use: () => {
                          return {
                            connect: jest.fn()
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
          }
        }
      }
    },
  };
});

jest.mock('reactotron-redux', () => {
  return {
    reactotronRedux: jest.fn(),
  };
});

const mockPressable = (name) => {
  const RealComponent = require.requireActual(name);

  class Component extends RealComponent {

    render() {
      return React.createElement(
        RealComponent.displayName || RealComponent.name,
        { ...this.props, onClick: this.props.onPress },
        this.props.children
      );
    }

  }

  return Component;
};


jest.mock('TouchableOpacity', () => mockPressable('TouchableOpacity'));

/* jest.mock('Animated', () => {
  return {
    createTimer: jest.fn(),
    timing: jest.fn(() => {
      return {
        start: jest.fn(),
      };
    }),
    Value: jest.fn(() => {
      return {
        interpolate: jest.fn(),
      };
    }),
  };
}); */

//Date.now = jest.fn(() => 1534052329230);

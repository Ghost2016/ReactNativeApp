//方便开发的工具

export const gotoGrowBtn = {
  rightButtons: [
    {
      title: "进入成长", // for a textual button, provide the button title (label)
      id: "gotoGrow", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      testID: "e2e_rules2", // optional, used to locate this view in end-to-end tests
      //disabled: true, // optional, used to disable the button (appears faded and doesn't interact)
      //disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
      showAsAction: "ifRoom", // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
      buttonColor: "blue", // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
      buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
      buttonFontWeight: "600" // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
    }
  ]
};

export const actionGotoGrow = function(
  store,
  login,
  event,
  root = "after-login"
) {
  if (event.id == "gotoGrow") {
    //console.log('NavBar', 'Edit button pressed');
    store.dispatch(login(root));
  }
};

export const backToLoginBtn = {
  rightButtons: [
    {
      title: "返回登录", // for a textual button, provide the button title (label)
      id: "backToLogin", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      testID: "e2e_rules", // optional, used to locate this view in end-to-end tests
      //disabled: true, // optional, used to disable the button (appears faded and doesn't interact)
      //disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
      showAsAction: "ifRoom", // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
      buttonColor: "blue", // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
      buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
      buttonFontWeight: "600" // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
    }
  ]
};

export const actionBackToLogin = function(store, login, event, root = "login") {
  console.log("actionBackToLogin", event);
  if (event.id == "backToLogin") {
    //console.log('NavBar', 'Edit button pressed');
    store.dispatch(login(root));
  }
};

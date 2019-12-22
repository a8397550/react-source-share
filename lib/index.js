var OtherComponent = React.lazy(function () {
  return import('./OtherComponent');
});

function MyComponent() {
  return React.createElement("div", null, React.createElement(OtherComponent, null));
}
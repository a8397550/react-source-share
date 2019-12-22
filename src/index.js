const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent () {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
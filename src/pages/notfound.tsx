export default function NotFound() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
          <a href="/" className="btn btn-primary">
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}

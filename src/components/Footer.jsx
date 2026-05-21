
export function Footer() {
  return (
    <>
      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container text-center">
          <h4 className="text-danger fw-bold">Smart School ERP</h4>

          <p className="mb-2">
            Manage Students, Teachers, Attendance, Fees, Exams & Library
            Efficiently.
          </p>

          <div className="d-flex justify-content-center gap-4 mb-3">
            <span role="button">
              <i className="bi bi-facebook fs-4"></i>
            </span>

            <span role="button">
              <i className="bi bi-instagram fs-4"></i>
            </span>

            <span role="button">
              <i className="bi bi-twitter-x fs-4"></i>
            </span>

            <span role="button">
              <i className="bi bi-linkedin fs-4"></i>
            </span>
          </div>

          <hr className="border-light" />

          <p className="mb-0">© 2026 Smart School ERP | All Rights Reserved</p>
        </div>
      </footer>
    </>
  );
}

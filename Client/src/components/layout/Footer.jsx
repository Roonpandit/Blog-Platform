import "./Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">BlogPlatform</h3>
            <p className="footer-description">
              Share your thoughts and connect with others through our blogging platform.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/create-post">Create Post</a>
              </li>
              <li>
                <a href="/profile">Profile</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <p className="footer-contact">
              Email: contact@blogplatform.com
              <br />
              Phone: (123) 456-7890
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; {currentYear} BlogPlatform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


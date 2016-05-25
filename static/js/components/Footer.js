import React from 'react';

class Footer extends React.Component {
  static propTypes = {
    empty: React.PropTypes.bool
  };

  render () {
    return (
      <footer>
        <div className="container">
          <div className="row">
             <div className="col-md-6">
               <img src="/static/images/logo-mit-white.png" width="90" className="pull-left"
                 height="65" alt="MIT Micromasters" />
             </div>
             <div className="col-md-6">
                <button href="https://giving.mit.edu/" target="_blank"
                  className="btn default footer-btn-give-mit pull-right">Give to MIT</button>
             </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="footer-links pull-left">
                <a href="https://www.edx.org/" target="_blank">edX</a> <a
                  href="https://odl.mit.edu/" target="_blank">Office of Digital Learning</a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <p className="pull-left">Massachusetts Institute of Technology<br/> Cambridge, MA 02139</p>
            </div>
            <div className="col-md-6">
              <br/><br/>
              <p className="pull-right">&copy; 2016, Massachusetts Institute of Technology</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

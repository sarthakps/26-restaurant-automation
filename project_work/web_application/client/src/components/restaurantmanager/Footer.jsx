import React from 'react'
import './footer.css'
import sample from './chef_y.svg'

function Footer() {
    return (
        <footer id="footer" class="footer-1">
            <div class="main-footer widgets-dark typo-light">
            <div class="container">
            <div class="row" style={{marginTop: "80px"}}>

                <div class="col-xs-12 col-sm-6 col-md-3">
                <img src={sample} style={{height: "50px", width: "180px", marginBottom:"20px"}}/>
                    <div class="widget no-box">
                    <h5 class="widget-title">Reach Us<span></span></h5>
                            <div>
                                <a href="#"> <i class="fas fa-map-marker-alt"></i> &nbsp; 15, Yemen road, Yemen </a>
                            </div>
                             <div style={{paddingTop: "10px"}}>
                             <a href="#"> <i class="fas fa-phone-alt"></i> &nbsp;  Phone : &nbsp; (+91) 4625718</a> 
                            </div> 
                            
                            <div style={{paddingTop: "10px"}}>
                                <a href="#"> <i class="fas fa-envelope"></i> &nbsp; support@eataliano.com </a>
                            </div>
                             
                    </div>
            </div>
            <br />
            <br />

            </div>
            </div>
            
            <div class="footer-copyright" style={{marginTop: "80px"}}>
            <div class="container">
            <div class="row">
            <div class="col-md-12 text-center">
            <p>Copyright Design Restaurant Automation © 2021. All rights reserved.</p>
            </div>
            </div>
            </div>
            </div>
        </div>
</footer>
    )
}

export default Footer
